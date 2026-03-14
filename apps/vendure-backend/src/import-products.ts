import { bootstrap, TransactionalConnection } from '@vendure/core';
import { config } from './vendure-config';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

interface CsvRow {
    variantSku: string;
    variantPrice: string;
    variantStockOnHand: string;
    variantTaxCategory?: string;
}

async function run() {

    console.log('⚡ Starting Vendure Variant Update Engine');

    const app = await bootstrap(config);
    const connection = app.get(TransactionalConnection);

    const schema = process.env.DB_SCHEMA || 'vendure';

    try {

        // prevent supabase timeout
        await connection.rawConnection.query(`SET statement_timeout = 0`);

        const csvPath = path.join(__dirname, '../import-data/products.csv');

        if (!fs.existsSync(csvPath)) {
            throw new Error(`CSV not found at ${csvPath}`);
        }

        const records: CsvRow[] = parse(
            fs.readFileSync(csvPath, 'utf8'),
            { columns: true, skip_empty_lines: true, trim: true }
        );

        console.log(`📦 Loaded ${records.length} rows`);

        // load tax categories
        const taxRows = await connection.rawConnection.query(
            `SELECT id, name FROM "${schema}"."tax_category"`
        );

        const taxMap = new Map<string, number>();

        for (const t of taxRows) {
            taxMap.set(t.name.toUpperCase(), t.id);
        }

        console.log(`🧾 Tax categories loaded: ${taxMap.size}`);

        let updated = 0;
        let skipped = 0;

        for (const row of records) {

            const sku = row.variantSku?.trim();

            if (!sku) {
                skipped++;
                continue;
            }

            // find variant
            const variantRes = await connection.rawConnection.query(
                `SELECT id FROM "${schema}"."product_variant" WHERE sku = $1`,
                [sku]
            );

            if (!variantRes.length) {
                console.log(`⚠ SKU not found: ${sku}`);
                skipped++;
                continue;
            }

            const variantId = variantRes[0].id;

            const price = Math.round(parseFloat(row.variantPrice || '0') * 100);
            const stock = parseInt(row.variantStockOnHand || '0');

            const taxId =
                row.variantTaxCategory &&
                taxMap.get(row.variantTaxCategory.toUpperCase());

            const queries: Promise<any>[] = [];

            // update price
            queries.push(
                connection.rawConnection.query(
                    `
                    UPDATE "${schema}"."product_variant_price"
                    SET price = $1
                    WHERE "variantId" = $2
                    `,
                    [price, variantId]
                )
            );

            // update stock
            queries.push(
                connection.rawConnection.query(
                    `
                    UPDATE "${schema}"."stock_level"
                    SET "stockOnHand" = $1
                    WHERE "productVariantId" = $2
                    `,
                    [stock, variantId]
                )
            );

            // update tax category
            if (taxId) {
                queries.push(
                    connection.rawConnection.query(
                        `
                        UPDATE "${schema}"."product_variant"
                        SET "taxCategoryId" = $1
                        WHERE id = $2
                        `,
                        [taxId, variantId]
                    )
                );
            }

            await Promise.all(queries);

            updated++;

            if (updated % 100 === 0) {
                console.log(`✅ Updated ${updated} variants`);
            }
        }

        console.log(`\n🎉 Update Finished`);
        console.log(`✔ Updated: ${updated}`);
        console.log(`⚠ Skipped: ${skipped}`);

    } catch (err) {

        console.error('❌ ERROR:', err);

    } finally {

        await app.close();
        process.exit(0);

    }
}

run();