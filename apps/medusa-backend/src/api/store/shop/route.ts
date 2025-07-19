import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { ProductService } from "@medusajs/medusa"

// GET /store/shop - Get e-commerce products only
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productService = req.scope.resolve<ProductService>("productService")
  
  try {
    const { category, limit = 20, offset = 0 } = req.query

    const filters: any = {
      type: "physical_product", // Only physical products for e-commerce
      status: "published"
    }

    const products = await productService.listAndCount(filters, {
      relations: ["categories", "images", "variants", "variants.prices"],
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      order: { created_at: "DESC" }
    })

    // Transform products for e-commerce frontend
    const transformedProducts = products[0].map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      handle: product.handle,
      thumbnail: product.images?.[0]?.url || null,
      images: product.images?.map(img => ({
        id: img.id,
        url: img.url
      })) || [],
      
      // E-commerce specific fields
      variants: product.variants?.map(variant => ({
        id: variant.id,
        title: variant.title,
        inventory_quantity: variant.inventory_quantity,
        prices: variant.prices?.map(price => ({
          id: price.id,
          currency_code: price.currency_code,
          amount: price.amount
        })) || []
      })) || [],
      
      categories: product.categories?.map(cat => ({
        id: cat.id,
        name: cat.name,
        handle: cat.handle
      })) || [],
      
      // Product-specific metadata
      material: product.metadata?.material,
      sizes: product.metadata?.sizes || [],
      features: product.metadata?.features || [],
      care_instructions: product.metadata?.care_instructions,
      
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
    console.error("Error fetching shop products:", error)
    res.status(500).json({ error: "Failed to fetch products" })
  }
}