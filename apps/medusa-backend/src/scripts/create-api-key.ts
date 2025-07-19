import { ExecArgs } from "@medusajs/framework/types"

export default async function createApiKey({ container }: ExecArgs) {
  const apiKeyModuleService = container.resolve("apiKeyModuleService")
  
  try {
    const apiKey = await apiKeyModuleService.create({
      title: "Development Store API Key",
      type: "publishable",
      created_by: "system"
    })
    
    console.log("🔑 Created API Key:")
    console.log(`Title: ${apiKey.title}`)
    console.log(`Token: ${apiKey.token}`)
    console.log(`Type: ${apiKey.type}`)
    console.log("")
    console.log("Add this to your frontend .env.local file:")
    console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.token}`)
    
  } catch (error) {
    console.error("❌ Failed to create API key:", error)
    
    // Try alternative approach
    console.log("Trying alternative approach...")
    try {
      const result = await apiKeyModuleService.createApiKeys({
        title: "Development Store API Key",
        type: "publishable"
      })
      console.log("✅ Created API key:", result)
    } catch (error2) {
      console.error("❌ Alternative approach failed:", error2)
    }
  }
}