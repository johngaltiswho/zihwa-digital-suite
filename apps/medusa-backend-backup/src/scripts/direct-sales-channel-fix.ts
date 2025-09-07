import { ExecArgs } from "@medusajs/framework/types"

export default async function directSalesChannelFix({ container }: ExecArgs) {
  console.log("🔗 Direct sales channel fix...")
  
  try {
    const manager = container.resolve("manager")
    
    // Get sales channel ID
    const salesChannels = await manager.query(`
      SELECT id, name FROM sales_channel WHERE name = 'Default Sales Channel'
    `)
    
    if (salesChannels.length === 0) {
      console.log("❌ No default sales channel found")
      return
    }
    
    const channelId = salesChannels[0].id
    console.log(`📢 Using sales channel: ${salesChannels[0].name} (${channelId})`)
    
    // Get all products
    const products = await manager.query(`
      SELECT id, title FROM product WHERE deleted_at IS NULL
    `)
    
    console.log(`📦 Found ${products.length} products`)
    
    let linked = 0
    
    for (const product of products) {
      try {
        // Check if link already exists
        const existingLink = await manager.query(`
          SELECT 1 FROM product_sales_channel 
          WHERE product_id = $1 AND sales_channel_id = $2
        `, [product.id, channelId])
        
        if (existingLink.length === 0) {
          // Create the link
          await manager.query(`
            INSERT INTO product_sales_channel (product_id, sales_channel_id)
            VALUES ($1, $2)
          `, [product.id, channelId])
          
          linked++
          console.log(`✅ Linked: ${product.title}`)
        } else {
          console.log(`⚠️ Already linked: ${product.title}`)
        }
        
      } catch (error) {
        console.log(`❌ Failed to link ${product.title}: ${error.message}`)
      }
    }
    
    console.log(`✅ Direct linking complete! Linked ${linked} products`)
    
  } catch (error) {
    console.error("❌ Direct sales channel fix failed:", error)
  }
}