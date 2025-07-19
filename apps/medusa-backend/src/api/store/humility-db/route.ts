import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { ProductService } from "@medusajs/medusa"

// GET /store/humility-db - Get all content (techniques, flow sessions, mindset modules)
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productService = req.scope.resolve<ProductService>("productService")
  
  try {
    const { content_type, difficulty_level, category, limit = 20, offset = 0 } = req.query

    // Build filters for content only
    const filters: any = {
      status: "published"
    }

    // Filter by content type if specified
    if (content_type) {
      filters['metadata.content_type'] = content_type
    }

    // Filter by difficulty level if specified  
    if (difficulty_level) {
      filters['metadata.difficulty_level'] = difficulty_level
    }

    // Get products with filters
    const products = await productService.listAndCount(filters, {
      relations: ["categories", "images"],
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      order: { created_at: "DESC" }
    })

    // Transform products for frontend consumption
    const transformedProducts = products[0].map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      handle: product.handle,
      thumbnail: product.images?.[0]?.url || null,
      categories: product.categories?.map(cat => ({
        id: cat.id,
        name: cat.name,
        handle: cat.handle
      })) || [],
      
      // Content-specific metadata
      content_type: product.metadata?.content_type,
      difficulty_level: product.metadata?.difficulty_level,
      duration_minutes: product.metadata?.duration_minutes,
      
      // Technique-specific fields
      ...(product.metadata?.content_type === 'technique' && {
        youtube_url: product.metadata?.youtube_url,
        youtube_id: product.metadata?.youtube_id,
        instructor_notes: product.metadata?.instructor_notes,
        key_points: product.metadata?.key_points || [],
        prerequisites: product.metadata?.prerequisites || [],
        next_techniques: product.metadata?.next_techniques || []
      }),
      
      // Flow session-specific fields
      ...(product.metadata?.content_type === 'flow' && {
        session_type: product.metadata?.session_type,
        audio_url: product.metadata?.audio_url,
        instructions: product.metadata?.instructions,
        key_concepts: product.metadata?.key_concepts || []
      }),
      
      // Mindset module-specific fields
      ...(product.metadata?.content_type === 'mindset' && {
        module_type: product.metadata?.module_type,
        content_url: product.metadata?.content_url,
        key_concepts: product.metadata?.key_concepts || [],
        learning_objectives: product.metadata?.learning_objectives || []
      }),
      
      created_at: product.created_at,
      updated_at: product.updated_at
    }))

    res.json({
      products: transformedProducts,
      count: products[1],
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    })
    
  } catch (error) {
    console.error("Error fetching humility db content:", error)
    res.status(500).json({ error: "Failed to fetch content" })
  }
}