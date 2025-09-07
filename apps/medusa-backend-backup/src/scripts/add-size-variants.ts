import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function addSizeVariants({ container }: ExecArgs) {
  console.log("👕 Adding size variants to products...")
  
  try {
    const productService = container.resolve(Modules.PRODUCT)
    const pricingService = container.resolve(Modules.PRICING)
    
    // Get all products
    const [products] = await productService.listAndCountProducts({})
    console.log(`📊 Found ${products.length} products to process`)
    
    let successCount = 0
    let errorCount = 0
    
    for (const product of products) {
      try {
        // Check if product already has variants
        const [variants] = await productService.listAndCountProductVariants({
          product_id: product.id
        })
        
        if (variants.length > 0) {
          console.log(`⚡ Skipping ${product.title}: Already has ${variants.length} variants`)
          continue
        }
        
        // Get original price from product metadata
        const originalPrice = product.metadata?.original_price || 0
        const price = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice
        
        if (price <= 0) {
          console.log(`⚠️ Skipping ${product.title}: No valid price found (${price})`)
          continue
        }
        
        // Determine product type and sizes
        let sizes = []
        const title = product.title.toLowerCase()
        
        if (title.includes('tee') || title.includes('shirt') || title.includes('hoodie') || title.includes('jacket') || title.includes('rashguard') || title.includes('shorts')) {
          sizes = ['XS', 'S', 'M', 'L', 'XL']
        } else if (title.includes('kids') && title.includes('belt')) {
          sizes = ['M0', 'M1', 'M2']
        } else if (title.includes('gi') || title.includes('kimono') || title.includes('belt')) {
          sizes = ['A0', 'A1', 'A2', 'A3', 'A4']
        } else if (title.includes('handwrap') || title.includes('hand wrap')) {
          sizes = ['Blue', 'Pink', 'White', 'Red', 'Black']
        } else {
          // Default variant for other products
          sizes = ['Default']
        }
        
        console.log(`🔧 Adding ${sizes.join(', ')} variants to: ${product.title} - Base price: ₹${price}`)
        
        for (const size of sizes) {
          try {
            // Calculate size-based pricing
            let variantPrice = price
            if (size === 'L') variantPrice = price + 50
            else if (size === 'XL') variantPrice = price + 100
            else if (size === 'A1') variantPrice = price + 100
            else if (size === 'A2') variantPrice = price + 200
            else if (size === 'A3') variantPrice = price + 300
            else if (size === 'A4') variantPrice = price + 400
            // Colors have same price
            
            // Create price set
            const priceSet = await pricingService.createPriceSets({
              prices: [{
                amount: Math.round(variantPrice * 100), // Convert to paise
                currency_code: "inr"
              }]
            })
            
            // Determine variant title and metadata
            let variantTitle = size
            let metadata = { is_default: size === sizes[0] }
            
            if (['XS', 'S', 'M', 'L', 'XL', 'A0', 'A1', 'A2', 'A3', 'A4', 'M0', 'M1', 'M2'].includes(size)) {
              variantTitle = `Size ${size}`
              metadata.size = size
            } else if (['Blue', 'Pink', 'White', 'Red', 'Black'].includes(size)) {
              variantTitle = `${size}`
              metadata.color = size
            }
            
            // Create variant
            await productService.createProductVariants({
              product_id: product.id,
              title: variantTitle,
              sku: `${product.handle}-${size.toLowerCase()}`,
              manage_inventory: false,
              price_set_id: priceSet.id,
              metadata: metadata
            })
            
            console.log(`  ✅ ${variantTitle} - ₹${variantPrice}`)
            successCount++
            
          } catch (variantError) {
            console.log(`  ❌ Failed variant ${size}:`, variantError.message)
            errorCount++
          }
        }
        
      } catch (productError) {
        console.log(`❌ Failed product "${product.title}":`, productError.message)
        errorCount++
      }
    }
    
    console.log(`\n🎉 Variant creation completed!`)
    console.log(`✅ Successfully created: ${successCount} variants`)
    console.log(`❌ Failed creations: ${errorCount} variants`)
    
  } catch (error) {
    console.error("❌ Variant creation failed:", error)
  }
}