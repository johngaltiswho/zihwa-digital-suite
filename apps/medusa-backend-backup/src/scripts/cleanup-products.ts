import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function cleanupProducts({ container }: ExecArgs) {
  console.log("🧹 Cleaning up existing products...")
  
  try {
    const productService = container.resolve(Modules.PRODUCT)
    
    // Get all products
    const [products] = await productService.listAndCountProducts({})
    
    console.log(`📦 Found ${products.length} products to delete`)
    
    // Delete each product
    for (const product of products) {
      await productService.softDeleteProducts([product.id])
      console.log(`🗑️ Deleted: ${product.title}`)
    }
    
    console.log("✅ All products cleaned up!")
    
  } catch (error) {
    console.error("❌ Cleanup failed:", error)
  }
}