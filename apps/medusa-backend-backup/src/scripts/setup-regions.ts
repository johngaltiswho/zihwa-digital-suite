import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function setupRegions({ container }: ExecArgs) {
  console.log("🌍 Setting up regions and countries...")
  
  try {
    const regionService = container.resolve(Modules.REGION)
    
    // Check if India region exists
    const [regions] = await regionService.listAndCountRegions({
      name: "India"
    })
    
    if (regions.length === 0) {
      console.log("📍 Creating India region...")
      
      // Create India region
      const indiaRegion = await regionService.createRegions([{
        name: "India",
        currency_code: "inr",
        automatic_taxes: true,
        countries: [
          { iso_2: "in", iso_3: "ind", name: "India", display_name: "India" }
        ]
      }])
      
      console.log(`✅ Created India region: ${indiaRegion[0].id}`)
    } else {
      console.log(`✅ India region already exists: ${regions[0].id}`)
      
      // Make sure it has the country
      const region = regions[0]
      if (!region.countries || region.countries.length === 0) {
        console.log("📍 Adding India country to region...")
        
        await regionService.updateRegions(region.id, {
          countries: [
            { iso_2: "in", iso_3: "ind", name: "India", display_name: "India" }
          ]
        })
        
        console.log("✅ Added India country to region")
      }
    }
    
    // List all regions for verification
    const [allRegions] = await regionService.listAndCountRegions({})
    console.log(`\n📊 Total regions: ${allRegions.length}`)
    
    allRegions.forEach((region, index) => {
      console.log(`${index + 1}. ${region.name} (${region.currency_code}) - Countries: ${region.countries?.length || 0}`)
    })
    
    console.log(`\n✅ Region setup completed!`)
    
  } catch (error) {
    console.error("❌ Region setup failed:", error)
  }
}