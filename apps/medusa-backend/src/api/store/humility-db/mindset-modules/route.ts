import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { ProductService } from "@medusajs/medusa"

// GET /store/humility-db/mindset-modules - Get mindset module content only
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productService = req.scope.resolve<ProductService>("productService")
  
  try {
    const { module_type, difficulty_level, limit = 20, offset = 0 } = req.query

    const filters: any = {
      type: "digital_content",
      status: "published",
      'metadata.content_type': 'mindset'
    }

    // Filter by module type if specified
    if (module_type) {
      filters['metadata.module_type'] = module_type
    }

    // Filter by difficulty level if specified
    if (difficulty_level) {
      filters['metadata.difficulty_level'] = difficulty_level
    }

    const mindsetModules = await productService.listAndCount(filters, {
      relations: ["categories", "images"],
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      order: { created_at: "DESC" }
    })

    // Transform for mindset module-specific response
    const transformedModules = mindsetModules[0].map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      handle: product.handle,
      thumbnail: product.images?.[0]?.url || null,
      
      // Mindset module-specific fields
      module_type: product.metadata?.module_type,
      difficulty_level: product.metadata?.difficulty_level,
      duration_minutes: product.metadata?.duration_minutes,
      content_url: product.metadata?.content_url,
      key_concepts: product.metadata?.key_concepts || [],
      learning_objectives: product.metadata?.learning_objectives || [],
      
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
      mindset_modules: transformedModules,
      count: mindsetModules[1],
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    })
    
  } catch (error) {
    console.error("Error fetching mindset modules:", error)
    res.status(500).json({ error: "Failed to fetch mindset modules" })
  }
}