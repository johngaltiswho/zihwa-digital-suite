import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function checkProductHandles({ container }: ExecArgs) {
  console.log("🔍 Checking product handles...")
  
  try {
    const productService = container.resolve(Modules.PRODUCT)
    
    // Get all products
    const [products] = await productService.listAndCountProducts({})
    console.log(`📊 Found ${products.length} products`)
    
    // Look for the specific products mentioned
    const targetTitles = [
      "Artist Athlete Collaboration: Captain Crazy Navy Blue Tee",
      "Artist Athlete Collaboration: Captain Crazy Tee | Beetroot Red and Grey"
    ]
    
    console.log("\n🎯 Target products:")
    for (const title of targetTitles) {
      const product = products.find(p => p.title === title)
      if (product) {
        console.log(`✅ "${title}"`)
        console.log(`   Handle: ${product.handle}`)
        console.log(`   Status: ${product.status}`)
        console.log(`   URL: /shop/products/${product.handle}`)
        
        // Check variants
        const [variants] = await productService.listAndCountProductVariants({
          product_id: product.id
        })
        console.log(`   Variants: ${variants.length}`)
      } else {
        console.log(`❌ "${title}" - NOT FOUND`)
      }
    }
    
    console.log("\n📋 All Captain Crazy products:")
    const crazyProducts = products.filter(p => p.title.toLowerCase().includes('captain crazy'))
    for (const product of crazyProducts) {
      console.log(`- "${product.title}"`)
      console.log(`  Handle: ${product.handle}`)
      console.log(`  Status: ${product.status}`)
    }
    
  } catch (error) {
    console.error("❌ Handle check failed:", error)
  }
}