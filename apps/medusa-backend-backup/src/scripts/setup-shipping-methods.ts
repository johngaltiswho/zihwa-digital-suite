import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function setupShippingMethods({ container }: ExecArgs) {
  console.log("🚚 Setting up shipping methods...")
  
  try {
    // Get required services
    const regionModule = container.resolve(Modules.REGION)
    const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
    const storeModule = container.resolve(Modules.STORE)

    // Get the first store and region
    const stores = await storeModule.listStores()
    if (stores.length === 0) {
      throw new Error("No store found. Please run setup-development script first.")
    }
    
    const regions = await regionModule.listRegions()
    if (regions.length === 0) {
      throw new Error("No regions found. Please create a region first via admin panel.")
    }
    
    const region = regions[0]
    console.log(`📦 Using region: ${region.name} (${region.currency_code})`)

    // Check if we already have service zones
    const serviceZones = await fulfillmentModule.listServiceZones()
    console.log(`🔍 Found ${serviceZones.length} existing service zones`)

    let serviceZone
    if (serviceZones.length === 0) {
      // Create a service zone
      serviceZone = await fulfillmentModule.createServiceZones({
        name: "Default Service Zone",
        geo_zones: [{
          type: "country",
          country_code: region.countries?.[0]?.iso_2 || "US"
        }]
      })
      console.log("✅ Created service zone:", serviceZone.name)
    } else {
      serviceZone = serviceZones[0]
      console.log("📋 Using existing service zone:", serviceZone.name)
    }

    // Create fulfillment sets
    const fulfillmentSets = await fulfillmentModule.listFulfillmentSets()
    let fulfillmentSet
    
    if (fulfillmentSets.length === 0) {
      fulfillmentSet = await fulfillmentModule.createFulfillmentSets({
        name: "Default Fulfillment",
        type: "shipping",
        service_zones: [serviceZone.id]
      })
      console.log("✅ Created fulfillment set:", fulfillmentSet.name)
    } else {
      fulfillmentSet = fulfillmentSets.find(fs => fs.type === "shipping") || fulfillmentSets[0]
      console.log("📋 Using existing fulfillment set:", fulfillmentSet.name)
    }

    // Create shipping options
    const shippingOptions = await fulfillmentModule.listShippingOptions()
    console.log(`🔍 Found ${shippingOptions.length} existing shipping options`)
    
    if (shippingOptions.length === 0) {
      // Create standard shipping
      const standardShipping = await fulfillmentModule.createShippingOptions({
        name: "Standard Shipping",
        service_zone_id: serviceZone.id,
        shipping_profile_id: "sp_01", // Default shipping profile
        provider_id: "manual", // Use manual fulfillment provider
        price_type: "flat",
        amount: 500, // $5.00 in cents
        data: {}
      })
      console.log("✅ Created standard shipping option")

      // Create express shipping
      const expressShipping = await fulfillmentModule.createShippingOptions({
        name: "Express Shipping",
        service_zone_id: serviceZone.id,
        shipping_profile_id: "sp_01",
        provider_id: "manual",
        price_type: "flat",
        amount: 1500, // $15.00 in cents
        data: {}
      })
      console.log("✅ Created express shipping option")

      // Create free shipping (for orders over $50)
      const freeShipping = await fulfillmentModule.createShippingOptions({
        name: "Free Shipping",
        service_zone_id: serviceZone.id,
        shipping_profile_id: "sp_01", 
        provider_id: "manual",
        price_type: "flat",
        amount: 0, // Free
        data: {}
      })
      console.log("✅ Created free shipping option")
    } else {
      console.log("📋 Using existing shipping options")
    }

    console.log("🎉 Shipping methods setup complete!")
    console.log("📝 You should now be able to select shipping methods during checkout")
    
  } catch (error) {
    console.error("❌ Failed to set up shipping methods:", error)
    console.log("📝 Manual setup required:")
    console.log("1. Go to http://localhost:7001 (Medusa Admin)")
    console.log("2. Go to Settings → Regions")
    console.log("3. Create or edit a region")
    console.log("4. Go to Settings → Shipping")
    console.log("5. Create shipping options for your region")
  }
}