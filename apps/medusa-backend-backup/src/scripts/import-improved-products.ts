import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import * as fs from 'fs'
import * as path from 'path'

export default async function importImprovedProducts({ container }: ExecArgs) {
  console.log("🔄 Starting improved product import...")
  
  try {
    const productService = container.resolve(Modules.PRODUCT)
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
    
    // Read the improved CSV file
    const csvPath = path.join(process.cwd(), 'FluviumProduct_Improved.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf8')
    
    // Parse CSV
    const products = parseCSV(csvContent)
    console.log(`📊 Found ${products.length} products to import`)
    
    // Get sales channel
    const [salesChannels] = await salesChannelService.listAndCountSalesChannels({})
    const salesChannel = salesChannels[0]
    
    if (!salesChannel) {
      throw new Error("No sales channel found")
    }
    
    console.log(`📈 Using sales channel: ${salesChannel.name}`)
    
    let successCount = 0
    let errorCount = 0
    
    // Process each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      
      try {
        // Skip if product name is empty or disabled
        if (!product.name || product.enabled !== 'yes') {
          console.log(`⚠️ Skipping product ${i + 1}: ${product.name || 'No name'} (${product.enabled === 'yes' ? 'enabled' : 'disabled'})`)
          continue
        }
        
        // Create variants based on variants column
        const variants = createVariants(product)
        
        // Create product in Medusa
        const medusaProduct = await productService.createProducts([{
          title: product.name,
          handle: createHandle(product.name),
          description: product.improved_description || product.seo_description || '',
          subtitle: product.subtitle || '',
          status: "published",
          metadata: {
            ecwid_sku: product.sku,
            ecwid_id: product.product_id,
            original_price: parseFloat(product.price) || 0,
            weight: parseFloat(product.weight) || 0,
            category: product.category1,
            subcategory: product.category2,
            brand: product.brand,
            upc: product.upc,
            migrated_from: "ecwid_v2",
            migration_date: new Date().toISOString()
          },
          images: product.image ? [{ url: product.image }] : [],
          sales_channels: [{ id: salesChannel.id }]
        }])
        
        // Create variants with proper pricing
        if (variants.length > 0) {
          const variantData = variants.map((variantTitle, index) => ({
            title: variantTitle,
            product_id: medusaProduct[0].id,
            prices: [
              {
                amount: Math.round((parseFloat(product.price) || 0) * 100), // Convert to paise
                currency_code: "inr"
              }
            ],
            manage_inventory: false,
            allow_backorder: true,
            metadata: {
              size: variantTitle,
              is_default: index === 0
            }
          }))
          
          const createdVariants = await productService.createProductVariants(variantData)
          console.log(`✅ Created ${createdVariants.length} variants for: ${product.name}`)
        } else {
          // Create single default variant
          const defaultVariant = await productService.createProductVariants([{
            title: "Default",
            product_id: medusaProduct[0].id,
            prices: [
              {
                amount: Math.round((parseFloat(product.price) || 0) * 100), // Convert to paise
                currency_code: "inr"
              }
            ],
            manage_inventory: false,
            allow_backorder: true,
            metadata: {
              is_default: true
            }
          }])
          console.log(`✅ Created default variant for: ${product.name}`)
        }
        
        console.log(`✅ Imported: ${product.name} (Price: ₹${product.price})`)
        successCount++
        
      } catch (error) {
        console.log(`❌ Failed to import product ${i + 1} (${product.name}):`, error.message)
        errorCount++
      }
    }
    
    console.log(`\n🎉 Import completed!`)
    console.log(`✅ Successfully imported: ${successCount} products`)
    console.log(`❌ Failed imports: ${errorCount} products`)
    
  } catch (error) {
    console.error("❌ Import failed:", error)
  }
}

function parseCSV(csvContent: string): any[] {
  const lines = csvContent.split('\n').filter(line => line.trim())
  if (lines.length < 2) return []
  
  const headers = lines[0].split(',')
  const products: any[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i])
    if (fields.length >= headers.length) {
      const product: any = {}
      headers.forEach((header, index) => {
        product[header] = fields[index] || ''
      })
      products.push(product)
    }
  }
  
  return products
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"' && !inQuotes) {
      inQuotes = true
    } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i+1] === ',')) {
      inQuotes = false
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim().replace(/^"|"$/g, ''))
      current = ''
    } else {
      current += char
    }
  }
  
  fields.push(current.trim().replace(/^"|"$/g, ''))
  return fields
}

function createVariants(product: any): string[] {
  if (!product.variants || !product.variants.trim()) {
    return []
  }
  
  return product.variants.split(',').map((v: string) => v.trim()).filter((v: string) => v)
}

function createHandle(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}