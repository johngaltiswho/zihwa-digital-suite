import { 
  bootstrap, 
  ProductService, 
  ChannelService, 
  CollectionService,
  ProductVariantService,
  RequestContextService,
  LanguageCode
} from '@vendure/core';
import { GlobalFlag } from '@vendure/common/lib/generated-types';
import { config } from '../vendure-config';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parse';

interface FluviumProduct {
  name: string;
  sku: string;
  subtitle: string;
  category1: string;
  category2: string;
  category3: string;
  image: string;
  weight: string;
  price: string;
  quantity: string;
  enabled: string;
  variants: string;
  improved_description: string;
  seo_title: string;
  seo_description: string;
}

async function importFluviumProducts() {
  console.log('🚀 Starting Fluvium product import...');
  
  const app = await bootstrap(config);
  
  // Get services
  const productService = app.get(ProductService);
  const channelService = app.get(ChannelService);
  const productVariantService = app.get(ProductVariantService);
  const requestContextService = app.get(RequestContextService);
  
  // Create RequestContext for admin operations with superuser permissions
  const ctx = await requestContextService.create({ 
    apiType: 'admin',
    isAuthorized: true,
    authorizedAsOwnerOnly: false
  });
  
  // Get the Fluvium channel
  const channelsResult = await channelService.findAll(ctx);
  const fluviumChannel = channelsResult.items.find((channel: any) => channel.code === 'fluvium');
  
  if (!fluviumChannel) {
    console.error('❌ Fluvium channel not found. Please create it first.');
    return;
  }
  
  console.log(`✅ Found Fluvium channel: ${fluviumChannel.code}`);
  
  // Read and parse CSV file
  const csvPath = path.join(__dirname, '../../../medusa-backend-backup/FluviumProduct_Improved.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  
  csv.parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }, async (err, records: FluviumProduct[]) => {
    if (err) {
      console.error('❌ Error parsing CSV:', err);
      return;
    }
    
    console.log(`📦 Found ${records.length} products to import`);
    
    for (const record of records) {
      try {
        // Only import enabled products
        if (record.enabled.toLowerCase() !== 'yes') {
          console.log(`⏭️  Skipping disabled product: ${record.name}`);
          continue;
        }
        
        // Create product data
        const productData = {
          translations: [{
            languageCode: LanguageCode.en,
            name: record.name,
            slug: record.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: record.improved_description || `Premium martial arts equipment from Fluvium. ${record.subtitle}`,
          }],
          featuredAsset: record.image ? {
            source: record.image,
            preview: record.image,
          } : undefined,
          customFields: {
            subtitle: record.subtitle,
            originalSku: record.sku,
            seoTitle: record.seo_title,
            seoDescription: record.seo_description,
          }
        };
        
        // Create the product
        const product = await productService.create(ctx, productData);
        
        // Add product to Fluvium channel
        await productService.assignProductsToChannel(ctx, {
          channelId: fluviumChannel.id,
          productIds: [product.id],
        });
        
        // Create variants
        const variants = record.variants ? record.variants.split(',') : ['Default'];
        
        for (const variantName of variants) {
          const variantData = {
            productId: product.id,
            translations: [{
              languageCode: LanguageCode.en,
              name: variantName.trim(),
            }],
            sku: `${record.sku}-${variantName.trim().toLowerCase()}`,
            price: Math.round(parseFloat(record.price || '0') * 100), // Convert to cents
            stockOnHand: parseInt(record.quantity || '0'),
            trackInventory: GlobalFlag.TRUE,
          };
          
          await productVariantService.create(ctx, [variantData]);
        }
        
        console.log(`✅ Imported: ${record.name}`);
        
      } catch (error) {
        console.error(`❌ Error importing ${record.name}:`, error);
      }
    }
    
    console.log('🎉 Import completed!');
    process.exit(0);
  });
}

// Run the import
importFluviumProducts().catch(console.error);