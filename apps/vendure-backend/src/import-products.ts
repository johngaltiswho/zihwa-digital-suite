import { 
    bootstrap, 
    RequestContextService,
    SearchService,
    ProductVariantService,
    FacetService,
    CollectionService,
    ProductService,
    ID,
    LanguageCode
} from '@vendure/core';
import { config } from './vendure-config';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const normalize = (s: any) => String(s || '').toLowerCase().trim().replace(/\s+/g, ' ');

/**
 * Parallel processing helper to maximize speed
 */
async function asyncPool(poolLimit: number, array: any[], iteratorFn: Function) {
    const ret = [];
    const executing: any[] = [];
    for (const item of array) {
        const p = Promise.resolve().then(() => iteratorFn(item));
        ret.push(p);
        if (poolLimit <= array.length) {
            const e: any = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            if (executing.length >= poolLimit) await Promise.race(executing);
        }
    }
    return Promise.all(ret);
}

async function run() {
    const app = await bootstrap(config);
    const requestContextService = app.get(RequestContextService);
    const productService = app.get(ProductService);
    const variantService = app.get(ProductVariantService);
    const facetService = app.get(FacetService);
    const collectionService = app.get(CollectionService);
    const searchService = app.get(SearchService);
    
    const adminCtx = await requestContextService.create({ apiType: 'admin' });

    try {
        console.log(' STARTING FINAL TURBO SYNC...');
        const csvPath = path.join(__dirname, '../import-data/products.csv');
        const fileContent = fs.readFileSync(csvPath, 'utf-8');
        const records = parse(fileContent, { columns: true, skip_empty_lines: true, trim: true, bom: true }) as any[];

        // 1. CACHE FACET DATA
        console.log(' Caching Facets...');
        const facets = (await facetService.findAll(adminCtx)).items;
        
        // Convert IDs to strings here to fix the build error
        const managedFacetGroupIds = facets
            .filter(f => ['category', 'subcategory', 'brand'].includes(f.code))
            .map(f => f.id.toString());
        
        const fvMap = new Map<string, string>();
        for (const f of facets) {
            const fullFacet = await facetService.findOne(adminCtx, f.id);
            if (fullFacet && fullFacet.values) {
                for (const v of fullFacet.values) {
                    fvMap.set(`${f.code}:${normalize(v.name)}`, v.id.toString());
                }
            }
        }

        // 2. MAP SKUs TO PRODUCT IDs
        console.log('📦 Mapping Products...');
        const productUpdateMap = new Map<string, Set<string>>();

        for (const row of records) {
            const sku = row.variantSku?.trim();
            if (!sku) continue;

            const res = await variantService.findAll(adminCtx, { filter: { sku: { eq: sku } }, take: 1 });
            if (res.items.length > 0) {
                const pId = (res.items[0] as any).productId.toString();
                if (!productUpdateMap.has(pId)) productUpdateMap.set(pId, new Set());
                
                const catId = fvMap.get(`category:${normalize(row.category)}`);
                const subId = fvMap.get(`subcategory:${normalize(row.subheadings)}`);
                const brandId = fvMap.get(`brand:${normalize(row.brands)}`);

                if (catId) productUpdateMap.get(pId)!.add(catId);
                if (subId) productUpdateMap.get(pId)!.add(subId);
                if (brandId) productUpdateMap.get(pId)!.add(brandId);
            }
        }

        // 3. PARALLEL PRODUCT UPDATE
        console.log(`🔄 Updating ${productUpdateMap.size} Products...`);
        let pCount = 0;
        await asyncPool(30, Array.from(productUpdateMap.entries()), async ([productId, newFvIds]: [string, Set<string>]) => {
            try {
                const product = await productService.findOne(adminCtx, productId as any, ['facetValues']);
                if (product) {
                    // FIX: Convert fv.facetId to string before checking .includes()
                    const preservedIds = (product.facetValues || [])
                        .filter(fv => !managedFacetGroupIds.includes(fv.facetId.toString()))
                        .map(fv => fv.id);

                    const finalIds = Array.from(new Set([...preservedIds, ...Array.from(newFvIds)]));
                    
                    if (product.facetValues.length !== finalIds.length) {
                        await productService.update(adminCtx, {
                            id: productId as any,
                            facetValueIds: finalIds as any[]
                        });
                    }
                }
            } catch (e) {}
            pCount++;
            if (pCount % 100 === 0) console.log(`  Progress: ${pCount}/${productUpdateMap.size}...`);
        });

        // 4. LINK COLLECTIONS
        console.log('📂 Linking Collections...');
        const allCols = (await collectionService.findAll(adminCtx)).items;
        const colLookup = new Map(allCols.map(c => [`${(c as any).parentId}_${normalize(c.name)}`, c.id]));
        const rootCols = new Map(allCols.filter(c => !(c as any).parentId || (c as any).parentId.toString() === '1').map(c => [normalize(c.name), c.id]));

        const tasks: any[] = [];
        const seen = new Set<string>();

        for (const row of records) {
            const parentId = rootCols.get(normalize(row.category));
            if (!parentId) continue;

            const addJob = (folder: string, name: string, facetCode: string) => {
                const folderId = colLookup.get(`${parentId.toString()}_${normalize(folder)}`);
                if (folderId) {
                    const targetId = colLookup.get(`${folderId.toString()}_${normalize(name)}`);
                    const fvId = fvMap.get(`${facetCode}:${normalize(name)}`);
                    if (targetId && fvId && !seen.has(targetId.toString())) {
                        tasks.push({ id: targetId, fvId });
                        seen.add(targetId.toString());
                    }
                }
            };

            if (row.subheadings) addJob('Products', row.subheadings, 'subcategory');
            if (row.brands) addJob('Brands', row.brands, 'brand');
        }

        await asyncPool(10, tasks, async (task: any) => {
            try {
                await collectionService.update(adminCtx, {
                    id: task.id,
                    filters: [{
                        code: 'facet-value-filter',
                        arguments: [
                            { name: 'facetValueIds', value: JSON.stringify([task.fvId]) },
                            { name: 'containsAny', value: 'true' }
                        ]
                    }]
                });
            } catch (e) {}
        });

        console.log('⚡ Running Global Reindex...');
        await searchService.reindex(adminCtx);
        console.log('✅ SYNC COMPLETE.');

    } catch (err) {
        console.error('\n❌ FATAL ERROR:', err);
    }

    await app.close();
    process.exit(0);
}

run();