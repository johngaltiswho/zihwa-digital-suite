import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function fixSalesChannels({ container }: ExecArgs) {
  console.log("🔗 Fixing sales channel linking...")
  
  try {
    const productService = container.resolve(Modules.PRODUCT)
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
    
    // Get all products
    const [products] = await productService.listAndCountProducts({})
    console.log(`📊 Found ${products.length} products to process`)
    
    // Get default sales channel
    const [salesChannels] = await salesChannelService.listAndCountSalesChannels({})
    
    if (salesChannels.length === 0) {
      console.log("⚠️ No sales channels found. Creating default sales channel...")
      
      const defaultChannel = await salesChannelService.createSalesChannels({
        name: "Default Store",
        description: "Default sales channel for the storefront",
        is_default: true
      })
      
      console.log(`✅ Created default sales channel: ${defaultChannel.name}`)
      
      // Link all products to the default channel
      for (const product of products) {
        try {
          await productService.updateProducts(product.id, {
            sales_channels: [{ id: defaultChannel.id }]
          })
          console.log(`✅ Linked product "${product.title}" to default sales channel`)
        } catch (error) {
          console.log(`❌ Failed to link product "${product.title}":`, error.message)
        }
      }
    } else {
      const defaultChannel = salesChannels[0]
      console.log(`📈 Using existing sales channel: ${defaultChannel.name}`)
      
      // Link all products to the sales channel
      let linkedCount = 0
      for (const product of products) {
        try {
          await productService.updateProducts(product.id, {
            sales_channels: [{ id: defaultChannel.id }]
          })
          console.log(`✅ Linked product "${product.title}" to sales channel`)
          linkedCount++
        } catch (error) {
          console.log(`❌ Failed to link product "${product.title}":`, error.message)
        }
      }
      
      console.log(`\n🎉 Sales channel fix completed!`)
      console.log(`✅ Successfully linked: ${linkedCount} products`)
      console.log(`❌ Failed links: ${products.length - linkedCount} products`)
    }
    
  } catch (error) {
    console.error("❌ Sales channel fix failed:", error)
  }
}