import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function setupDevelopment({ container }: ExecArgs) {
  console.log("🚀 Setting up development environment...")
  
  try {
    // Try to create a default store first
    const storeModule = container.resolve(Modules.STORE)
    const stores = await storeModule.listStores()
    
    if (stores.length === 0) {
      console.log("📦 Creating default store...")
      const store = await storeModule.createStores({
        name: "Fluvium Store",
        supported_currencies: [{ currency_code: "USD", is_default: true }],
        default_currency_code: "USD"
      })
      console.log("✅ Store created:", store.name)
    }
    
    // Try to create API key using different module names
    const moduleNames = [
      "apiKeyModuleService",
      Modules.API_KEY,
      "apiKeyService"
    ]
    
    let apiKeyCreated = false
    
    for (const moduleName of moduleNames) {
      try {
        const apiKeyModule = container.resolve(moduleName)
        const apiKey = await apiKeyModule.create({
          title: "Development Publishable Key",
          type: "publishable",
          created_by: "system"
        })
        
        console.log("🔑 Created API Key:")
        console.log(`Title: ${apiKey.title}`)
        console.log(`Token: ${apiKey.token}`)
        console.log(`Type: ${apiKey.type}`)
        console.log("")
        console.log("✅ Add this to your frontend .env.local file:")
        console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.token}`)
        
        apiKeyCreated = true
        break
      } catch (error) {
        console.log(`⚠️ Failed with ${moduleName}, trying next...`)
      }
    }
    
    if (!apiKeyCreated) {
      console.log("❌ Could not create API key automatically")
      console.log("📝 Manual setup required:")
      console.log("1. Go to http://localhost:7001 (Medusa Admin)")
      console.log("2. Create an admin user if needed")
      console.log("3. Go to Settings → API Keys")
      console.log("4. Create a new Publishable API Key")
      console.log("5. Copy the key to your .env.local file")
    }
    
  } catch (error) {
    console.error("❌ Setup failed:", error)
    console.log("📝 Manual setup required:")
    console.log("1. Go to http://localhost:7001 (Medusa Admin)")
    console.log("2. Create an admin user if needed")
    console.log("3. Go to Settings → API Keys")
    console.log("4. Create a new Publishable API Key")
    console.log("5. Copy the key to your .env.local file")
  }
}