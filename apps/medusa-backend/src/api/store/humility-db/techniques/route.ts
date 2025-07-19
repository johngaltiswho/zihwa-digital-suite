import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { IProductModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

// GET /store/humility-db/techniques - Get technique content only
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // Set CORS headers for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-publishable-api-key');
  
  const productService: IProductModuleService = req.scope.resolve(Modules.PRODUCT)
  
  try {
    const { difficulty_level, category, limit = 20, offset = 0 } = req.query

    const filters: any = {
      status: "published",
      'metadata.content_type': 'technique'
    }

    // Filter by difficulty level if specified
    if (difficulty_level) {
      filters['metadata.difficulty_level'] = difficulty_level
    }

    const techniques = await productService.listAndCountProducts(filters, {
      relations: ["categories", "images"],
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      order: { created_at: "DESC" }
    })

    // Transform for technique-specific response
    const transformedTechniques = techniques[0].map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      handle: product.handle,
      thumbnail: product.images?.[0]?.url || null,
      
      // Technique-specific fields
      youtube_url: product.metadata?.youtube_url,
      youtube_id: product.metadata?.youtube_id,
      difficulty_level: product.metadata?.difficulty_level,
      duration_minutes: product.metadata?.duration_minutes,
      instructor_notes: product.metadata?.instructor_notes,
      key_points: product.metadata?.key_points || [],
      prerequisites: product.metadata?.prerequisites || [],
      next_techniques: product.metadata?.next_techniques || [],
      
      categories: product.categories?.map(cat => ({
        id: cat.id,
        name: cat.name,
        handle: cat.handle,
        icon: cat.metadata?.icon,
        color_gradient: cat.metadata?.color_gradient
      })) || [],
      
      created_at: product.created_at
    }))

    res.json({
      techniques: transformedTechniques,
      count: techniques[1],
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    })
    
  } catch (error) {
    console.error("Error fetching techniques:", error)
    res.status(500).json({ error: "Failed to fetch techniques" })
  }
}