import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function linkProductsToSalesChannel({ container }: ExecArgs) {
  console.log("🔗 Linking products to sales channel...")
  
  try {
    const productService = container.resolve(Modules.PRODUCT)
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
    
    // Get all products
    const [products] = await productService.listAndCountProducts({
      status: "published"
    })
    
    console.log(`📦 Found ${products.length} products`)
    
    // Get the default sales channel
    const [salesChannels] = await salesChannelService.listAndCountSalesChannels({})
    
    if (salesChannels.length === 0) {
      console.log("📢 Creating default sales channel...")
      const salesChannel = await salesChannelService.createSalesChannels({
        name: "Default Sales Channel",
        description: "Default sales channel for all products",
        is_disabled: false
      })
      console.log(`✅ Created sales channel: ${salesChannel.name}`)
    }
    
    const defaultSalesChannel = salesChannels[0]
    console.log(`📢 Using sales channel: ${defaultSalesChannel.name}`)
    
    // Link each product to the sales channel by updating the product
    for (const product of products) {
      try {
        await productService.updateProducts({
          id: product.id,
          sales_channels: [{ id: defaultSalesChannel.id }]
        })
        console.log(`✅ Linked product: ${product.title}`)
      } catch (error) {
        console.log(`⚠️ Could not link product ${product.title}:`, error.message)
      }
    }
    
    console.log("🎉 Product linking complete!")
    console.log("🧪 Test the API now with your publishable key")
    
  } catch (error) {
    console.error("❌ Failed to link products:", error)
  }
}