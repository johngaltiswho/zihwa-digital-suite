import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import * as fs from 'fs'
import * as path from 'path'

export default async function migrateAndAddVariations({ container }: ExecArgs) {
  console.log("🔄 Starting product migration with variations...")
  
  try {
    const productService = container.resolve(Modules.PRODUCT)
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
    
    // Read the cleaned CSV file
    const csvPath = path.join(process.cwd(), 'FluviumProduct_CSV.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf8')
    
    // Parse CSV
    const products = parseCleanCSV(csvContent)
    console.log(`📊 Found ${products.length} products to migrate`)
    
    // Get or create sales channel
    const [salesChannels] = await salesChannelService.listAndCountSalesChannels({})
    let salesChannel = salesChannels[0]
    
    if (!salesChannel) {
      salesChannel = await salesChannelService.createSalesChannels({
        name: "Default Sales Channel",
        description: "Default sales channel for Fluvium products"
      })
    }
    
    let successCount = 0
    let errorCount = 0
    
    // Process each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      
      try {
        // Skip if product name is empty or invalid
        if (!product.name || !product.price || product.price <= 0) {
          console.log(`⚠️ Skipping product ${i + 1}: Invalid data`)
          continue
        }
        
        // Generate description
        const description = generateProductDescription(product)
        
        // Create base product in Medusa
        const [medusaProduct] = await productService.createProducts([{
          title: product.name,
          handle: createHandle(product.name),
          description: description,
          status: product.enabled ? "published" : "draft",
          metadata: {
            ecwid_sku: product.sku,
            ecwid_id: product.product_id,
            original_price: product.price,
            weight: product.weight,
            category: product.category1,
            subcategory: product.category2,
            brand: product.brand,
            migrated_from: "ecwid",
            migration_date: new Date().toISOString()
          },
          images: product.image ? [{ url: product.image }] : [],
          sales_channels: [{ id: salesChannel.id }]
        }])
        
        // Create variations based on product type
        const variations = getProductVariations(product)
        
        for (const variation of variations) {
          const variantPrice = Math.round(variation.price * 100) // Convert to paise
          
          await productService.createProductVariants([{
            title: variation.title,
            product_id: medusaProduct.id,
            prices: [
              {
                amount: variantPrice,
                currency_code: "inr"
              }
            ],
            manage_inventory: false,
            allow_backorder: true,
            metadata: {
              size: variation.size,
              variation_type: variation.type,
              created_by_migration: true
            }
          }])
        }
        
        console.log(`✅ Migrated: ${product.name} with ${variations.length} variations`)
        successCount++
        
      } catch (error) {
        console.log(`❌ Failed to migrate product ${i + 1}: ${product.name}`, error.message)
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

function parseCleanCSV(csvContent: string): any[] {
  const lines = csvContent.split('\n').filter(line => line.trim())
  const headers = lines[0].split(',')
  const products: any[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const fields = lines[i].split(',')
    const product: any = {}
    
    headers.forEach((header, index) => {
      const value = fields[index] || ''
      
      switch (header.trim()) {
        case 'name':
          product.name = value.replace(/^"|"$/g, '').trim()
          break
        case 'sku':
          product.sku = value.replace(/^"|"$/g, '').trim()
          break
        case 'category1':
          product.category1 = value.replace(/^"|"$/g, '').trim()
          break
        case 'category2':
          product.category2 = value.replace(/^"|"$/g, '').trim()
          break
        case 'category3':
          product.category3 = value.replace(/^"|"$/g, '').trim()
          break
        case 'image':
          product.image = value.replace(/^"|"$/g, '').trim()
          break
        case 'weight':
          product.weight = parseFloat(value) || 0
          break
        case 'price':
          // Handle price parsing - remove any spaces and parse as float
          const cleanPrice = value.replace(/\s+/g, '').replace(/^"|"$/g, '')
          product.price = parseFloat(cleanPrice) || 0
          break
        case 'enabled':
          product.enabled = value.toLowerCase().includes('yes')
          break
        case 'brand':
          product.brand = value.replace(/^"|"$/g, '').trim()
          break
        case 'product_id':
          product.product_id = value.replace(/^"|"$/g, '').trim()
          break
        case 'seo_title':
          product.seo_title = value.replace(/^"|"$/g, '').trim()
          break
        case 'seo_description':
          product.seo_description = value.replace(/^"|"$/g, '').trim()
          break
      }
    })
    
    if (product.name) {
      products.push(product)
    }
  }
  
  return products
}

function getProductVariations(product: any) {
  const variations = []
  const basePrice = product.price
  
  // Determine product type and create appropriate variations
  if (isApparel(product)) {
    // T-shirts, Hoodies, etc. - Size variations
    const sizes = ['S', 'M', 'L', 'XL']
    const sizePricing = {
      'S': basePrice,
      'M': basePrice,
      'L': basePrice + 50, // Slightly higher for larger sizes
      'XL': basePrice + 100
    }
    
    sizes.forEach(size => {
      variations.push({
        title: `${size}`,
        size: size,
        type: 'size',
        price: sizePricing[size]
      })
    })
  } else if (isGi(product)) {
    // BJJ Gis - Gi size variations
    const giSizes = ['A0', 'A1', 'A2', 'A3', 'A4']
    const giSizePricing = {
      'A0': basePrice,
      'A1': basePrice + 100,
      'A2': basePrice + 200,
      'A3': basePrice + 300,
      'A4': basePrice + 400
    }
    
    giSizes.forEach(size => {
      variations.push({
        title: `${size}`,
        size: size,
        type: 'gi_size',
        price: giSizePricing[size]
      })
    })
  } else {
    // Default single variation for other products
    variations.push({
      title: 'Default',
      size: 'One Size',
      type: 'default',
      price: basePrice
    })
  }
  
  return variations
}

function isApparel(product: any): boolean {
  const name = product.name.toLowerCase()
  const category = (product.category1 || '').toLowerCase()
  
  return name.includes('tee') || 
         name.includes('t-shirt') || 
         name.includes('shirt') || 
         name.includes('hoodie') || 
         name.includes('jacket') ||
         category.includes('apparel') ||
         name.includes('varsity')
}

function isGi(product: any): boolean {
  const name = product.name.toLowerCase()
  const category = (product.category1 || '').toLowerCase()
  
  return name.includes('gi') || 
         name.includes('kimono') ||
         category.includes('gi') ||
         name.includes('bjj gi')
}

function generateProductDescription(product: any): string {
  const name = product.name
  const category = product.category1 || ''
  const subcategory = product.category2 || ''
  
  // Use existing description if available from SEO description
  if (product.seo_description && product.seo_description.length > 10) {
    return product.seo_description
  }
  
  // Generate description based on product type
  if (isApparel(product)) {
    return generateApparelDescription(name, category)
  } else if (isGi(product)) {
    return generateGiDescription(name)
  } else if (category.includes('Virtual Privates')) {
    return generateTrainingDescription(name)
  } else if (category.includes('Fight Gear')) {
    return generateFightGearDescription(name, subcategory)
  } else if (category.includes('Athlete Wellness')) {
    return generateWellnessDescription(name)
  } else if (category.includes('Sports Mats')) {
    return generateMatDescription(name)
  } else {
    return generateGenericDescription(name, category)
  }
}

function generateApparelDescription(name: string, category: string): string {
  return `<p><strong>Premium Athletic Apparel</strong></p>
<ul>
<li>High-quality ${name} designed for athletes and fitness enthusiasts</li>
<li>Comfortable fit with durable construction for training and casual wear</li>
<li>Made with premium materials for long-lasting performance</li>
<li>Perfect for gym sessions, training, or everyday casual wear</li>
</ul>
<p><strong>Features:</strong></p>
<ul>
<li>Moisture-wicking technology keeps you dry during intense workouts</li>
<li>Reinforced stitching for durability during rigorous activities</li>
<li>Comfortable fit that allows for full range of motion</li>
<li>Easy care - machine washable</li>
</ul>`
}

function generateGiDescription(name: string): string {
  return `<p><strong>Professional BJJ Gi/Kimono</strong></p>
<ul>
<li>The ${name} is designed for serious Brazilian Jiu-Jitsu practitioners</li>
<li>Premium pearl weave construction offers durability and comfort</li>
<li>IBJJF approved design suitable for competitions and training</li>
<li>Reinforced stress points for maximum durability during intense rolling sessions</li>
</ul>
<p><strong>Features:</strong></p>
<ul>
<li>Pearl weave jacket provides optimal balance of durability and breathability</li>
<li>Ripstop pants resist tearing and provide flexibility</li>
<li>Pre-shrunk fabric minimizes size changes after washing</li>
<li>Traditional cut with modern performance enhancements</li>
<li>Available in multiple sizes (A0-A4) to ensure perfect fit</li>
</ul>`
}

function generateTrainingDescription(name: string): string {
  return `<p><strong>Virtual Training Session</strong></p>
<ul>
<li>Exclusive one-on-one training session with ${name.split('|')[0]?.trim() || 'professional athlete'}</li>
<li>Learn advanced techniques and strategies from experienced professionals</li>
<li>Personalized instruction tailored to your skill level and goals</li>
<li>Virtual format allows training from anywhere in the world</li>
</ul>
<p><strong>Session Benefits:</strong></p>
<ul>
<li>Direct access to professional-level coaching and expertise</li>
<li>Technique breakdown and detailed instruction</li>
<li>Q&A session to address your specific questions</li>
<li>Recording available for future reference</li>
</ul>`
}

function generateFightGearDescription(name: string, subcategory: string): string {
  const gearType = subcategory.includes('Boxing') ? 'Boxing' : 
                   subcategory.includes('MMA') ? 'MMA' :
                   subcategory.includes('Jiu Jitsu') ? 'Brazilian Jiu-Jitsu' : 'Combat Sports'
  
  return `<p><strong>Professional ${gearType} Equipment</strong></p>
<ul>
<li>The ${name} is engineered for serious ${gearType.toLowerCase()} training and competition</li>
<li>Premium materials and construction ensure maximum protection and durability</li>
<li>Professional-grade equipment trusted by athletes worldwide</li>
<li>Designed to withstand the rigors of intense training sessions</li>
</ul>
<p><strong>Features:</strong></p>
<ul>
<li>High-density foam padding provides superior impact absorption</li>
<li>Ergonomic design ensures comfortable fit during extended use</li>
<li>Reinforced stitching and premium materials for long-lasting performance</li>
<li>Easy to clean and maintain for hygienic training</li>
</ul>`
}

function generateWellnessDescription(name: string): string {
  return `<p><strong>Athletic Wellness & Recovery</strong></p>
<ul>
<li>Professional-grade ${name} designed for athlete wellness and injury prevention</li>
<li>Essential equipment for pre-training preparation and post-training recovery</li>
<li>Used by professional athletes and sports medicine practitioners</li>
<li>High-quality materials ensure reliable performance when you need it most</li>
</ul>
<p><strong>Benefits:</strong></p>
<ul>
<li>Supports injury prevention and faster recovery</li>
<li>Professional-grade quality for reliable performance</li>
<li>Easy to use with clear application guidelines</li>
<li>Essential addition to any athlete's wellness toolkit</li>
</ul>`
}

function generateMatDescription(name: string): string {
  return `<p><strong>Professional Training Mats</strong></p>
<ul>
<li>High-quality ${name} designed for martial arts, wrestling, and fitness training</li>
<li>Provides excellent shock absorption and joint protection</li>
<li>Durable construction withstands heavy use in professional training environments</li>
<li>Easy to clean and maintain for hygienic training spaces</li>
</ul>
<p><strong>Features:</strong></p>
<ul>
<li>High-density foam core provides optimal impact absorption</li>
<li>Non-slip surface ensures safety during training</li>
<li>Easy to install and configure for any training space</li>
<li>Professional-grade materials for long-lasting performance</li>
</ul>`
}

function generateGenericDescription(name: string, category: string): string {
  return `<p><strong>Premium ${category || 'Sports Equipment'}</strong></p>
<ul>
<li>High-quality ${name} designed for serious athletes and fitness enthusiasts</li>
<li>Professional-grade construction ensures reliable performance</li>
<li>Trusted by athletes and trainers worldwide</li>
<li>Essential equipment for achieving your fitness and training goals</li>
</ul>
<p><strong>Features:</strong></p>
<ul>
<li>Premium materials and superior craftsmanship</li>
<li>Designed for durability and long-lasting performance</li>
<li>Ergonomic design for comfort during use</li>
<li>Easy to maintain and clean</li>
</ul>`
}

function createHandle(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}