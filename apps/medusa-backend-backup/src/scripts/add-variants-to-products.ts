import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function addVariantsToProducts({ container }: ExecArgs) {
  console.log("🔄 Starting bulk variant addition...")
  
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
        // Check if product already has variants
        const productWithVariants = await productService.retrieveProduct(product.id, {
          relations: ["variants"]
        })
        
        if (productWithVariants.variants && productWithVariants.variants.length > 0) {
          console.log(`⚠️ Skipping "${product.title}": Already has variants`)
          skippedCount++
          continue
        }
        
        // Get original price from metadata or set default
        const originalPrice = product.metadata?.original_price || 0
        const price = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice
        
        // Create a default variant for the product
        const variant = await productService.createProductVariants([{
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
            created_by_bulk_script: true
          }
        }])
        
        console.log(`✅ Added variant to: ${product.title}`)
        successCount++
        
      } catch (error) {
        console.log(`❌ Failed to add variant to "${product.title}":`, error.message)
        errorCount++
      }
    }
    
    console.log(`\n🎉 Bulk variant addition completed!`)
    console.log(`✅ Successfully added variants: ${successCount} products`)
    console.log(`⚠️ Skipped (already have variants): ${skippedCount} products`)
    console.log(`❌ Failed additions: ${errorCount} products`)
    
  } catch (error) {
    console.error("❌ Bulk variant addition failed:", error)
  }
}