import { bootstrap, ProductService, RequestContextService, TaxCategoryService, AssetService, ProductVariantService, TransactionalConnection } from '@vendure/core';
import { config } from './vendure-config';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

async function run() {
    const app = await bootstrap(config);
    const productService = app.get(ProductService);
    const productVariantService = app.get(ProductVariantService);
    const taxService = app.get(TaxCategoryService);
    const assetService = app.get(AssetService);
    const requestContextService = app.get(RequestContextService);
    const ctx = await requestContextService.create({ apiType: 'admin' });

    console.log('🚀 Starting PRODUCT SYNC...');

    try {
        const csvPath = path.join(__dirname, '../import-data/products.csv');
        const fileContent = fs.readFileSync(csvPath, 'utf-8');
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            bom: true 
        }) as any[]; 

        const taxCategories = await taxService.findAll(ctx);
        const gst5 = taxCategories.items.find(cat => cat.name === 'GST5');

        for (const [index, record] of records.entries()) {
            try {
                const productName = record.name || `Product ${index + 1}`;
                const productSlug = record.slug || `product-${index + 1}`;
                
                // --- 1. CHECK IF PRODUCT EXISTS ---
                const existing = await productService.findAll(ctx, {
                    filter: { name: { eq: productName } }
                });

                if (existing.items.length > 0) {
                    console.log(`  ⏭️  Skipping: "${productName}" (Already exists in database)`);
                    continue; 
                }

                console.log(`\n[${index + 1}/${records.length}] Importing: ${productName}`);

                // --- 2. IMAGE UPLOAD ---
                let assetId: string | undefined;
                if (record.assets) {
                    const imagePath = path.resolve(__dirname, '../assets', record.assets);
                    if (fs.existsSync(imagePath)) {
                        const stream = fs.createReadStream(imagePath);
                        const asset = await assetService.create(ctx, {
                            file: {
                                createReadStream: () => stream,
                                filename: record.assets,
                                mimetype: 'image/jpeg',
                            } as any,
                        });
                        if ((asset as any).id) assetId = (asset as any).id;
                    }
                }

                // --- 3. CREATE PRODUCT ---
                const product = await productService.create(ctx, {
                    enabled: true,
                    assetIds: assetId ? [assetId] : [],
                    featuredAssetId: assetId,
                    translations: [{
                        languageCode: ctx.languageCode,
                        name: productName,
                        slug: productSlug,
                        description: record.description || '',
                    }],
                });

                // --- 4. CREATE VARIANT ---
                const variantPrice = parseFloat(record.variantPrice) || 0;
                await productVariantService.create(ctx, [{
                    productId: product.id,
                    sku: record.variantSku || `SKU-${productSlug}`,
                    price: Math.round(variantPrice), 
                    taxCategoryId: gst5?.id,
                    stockOnHand: parseInt(record.variantStockOnHand) || 0,
                    trackInventory: 'TRUE' as any, 
                    translations: [{
                        languageCode: ctx.languageCode,
                        name: productName,
                    }],
                }]);

                console.log(`  ✓ Success: Created ID ${product.id}`);

            } catch (err: any) {
                console.error(`  ❌ Error on row ${index + 1}:`, err.message);
            }
        }

        console.log('\n✨ SYNC COMPLETE!');

    } catch (err) {
        console.error('❌ Critical error:', err);
    }

    await app.close();
    process.exit(0);
}

run();