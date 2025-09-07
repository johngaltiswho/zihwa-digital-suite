import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { ProductService } from "@medusajs/medusa"

// GET /store/humility-db/flow-sessions - Get flow session content only
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productService = req.scope.resolve<ProductService>("productService")
  
  try {
    const { session_type, difficulty_level, limit = 20, offset = 0 } = req.query

    const filters: any = {
      type: "digital_content",
      status: "published", 
      'metadata.content_type': 'flow'
    }

    // Filter by session type if specified
    if (session_type) {
      filters['metadata.session_type'] = session_type
    }

    // Filter by difficulty level if specified
    if (difficulty_level) {
      filters['metadata.difficulty_level'] = difficulty_level
    }

    const flowSessions = await productService.listAndCount(filters, {
      relations: ["categories", "images"],
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      order: { created_at: "DESC" }
    })

    // Transform for flow session-specific response
    const transformedSessions = flowSessions[0].map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      handle: product.handle,
      thumbnail: product.images?.[0]?.url || null,
      
      // Flow session-specific fields
      session_type: product.metadata?.session_type,
      difficulty_level: product.metadata?.difficulty_level,
      duration_minutes: product.metadata?.duration_minutes,
      audio_url: product.metadata?.audio_url,
      instructions: product.metadata?.instructions,
      key_concepts: product.metadata?.key_concepts || [],
      
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
      flow_sessions: transformedSessions,
      count: flowSessions[1],
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    })
    
  } catch (error) {
    console.error("Error fetching flow sessions:", error)
    res.status(500).json({ error: "Failed to fetch flow sessions" })
  }
}