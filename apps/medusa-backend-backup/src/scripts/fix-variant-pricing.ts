import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function fixVariantPricing({ container }: ExecArgs) {
  console.log("💰 Fixing variant pricing...")
  
  try {
    const productService = container.resolve(Modules.PRODUCT)
    const pricingService = container.resolve(Modules.PRICING)
    
    // Get all products
    const [products] = await productService.listAndCountProducts({})
    console.log(`📊 Found ${products.length} products to process`)
    
    let successCount = 0
    let errorCount = 0
    
    // Process each product
    for (const product of products) {
      try {
        // Get variants for this product
        const [variants] = await productService.listAndCountProductVariants({ 
          product_id: product.id 
        })
        
        // Get original price from product metadata
        const originalPrice = product.metadata?.original_price || 0
        const price = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice
        
        if (price <= 0) {
          console.log(`⚠️ Skipping ${product.title}: No valid price found`)
          continue
        }
        
        for (const variant of variants) {
          try {
            // Create price set for this variant
            await pricingService.createPriceSets([{
              prices: [{
                amount: Math.round(price * 100), // Convert to paise
                currency_code: "inr",
                min_quantity: 1,
                max_quantity: null
              }]
            }])
            .then(async (priceSets) => {
              // Update variant with price set
              await productService.updateProductVariants([{
                id: variant.id,
                price_set: priceSets[0]
              }])
            })
            
            console.log(`✅ Fixed pricing for: ${product.title} - ${variant.title} (₹${price})`)
            successCount++
            
          } catch (variantError) {
            console.log(`❌ Failed to fix variant ${variant.id}:`, variantError.message)
            errorCount++
          }
        }
        
      } catch (productError) {
        console.log(`❌ Failed to process product "${product.title}":`, productError.message)
        errorCount++
      }
    }
    
    console.log(`\n🎉 Pricing fix completed!`)
    console.log(`✅ Successfully fixed: ${successCount} variants`)
    console.log(`❌ Failed fixes: ${errorCount} variants`)
    
  } catch (error) {
    console.error("❌ Pricing fix failed:", error)
  }
}