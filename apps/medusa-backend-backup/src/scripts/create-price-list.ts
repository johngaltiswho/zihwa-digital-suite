import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function createPriceList({ container }: ExecArgs) {
  console.log("🔧 Creating price list for INR region...")
  
  try {
    const pricingService = container.resolve(Modules.PRICING)
    const regionService = container.resolve(Modules.REGION)
    
    // Get India region
    const [regions] = await regionService.listRegions({
      currency_code: "inr"
    })
    
    if (regions.length === 0) {
      console.log("❌ No INR region found")
      return
    }
    
    const region = regions[0]
    console.log(`📍 Found region: ${region.name}`)
    
    // Create a default price list
    const priceList = await pricingService.createPriceLists({
      title: "Default INR Prices",
      description: "Default price list for INR region",
      type: "sale",
      status: "active"
    })
    
    console.log(`✅ Created price list: ${priceList.title}`)
    
  } catch (error) {
    console.error("❌ Failed to create price list:", error.message)
  }
}