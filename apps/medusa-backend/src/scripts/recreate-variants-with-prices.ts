import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function recreateVariantsWithPrices({ container }: ExecArgs) {
  console.log("🔄 Recreating variants with prices...")
  
  try {
    const productService = container.resolve(Modules.PRODUCT)
    
    // Get all products
    const [products] = await productService.listAndCountProducts({})
    console.log(`📊 Found ${products.length} products to process`)
    
    let successCount = 0
    let errorCount = 0
    
    // Process each product
    for (const product of products) {
      try {
        // Get current variants
        const [variants] = await productService.listAndCountProductVariants({ 
          product_id: product.id 
        })
        
        // Delete existing variants
        for (const variant of variants) {
          try {
            await productService.deleteProductVariants([variant.id])
            console.log(`🗑️ Deleted variant: ${variant.id}`)
          } catch (deleteError) {
            console.log(`⚠️ Could not delete variant ${variant.id}: ${deleteError.message}`)
          }
        }
        
        // Get original price from product metadata
        const originalPrice = product.metadata?.original_price || 0
        const price = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice
        
        // Create new variant with price
        const newVariant = await productService.createProductVariants([{
          title: "Default",
          product_id: product.id,
          prices: [
            {
              amount: Math.round(price * 100), // Convert to cents
              currency_code: "usd"
            }
          ],
          manage_inventory: false,
          allow_backorder: true,
          metadata: {
            is_default_variant: true,
            created_by_fix_script: true
          }
        }])
        
        console.log(`✅ Created variant with price for: ${product.title} ($${price})`)
        successCount++
        
      } catch (error) {
        console.log(`❌ Failed to process product "${product.title}":`, error.message)
        errorCount++
      }
    }
    
    console.log(`\n🎉 Variant recreation completed!`)
    console.log(`✅ Successfully recreated: ${successCount} products`)
    console.log(`❌ Failed recreations: ${errorCount} products`)
    
  } catch (error) {
    console.error("❌ Variant recreation failed:", error)
  }
}