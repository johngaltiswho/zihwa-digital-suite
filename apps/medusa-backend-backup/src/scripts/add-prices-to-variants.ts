import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function addPricesToVariants({ container }: ExecArgs) {
  console.log("💰 Adding prices to variants...")
  
  try {
    const productService = container.resolve(Modules.PRODUCT)
    
    // Get all products
    const [products] = await productService.listAndCountProducts({})
    console.log(`📊 Found ${products.length} products to process`)
    
    let successCount = 0
    let errorCount = 0
    let skippedCount = 0
    
    // Process each product
    for (const product of products) {
      try {
        // Get variants for this product
        const [variants] = await productService.listAndCountProductVariants({ 
          product_id: product.id 
        })
        
        for (const variant of variants) {
          try {
            // Get original price from product metadata
            const originalPrice = product.metadata?.original_price || 0
            const price = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice
            
            // Update the variant with prices
            await productService.updateProductVariants([{
              id: variant.id,
              prices: [
                {
                  amount: Math.round(price * 100), // Convert to paise
                  currency_code: "inr"
                }
              ]
            }])
            
            console.log(`✅ Added price to variant: ${product.title} - ${variant.title} ($${price})`)
            successCount++
            
          } catch (variantError) {
            console.log(`❌ Failed to add price to variant ${variant.id}:`, variantError.message)
            errorCount++
          }
        }
        
      } catch (productError) {
        console.log(`❌ Failed to process product "${product.title}":`, productError.message)
        errorCount++
      }
    }
    
    console.log(`\n🎉 Price addition completed!`)
    console.log(`✅ Successfully added prices: ${successCount} variants`)
    console.log(`⚠️ Skipped (already have prices): ${skippedCount} variants`)
    console.log(`❌ Failed additions: ${errorCount} variants`)
    
  } catch (error) {
    console.error("❌ Price addition failed:", error)
  }
}