import { bootstrap, TransactionalConnection } from '@vendure/core';
import { config } from './vendure-config';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

// 1. Define an interface for your CSV structure
interface CsvRow {
    name: string;
    assets?: string;
    slug?: string;
    description?: string;
    variantSku: string;
    variantPrice: string;
    optionValue?: string;
    variantTaxCategory?: string;
    variantStockOnHand: string;
}

async function run() {
    console.log('⚡ Starting Ultra-Fast Smart Import Engine (V8.1 Table Fix)...');
    const app = await bootstrap(config);
    const connection = app.get(TransactionalConnection);
    
    const schema = process.env.DB_SCHEMA || 'vendure';
    console.log(`🛠️ Targeting Schema: "${schema}"`);

    try {
        await connection.rawConnection.query(`SET statement_timeout = 0; SET search_path TO "${schema}", public;`);
        
        const csvPath = path.join(__dirname, '../import-data/products.csv');
        if (!fs.existsSync(csvPath)) throw new Error(`CSV file not found at ${csvPath}`);
        
        // 2. Explicitly type the records variable
        const records: CsvRow[] = parse(fs.readFileSync(csvPath, 'utf-8'), { 
            columns: true, skip_empty_lines: true, trim: true, bom: true 
        });

        // --- 1. PRE-FETCH METADATA ---
        const [stockRes, channelRes, assetRes, taxRes] = await Promise.all([
            connection.rawConnection.query(`SELECT id FROM "${schema}"."stock_location" LIMIT 1`),
            connection.rawConnection.query(`SELECT id, code, "defaultCurrencyCode" FROM "${schema}"."channel" WHERE code IN ('__default_channel__', 'stalks-n-spice')`),
            connection.rawConnection.query(`SELECT id, name FROM "${schema}"."asset"`),
            connection.rawConnection.query(`SELECT id, name FROM "${schema}"."tax_category"`)
        ]);

        if (channelRes.length === 0) throw new Error("CRITICAL: Target channels not found.");
        
        const stockLocId = stockRes[0].id;
        const targetChannels = channelRes;

        // 3. Cast IDs to strings to avoid 'unknown' or '{}' assignment errors
        const assetMap = new Map<string, string>(
            assetRes.map((a: any) => [a.name.trim().toLowerCase(), String(a.id)])
        );
        const taxMap = new Map<string, string>(
            taxRes.map((t: any) => [t.name.toUpperCase(), String(t.id)])
        );
        const defaultTaxId = taxRes[0]?.id ? String(taxRes[0].id) : undefined;

        console.log(`📸 Asset Library: ${assetMap.size} images ready.`);

        // --- 2. DEDUPLICATION & IMAGE PARSING ---
        const productMap = new Map<string, any>();
        for (const row of records) {
            const name = row.name?.trim();
            if (!name) continue;
            
            if (!productMap.has(name)) {
                const assetNames = (row.assets || '').split(',').map((a: string) => a.trim().toLowerCase());
                const validAssetIds: string[] = [];
                for (const aName of assetNames) {
                    const id = assetMap.get(aName);
                    if (id) validAssetIds.push(id);
                }

                productMap.set(name, {
                    name,
                    slug: `${row.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.floor(Math.random() * 10000)}`,
                    description: row.description || '',
                    assetIds: validAssetIds,
                    variants: []
                });
            }
            productMap.get(name).variants.push(row);
        }

        console.log(`🚀 Starting Bulk Import of ${productMap.size} products...`);

        // --- 3. MAIN LOOP ---
        let processedCount = 0;
        for (const [pName, pData] of productMap) {
            try {
                // A. Create Product
                const pRes = await connection.rawConnection.query(
                    `INSERT INTO "${schema}"."product" ("createdAt", "updatedAt", "enabled") VALUES (NOW(), NOW(), true) RETURNING id`
                );
                const productId = pRes[0].id;

                // B. Parallel Product Setup
                const productTasks = [
                    connection.rawConnection.query(
                        `INSERT INTO "${schema}"."product_translation" ("createdAt", "updatedAt", "languageCode", "name", "slug", "description", "baseId") 
                         VALUES (NOW(), NOW(), 'en', $1, $2, $3, $4)`, [pData.name, pData.slug, pData.description, productId]
                    )
                ];

                // Link Product Assets
                if (pData.assetIds.length > 0) {
                    productTasks.push(connection.rawConnection.query(`UPDATE "${schema}"."product" SET "featuredAssetId" = $1 WHERE id = $2`, [pData.assetIds[0], productId]));
                    for (let i = 0; i < pData.assetIds.length; i++) {
                        productTasks.push(connection.rawConnection.query(`INSERT INTO "${schema}"."product_asset" ("productId", "assetId", "position") VALUES ($1, $2, $3)`, [productId, pData.assetIds[i], i]));
                    }
                }
                
                for (const chan of targetChannels) {
                    productTasks.push(connection.rawConnection.query(`INSERT INTO "${schema}"."product_channels_channel" ("productId", "channelId") VALUES ($1, $2) ON CONFLICT DO NOTHING`, [productId, chan.id]));
                }
                await Promise.all(productTasks);

                // C. Process Variants
                for (const vRow of pData.variants as CsvRow[]) {
                    const sku = vRow.variantSku.trim();
                    const price = Math.round(parseFloat(String(vRow.variantPrice || '0').replace(/[^0-9.]/g, '')) * 100);
                    const combinedName = vRow.optionValue ? `${pData.name} - ${vRow.optionValue.trim()}` : pData.name;
                    const taxCategoryId = (vRow.variantTaxCategory ? taxMap.get(vRow.variantTaxCategory.toUpperCase()) : null) || defaultTaxId;

                    const vRes = await connection.rawConnection.query(
                        `INSERT INTO "${schema}"."product_variant" 
                        ("createdAt", "updatedAt", "enabled", "sku", "trackInventory", "productId", "taxCategoryId", "featuredAssetId") 
                        VALUES (NOW(), NOW(), true, $1, 'TRUE', $2, $3, $4) RETURNING id`, 
                        [sku, productId, taxCategoryId, pData.assetIds[0] || null]
                    );
                    const variantId = vRes[0].id;

                    const variantTasks = [
                        connection.rawConnection.query(`INSERT INTO "${schema}"."product_variant_translation" ("createdAt", "updatedAt", "languageCode", "name", "baseId") VALUES (NOW(), NOW(), 'en', $1, $2)`, [combinedName, variantId]),
                        connection.rawConnection.query(`INSERT INTO "${schema}"."stock_level" ("createdAt", "updatedAt", "stockOnHand", "stockAllocated", "productVariantId", "stockLocationId") VALUES (NOW(), NOW(), $1, 0, $2, $3)`, [parseInt(vRow.variantStockOnHand) || 0, variantId, stockLocId])
                    ];

                    for (const chan of targetChannels) {
                        variantTasks.push(connection.rawConnection.query(`INSERT INTO "${schema}"."product_variant_channels_channel" ("productVariantId", "channelId") VALUES ($1, $2)`, [variantId, chan.id]));
                        variantTasks.push(connection.rawConnection.query(`INSERT INTO "${schema}"."product_variant_price" ("createdAt", "updatedAt", "price", "channelId", "variantId", "currencyCode") VALUES (NOW(), NOW(), $1, $2, $3, $4)`, [price, chan.id, variantId, chan.defaultCurrencyCode]));
                    }

                    if (pData.assetIds.length > 0) {
                        for (let i = 0; i < pData.assetIds.length; i++) {
                            variantTasks.push(connection.rawConnection.query(`INSERT INTO "${schema}"."product_variant_asset" ("productVariantId", "assetId", "position") VALUES ($1, $2, $3)`, [variantId, pData.assetIds[i], i]));
                        }
                    }

                    await Promise.all(variantTasks);
                }
                
                processedCount++;
                if (processedCount % 50 === 0) console.log(`⏳ Progress: ${processedCount} / ${productMap.size} products`);
            } catch (innerErr) {
                console.error(`❌ Error on product "${pName}":`, (innerErr as any).message);
            }
        }

        console.log('\n✨ IMPORT FINISHED.');
    } catch (err) {
        console.error(`\n❌ FATAL ERROR:`, err);
    } finally {
        await app.close();
        process.exit(0);
    }
}

run();