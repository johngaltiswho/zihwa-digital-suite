import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import * as fs from 'fs'
import * as path from 'path'

export default async function migrateEcwidProducts({ container }: ExecArgs) {
  console.log("🔄 Starting Ecwid product migration...")
  
  try {
    const productService = container.resolve(Modules.PRODUCT)
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
    
    // Read the CSV file
    const csvPath = path.join(process.cwd(), 'FluviumProduct_CSV.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf8')
    
    // Parse CSV with proper multiline support
    const products = parseCSVWithMultilineSupport(csvContent)
    
    console.log(`📊 Found ${products.length} products to migrate`)
    
    // Get or create sales channel
    const [salesChannels] = await salesChannelService.listAndCountSalesChannels({})
    let salesChannel = salesChannels[0]
    
    if (!salesChannel) {
      salesChannel = await salesChannelService.createSalesChannels({
        name: "Default Sales Channel",
        description: "Default sales channel for migrated products"
      })
    }
    
    let successCount = 0
    let errorCount = 0
    
    // Process each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      
      try {
        
        // Skip if product name is empty
        if (!product.name) {
          console.log(`⚠️ Skipping product ${i + 1}: No name`)
          continue
        }
        
        // Create product in Medusa
        const medusaProduct = await productService.createProducts([{
          title: product.name,
          handle: createHandle(product.name),
          description: cleanDescription(product.description),
          status: product.enabled ? "published" : "draft",
          metadata: {
            ecwid_sku: product.sku,
            ecwid_id: product.product_id,
            original_price: product.price,
            weight: product.weight,
            category: product.category1,
            subcategory: product.category2,
            brand: product.brand,
            upc: product.upc,
            migrated_from: "ecwid",
            migration_date: new Date().toISOString()
          },
          images: product.image ? [{ url: product.image }] : [],
          sales_channels: [{ id: salesChannel.id }]
        }])
        
        console.log(`✅ Migrated: ${product.name} (SKU: ${product.sku})`)
        successCount++
        
      } catch (error) {
        console.log(`❌ Failed to migrate product ${i + 1}:`, error.message)
        errorCount++
      }
    }
    
    console.log(`\n🎉 Migration completed!`)
    console.log(`✅ Successfully migrated: ${successCount} products`)
    console.log(`❌ Failed migrations: ${errorCount} products`)
    
  } catch (error) {
    console.error("❌ Migration failed:", error)
  }
}

function parseCSVWithMultilineSupport(csvContent: string): any[] {
  const lines = csvContent.split('\n')
  const headers = lines[0].split(',')
  const products: any[] = []
  
  let i = 1
  while (i < lines.length) {
    if (!lines[i].trim()) {
      i++
      continue
    }
    
    // Start parsing a product entry
    let productLine = lines[i]
    let inQuotes = false
    let quoteCount = 0
    
    // Count quotes in the line
    for (let char of productLine) {
      if (char === '"') quoteCount++
    }
    
    // If odd number of quotes, this is a multiline entry
    while (quoteCount % 2 !== 0 && i + 1 < lines.length) {
      i++
      productLine += '\n' + lines[i]
      for (let char of lines[i]) {
        if (char === '"') quoteCount++
      }
    }
    
    // Parse the complete product line
    const fields = parseCSVLine(productLine)
    const product = parseProductData(fields, headers)
    
    if (product.name) {
      products.push(product)
    }
    
    i++
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
      fields.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  fields.push(current.trim())
  return fields
}

function parseProductData(fields: string[], headers: string[]) {
  const product: any = {}
  
  headers.forEach((header, index) => {
    const value = fields[index] || ''
    
    switch (header) {
      case 'name':
        product.name = value.replace(/^"|"$/g, '')
        break
      case 'sku':
        product.sku = value.replace(/^"|"$/g, '')
        break
      case 'description':
        product.description = value.replace(/^"|"$/g, '')
        break
      case 'category1':
        product.category1 = value.replace(/^"|"$/g, '')
        break
      case 'category2':
        product.category2 = value.replace(/^"|"$/g, '')
        break
      case 'category3':
        product.category3 = value.replace(/^"|"$/g, '')
        break
      case 'image':
        product.image = value.replace(/^"|"$/g, '')
        break
      case 'weight':
        product.weight = parseFloat(value) || 0
        break
      case 'price':
        product.price = parseFloat(value) || 0
        break
      case 'enabled':
        product.enabled = value.toLowerCase() === 'yes'
        break
      case 'brand':
        product.brand = value.replace(/^"|"$/g, '')
        break
      case 'upc':
        product.upc = value.replace(/^"|"$/g, '')
        break
      case 'product_id':
        product.product_id = value.replace(/^"|"$/g, '')
        break
    }
  })
  
  return product
}

function createHandle(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function cleanDescription(description: string): string {
  if (!description) return ''
  
  // Remove HTML tags but preserve basic formatting
  return description
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
}