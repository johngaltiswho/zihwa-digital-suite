import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function fixImportedProducts({ container }: ExecArgs) {
  console.log("🔧 Fixing imported products - sales channels and pricing...")
  
  try {
    const productService = container.resolve(Modules.PRODUCT)
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
    const pricingService = container.resolve(Modules.PRICING)
    
    // Get sales channel
    const [salesChannels] = await salesChannelService.listAndCountSalesChannels({})
    const salesChannel = salesChannels[0]
    
    if (!salesChannel) {
      throw new Error("No sales channel found")
    }
    
    console.log(`📈 Using sales channel: ${salesChannel.name} (${salesChannel.id})`)
    
    // Get all imported products (check for the new migration marker)
    const [products] = await productService.listAndCountProducts({})
    const importedProducts = products.filter(product => 
      product.metadata?.migrated_from === "ecwid_v2"
    )
    
    console.log(`📊 Found ${importedProducts.length} imported products to fix`)
    
    if (importedProducts.length === 0) {
      console.log("ℹ️ No imported products found with migrated_from: ecwid_v2")
      return
    }
    
    // Fix each product
    for (const product of importedProducts) {
      try {
        console.log(`🔧 Fixing: ${product.title}`)
        
        // 1. Link to sales channel
        await productService.updateProducts([{
          id: product.id,
          sales_channels: [{ id: salesChannel.id }]
        }])
        
        // 2. Get variants for this product
        const variants = await productService.listProductVariants({ product_id: [product.id] })
        
        console.log(`  📦 Found ${variants[0].length} variants`)
        
        // 3. Add pricing to each variant
        const originalPrice = product.metadata?.original_price as number
        if (originalPrice && originalPrice > 0) {
          for (const variant of variants[0]) {
            try {
              // Create price set for this variant
              const priceSet = await pricingService.createPriceSets({
                prices: [
                  {
                    amount: Math.round(originalPrice * 100), // Convert to paise
                    currency_code: "inr"
                  }
                ]
              })
              
              // Link variant to price set
              await productService.updateProductVariants([{
                id: variant.id,
                price_set_id: priceSet.id
              }])
              
              console.log(`    💰 Added ₹${originalPrice} to variant: ${variant.title}`)
            } catch (variantError) {
              console.log(`    ❌ Failed to price variant ${variant.title}:`, variantError.message)
            }
          }
        } else {
          console.log(`    ⚠️ No valid price found (${originalPrice})`)
        }
        
        console.log(`✅ Fixed: ${product.title}`)
        
      } catch (error) {
        console.log(`❌ Failed to fix product "${product.title}":`, error.message)
      }
    }
    
    console.log("🎉 Product fixing completed!")
    
  } catch (error) {
    console.error("❌ Fix process failed:", error.message)
  }
}