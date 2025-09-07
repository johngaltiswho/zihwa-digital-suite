import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function deleteImportedProducts({ container }: ExecArgs) {
  console.log("🗑️ Deleting imported products...")
  
  try {
    const productService = container.resolve(Modules.PRODUCT)
    
    // Get all products with migrated_from metadata
    const [products] = await productService.listAndCountProducts({})
    
    const importedProducts = products.filter(product => 
      product.metadata?.migrated_from === "ecwid"
    )
    
    console.log(`📊 Found ${importedProducts.length} imported products to delete`)
    
    for (const product of importedProducts) {
      try {
        await productService.deleteProducts([product.id])
        console.log(`✅ Deleted: ${product.title}`)
      } catch (error) {
        console.log(`❌ Failed to delete "${product.title}":`, error.message)
      }
    }
    
    console.log("🎉 Cleanup completed!")
    
  } catch (error) {
    console.error("❌ Cleanup failed:", error.message)
  }
}