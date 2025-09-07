import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function fixVariantPriceSets({ container }: ExecArgs) {
  console.log("💰 Fixing variant price sets...")
  
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
        // Get original price from product metadata
        const originalPrice = product.metadata?.original_price || 0
        const price = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice
        
        if (price <= 0) {
          console.log(`⚠️ Skipping ${product.title}: No valid price found (${price})`)
          continue
        }
        
        console.log(`🔧 Fixing price sets for: ${product.title} - Base price: ₹${price}`)
        
        // Get variants for this product
        const [variants] = await productService.listAndCountProductVariants({
          product_id: product.id
        })
        
        for (const variant of variants) {
          try {
            // Skip if already has price set
            if (variant.price_set_id) {
              console.log(`  ⚡ Skipping ${variant.title}: Already has price set`)
              continue
            }
            
            // Calculate variant price based on size/type
            let variantPrice = price
            
            if (variant.metadata?.size) {
              const size = variant.metadata.size
              if (size === 'L') variantPrice = price + 50
              else if (size === 'XL') variantPrice = price + 100
              else if (size === 'A1') variantPrice = price + 100
              else if (size === 'A2') variantPrice = price + 200
              else if (size === 'A3') variantPrice = price + 300
              else if (size === 'A4') variantPrice = price + 400
            }
            
            // Create price set
            const priceSet = await pricingService.createPriceSets({
              prices: [{
                amount: Math.round(variantPrice * 100), // Convert to paise
                currency_code: "inr"
              }]
            })
            
            // Update variant with price set
            await productService.updateProductVariants(variant.id, {
              price_set_id: priceSet.id
            })
            
            console.log(`  ✅ ${variant.title || 'Default'} - ₹${variantPrice}`)
            successCount++
            
          } catch (variantError) {
            console.log(`  ❌ Failed variant ${variant.title}:`, variantError.message)
            errorCount++
          }
        }
        
      } catch (productError) {
        console.log(`❌ Failed product "${product.title}":`, productError.message)
        errorCount++
      }
    }
    
    console.log(`\n🎉 Price set fix completed!`)
    console.log(`✅ Successfully fixed: ${successCount} variants`)
    console.log(`❌ Failed fixes: ${errorCount} variants`)
    
  } catch (error) {
    console.error("❌ Price set fix failed:", error)
  }
}