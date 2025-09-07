import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function diagnoseProductIssues({ container }: ExecArgs) {
  console.log("🔍 Diagnosing product visibility issues...")
  
  try {
    const productService = container.resolve(Modules.PRODUCT)
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
    
    // Check if products exist in database
    const [products] = await productService.listAndCountProducts({})
    console.log(`📊 Found ${products.length} products in database`)
    
    if (products.length > 0) {
      const firstProduct = products[0]
      console.log(`🔍 First product: ${firstProduct.title}`)
      console.log(`   - ID: ${firstProduct.id}`)
      console.log(`   - Handle: ${firstProduct.handle}`)
      console.log(`   - Status: ${firstProduct.status}`)
      console.log(`   - Created: ${firstProduct.created_at}`)
      
      // Check variants and pricing
      const [variants] = await productService.listAndCountProductVariants({
        product_id: firstProduct.id
      })
      console.log(`   - Variants: ${variants.length}`)
      
      if (variants.length > 0) {
        const firstVariant = variants[0]
        console.log(`   - First variant: ${firstVariant.title}`)
        console.log(`   - Variant prices:`, firstVariant.prices || 'No prices found')
      }
      
      // Check sales channels
      const [salesChannels] = await salesChannelService.listAndCountSalesChannels({})
      console.log(`📈 Found ${salesChannels.length} sales channels`)
      
      if (salesChannels.length > 0) {
        const firstChannel = salesChannels[0]
        console.log(`   - Channel: ${firstChannel.name} (${firstChannel.id})`)
      }
      
      // Check a few more products for pattern
      console.log(`\n📋 Sample products:`)
      for (let i = 0; i < Math.min(5, products.length); i++) {
        const product = products[i]
        console.log(`${i + 1}. ${product.title} (${product.handle}) - Status: ${product.status}`)
      }
    }
    
    console.log(`\n✅ Diagnosis complete`)
    
  } catch (error) {
    console.error("❌ Diagnosis failed:", error)
  }
}