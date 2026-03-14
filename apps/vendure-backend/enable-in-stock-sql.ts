/**
 * Vendure: Re-enable In-Stock Products via Direct DB
 *
 * Connects directly to your Supabase PostgreSQL database.
 * Only re-enables products that actually have stock > 0.
 *
 * Dry run first (safe, no changes):
 *   $env:DRY_RUN="true"; npx ts-node enable-in-stock-sql.ts
 *
 * Apply:
 *   $env:DRY_RUN="false"; npx ts-node enable-in-stock-sql.ts
 */

import { Client } from 'pg';
import 'dotenv/config';

const DRY_RUN = process.env.DRY_RUN !== 'false'; // default to DRY RUN for safety
const DB_SCHEMA = process.env.DB_SCHEMA || 'vendure';

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Vendure: Re-enable In-Stock Products (Direct DB)');
  console.log(`  Schema:  ${DB_SCHEMA}`);
  console.log(`  DRY RUN: ${DRY_RUN ? 'YES ⚠️  (no changes will be made)' : 'NO 🔴 (will enable products)'}`);
  console.log('═══════════════════════════════════════════════════════\n');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('✅ Connected to Supabase database\n');

  try {
    // Find all DISABLED products where at least one variant has stock > 0
    const previewQuery = `
      SELECT
        p.id,
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
      WHERE p.enabled = false
        AND p."deletedAt" IS NULL
      GROUP BY p.id, pt.name
      HAVING SUM(CASE WHEN sa."stockOnHand" > 0 THEN 1 ELSE 0 END) > 0
      ORDER BY pt.name;
    `;

    const { rows: inStockProducts } = await client.query(previewQuery);

    if (inStockProducts.length === 0) {
      console.log('✅ No disabled products with stock found. Nothing to re-enable.');
      return;
    }

    console.log(`📦 Found ${inStockProducts.length} disabled products that now have stock:\n`);
    inStockProducts.forEach((row, i) => {
      console.log(`  ${String(i + 1).padStart(4)}. [${row.id}] ${row.name} (${row.variants_in_stock}/${row.variant_count} variants in stock)`);
    });

    // Summary
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
    console.log(`   Will be re-enabled now: ${inStockProducts.length}`);

    if (DRY_RUN) {
      console.log('\n⚠️  DRY RUN — no changes made.');
      console.log('   To apply, run:');
      console.log('   $env:DRY_RUN="false"; npx ts-node enable-in-stock-sql.ts\n');
      return;
    }

    // Apply — re-enable all in-stock products
    console.log(`\n🔄 Re-enabling ${inStockProducts.length} products...`);

    const ids = inStockProducts.map(r => r.id);

    const updateQuery = `
      UPDATE ${DB_SCHEMA}.product
      SET enabled = true
      WHERE id = ANY($1::int[])
        AND "deletedAt" IS NULL
      RETURNING id;
    `;

    const { rows: updated } = await client.query(updateQuery, [ids]);

    console.log(`\n═══════════════════════════════════════════════════════`);
    console.log(`✅ Done! Successfully re-enabled ${updated.length} products.`);
    console.log(`═══════════════════════════════════════════════════════`);

    console.log(`
⚡ Next step: Reindex search in Vendure Admin Dashboard
   → Catalog → Products → Reindex
   This ensures the storefront reflects the changes immediately.
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