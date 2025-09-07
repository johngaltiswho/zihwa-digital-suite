import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function debugStoreApi({ container }: ExecArgs) {
  console.log("🔍 Debugging store API product visibility...")
  
  try {
    const productService = container.resolve(Modules.PRODUCT)
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
    const regionService = container.resolve(Modules.REGION)
    
    // Check total products in database
    const [allProducts] = await productService.listAndCountProducts({})
    console.log(`📊 Total products in database: ${allProducts.length}`)
    
    // Check published products
    const [publishedProducts] = await productService.listAndCountProducts({
      status: ["published"]
    })
    console.log(`📢 Published products: ${publishedProducts.length}`)
    
    // Check sales channels
    const [salesChannels] = await salesChannelService.listAndCountSalesChannels({})
    console.log(`🏪 Sales channels: ${salesChannels.length}`)
    
    if (salesChannels.length > 0) {
      const defaultChannel = salesChannels[0]
      console.log(`   Default channel: "${defaultChannel.name}" (${defaultChannel.id})`)
      console.log(`   Is default: ${defaultChannel.is_default}`)
    }
    
    // Check regions
    const [regions] = await regionService.listAndCountRegions({})
    console.log(`🌍 Regions: ${regions.length}`)
    
    if (regions.length > 0) {
      const defaultRegion = regions[0]
      console.log(`   Default region: "${defaultRegion.name}" (${defaultRegion.id})`)
      console.log(`   Currency: ${defaultRegion.currency_code}`)
    }
    
    // Check first few products for sales channel association
    console.log(`\n📋 Sample product details:`)
    for (let i = 0; i < Math.min(3, allProducts.length); i++) {
      const product = allProducts[i]
      console.log(`${i + 1}. "${product.title}"`)
      console.log(`   Status: ${product.status}`)
      console.log(`   Handle: ${product.handle}`)
      
      // Check variants
      const [variants] = await productService.listAndCountProductVariants({
        product_id: product.id
      })
      console.log(`   Variants: ${variants.length}`)
      
      if (variants.length > 0) {
        const firstVariant = variants[0]
        console.log(`   First variant has price_set_id: ${firstVariant.price_set_id ? 'Yes' : 'No'}`)
      }
    }
    
    console.log(`\n✅ Debug complete`)
    
  } catch (error) {
    console.error("❌ Debug failed:", error)
  }
}