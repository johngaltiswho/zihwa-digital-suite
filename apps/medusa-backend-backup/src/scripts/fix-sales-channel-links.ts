import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function fixSalesChannelLinks({ container }: ExecArgs) {
  console.log("🔗 Fixing sales channel links using workflows...")
  
  try {
    const productService = container.resolve(Modules.PRODUCT)
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
    
    // Get all products
    const [products] = await productService.listAndCountProducts({})
    console.log(`📦 Found ${products.length} products`)
    
    // Get default sales channel
    const [channels] = await salesChannelService.listAndCountSalesChannels({
      is_default: true
    })
    
    if (channels.length === 0) {
      console.log("❌ No default sales channel found")
      return
    }
    
    const defaultChannel = channels[0]
    console.log(`📢 Using sales channel: ${defaultChannel.name}`)
    
    // Use the link workflow to associate products with sales channel
    const linkWorkflow = container.resolve("linkProductsToSalesChannelWorkflow")
    
    for (const product of products) {
      try {
        await linkWorkflow.run({
          input: {
            id: defaultChannel.id,
            add: [product.id]
          }
        })
        console.log(`✅ Linked: ${product.title}`)
      } catch (error) {
        console.log(`❌ Failed to link ${product.title}: ${error.message}`)
      }
    }
    
    console.log("✅ Sales channel linking complete!")
    
  } catch (error) {
    console.error("❌ Sales channel fix failed:", error)
  }
}