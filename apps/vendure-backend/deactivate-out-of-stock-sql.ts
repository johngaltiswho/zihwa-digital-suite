/**
 * Vendure: Deactivate Out-of-Stock Products via Direct DB
 * 
 * Connects directly to your Supabase PostgreSQL database.
 * No need for the deployed API URL.
 * 
 * Run (dry run first!):
 *   $env:DRY_RUN="true"; npx ts-node deactivate-out-of-stock-sql.ts
 * 
 * Then to apply:
 *   $env:DRY_RUN="false"; npx ts-node deactivate-out-of-stock-sql.ts
 */

import { Client } from 'pg';
import 'dotenv/config';

const DRY_RUN = process.env.DRY_RUN !== 'false'; // default to DRY RUN for safety
const DB_SCHEMA = process.env.DB_SCHEMA || 'vendure';

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Vendure: Deactivate Out-of-Stock Products (Direct DB)');
  console.log(`  Schema:  ${DB_SCHEMA}`);
  console.log(`  DRY RUN: ${DRY_RUN ? 'YES ⚠️  (no changes will be made)' : 'NO 🔴 (will disable products)'}`);
  console.log('═══════════════════════════════════════════════════════\n');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('✅ Connected to Supabase database\n');

  try {
    // ─────────────────────────────────────────────────────
    // STEP 1: Preview — find all enabled products where
    // every variant has stockOnHand <= 0
    // ─────────────────────────────────────────────────────
    const previewQuery = `
      SELECT
        p.id,
        p.enabled,
        pt.name,
        COUNT(pv.id) AS variant_count,
        SUM(CASE WHEN sa."stockOnHand" > 0 THEN 1 ELSE 0 END) AS variants_in_stock
      FROM ${DB_SCHEMA}.product p
      JOIN ${DB_SCHEMA}.product_translation pt
        ON pt."baseId" = p.id AND pt."languageCode" = 'en'
      JOIN ${DB_SCHEMA}.product_variant pv
        ON pv."productId" = p.id AND pv."deletedAt" IS NULL
      LEFT JOIN ${DB_SCHEMA}.stock_level sa
        ON sa."productVariantId" = pv.id
      WHERE p.enabled = true
        AND p."deletedAt" IS NULL
      GROUP BY p.id, p.enabled, pt.name
      HAVING SUM(CASE WHEN sa."stockOnHand" > 0 THEN 1 ELSE 0 END) = 0
      ORDER BY pt.name;
    `;

    const { rows: outOfStockProducts } = await client.query(previewQuery);

    if (outOfStockProducts.length === 0) {
      console.log('✅ No enabled out-of-stock products found! Nothing to do.');
      return;
    }

    console.log(`📦 Found ${outOfStockProducts.length} enabled products with NO stock:\n`);
    outOfStockProducts.forEach((row, i) => {
      console.log(`  ${String(i + 1).padStart(4)}. [${row.id}] ${row.name} (${row.variant_count} variants)`);
    });

    // ─────────────────────────────────────────────────────
    // STEP 2: Count summary
    // ─────────────────────────────────────────────────────
    const summaryQuery = `
      SELECT
        COUNT(*) FILTER (WHERE p.enabled = true)  AS total_enabled,
        COUNT(*) FILTER (WHERE p.enabled = false) AS total_disabled,
        COUNT(*)                                   AS total_products
      FROM ${DB_SCHEMA}.product p
      WHERE p."deletedAt" IS NULL;
    `;
    const { rows: [summary] } = await client.query(summaryQuery);

    console.log(`\n📊 Database Summary:`);
    console.log(`   Total products:         ${summary.total_products}`);
    console.log(`   Currently enabled:      ${summary.total_enabled}`);
    console.log(`   Currently disabled:     ${summary.total_disabled}`);
    console.log(`   Will be disabled now:   ${outOfStockProducts.length}`);
    console.log(`   Will remain enabled:    ${Number(summary.total_enabled) - outOfStockProducts.length}`);

    if (DRY_RUN) {
      console.log('\n⚠️  DRY RUN — no changes made.');
      console.log('   To apply, run:');
      console.log('   $env:DRY_RUN="false"; npx ts-node deactivate-out-of-stock-sql.ts\n');
      return;
    }

    // ─────────────────────────────────────────────────────
    // STEP 3: Apply — disable all out-of-stock products
    // ─────────────────────────────────────────────────────
    console.log(`\n🔄 Disabling ${outOfStockProducts.length} products...`);

    const ids = outOfStockProducts.map(r => r.id);

    const updateQuery = `
      UPDATE ${DB_SCHEMA}.product
      SET enabled = false
      WHERE id = ANY($1::int[])
        AND "deletedAt" IS NULL
      RETURNING id;
    `;

    const { rows: updated } = await client.query(updateQuery, [ids]);

    console.log(`\n═══════════════════════════════════════════════════════`);
    console.log(`✅ Done! Successfully disabled ${updated.length} products.`);
    console.log(`═══════════════════════════════════════════════════════`);

    // ─────────────────────────────────────────────────────
    // STEP 4: Rebuild search index hint
    // ─────────────────────────────────────────────────────
    console.log(`
⚡ Next step: Reindex search in Vendure Admin Dashboard
   → Go to your Admin Dashboard
   → Catalog → Products
   → Or via Admin API: mutation { reindex { id } }

   This ensures the storefront search reflects the changes immediately.
`);

  } finally {
    await client.end();
    console.log('🔌 Database connection closed.');
  }
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err.message);
  process.exit(1);
});