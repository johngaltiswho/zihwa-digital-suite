import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function diagnoseProducts({ container }: ExecArgs) {
  console.log("🔍 Diagnosing product visibility issues...")
  
  try {
    const productService = container.resolve(Modules.PRODUCT)
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
    
    // Get sales channels
    const [salesChannels] = await salesChannelService.listAndCountSalesChannels({})
    console.log(`\n📊 Sales Channels: ${salesChannels.length}`)
    salesChannels.forEach(channel => {
      console.log(`  - ${channel.name} (ID: ${channel.id})`)
    })
    
    // Get products with detailed info
    const [products] = await productService.listAndCountProducts({})
    console.log(`\n📊 Total Products: ${products.length}`)
    
    // Check first 5 products in detail
    console.log(`\n🔍 Checking first 5 products in detail:`)
    for (let i = 0; i < Math.min(5, products.length); i++) {
      const product = products[i]
      
      console.log(`\n--- Product ${i + 1}: ${product.title} ---`)
      console.log(`  ID: ${product.id}`)
      console.log(`  Handle: ${product.handle}`)
      console.log(`  Status: ${product.status}`)
      
      // Get variants separately
      try {
        const [variants] = await productService.listAndCountProductVariants({ 
          product_id: product.id 
        })
        console.log(`  Variants: ${variants.length}`)
        
        if (variants.length > 0) {
          for (const variant of variants) {
            console.log(`    Variant: ${variant.title}`)
            console.log(`      ID: ${variant.id}`)
            
            // Get prices separately
            try {
              const [prices] = await productService.listAndCountProductVariantPrices({ 
                variant_id: variant.id 
              })
              console.log(`      Prices: ${prices.length}`)
              prices.forEach(price => {
                console.log(`        ${price.currency_code}: ${price.amount}`)
              })
            } catch (priceError) {
              console.log(`      Prices: Error getting prices`)
            }
          }
        }
      } catch (variantError) {
        console.log(`  Variants: Error getting variants`)
      }
    }
    
    // Summary statistics
    let publishedCount = 0
    let draftCount = 0
    let withVariantsCount = 0
    let withPricesCount = 0
    
    for (const product of products) {
      if (product.status === 'published') publishedCount++
      if (product.status === 'draft') draftCount++
      
      try {
        const [variants] = await productService.listAndCountProductVariants({ 
          product_id: product.id 
        })
        
        if (variants.length > 0) {
          withVariantsCount++
          
          // Check if any variant has prices
          let hasAnyPrices = false
          for (const variant of variants) {
            try {
              const [prices] = await productService.listAndCountProductVariantPrices({ 
                variant_id: variant.id 
              })
              if (prices.length > 0) {
                hasAnyPrices = true
                break
              }
            } catch (priceError) {
              // Skip this variant's price check
            }
          }
          
          if (hasAnyPrices) withPricesCount++
        }
      } catch (variantError) {
        // Skip this product's variant check
      }
    }
    
    console.log(`\n📊 Summary Statistics:`)
    console.log(`  Published Products: ${publishedCount}`)
    console.log(`  Draft Products: ${draftCount}`)
    console.log(`  Products with Variants: ${withVariantsCount}`)
    console.log(`  Products with Prices: ${withPricesCount}`)
    
    // Identify issues
    console.log(`\n⚠️ Potential Issues:`)
    if (publishedCount === 0) {
      console.log(`  - No published products (all are draft)`)
    }
    if (withVariantsCount < products.length) {
      console.log(`  - ${products.length - withVariantsCount} products missing variants`)
    }
    if (withPricesCount < products.length) {
      console.log(`  - ${products.length - withPricesCount} products missing prices`)
    }
    
  } catch (error) {
    console.error("❌ Diagnosis failed:", error)
  }
}