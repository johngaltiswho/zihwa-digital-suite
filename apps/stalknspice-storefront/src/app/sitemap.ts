import { MetadataRoute } from 'next'
import { vendureClient } from '@/lib/vendure/client'
import { GET_ALL_PRODUCTS_FOR_SITEMAP, GET_ALL_COLLECTIONS_FOR_SITEMAP } from '@/lib/vendure/queries/sitemap'
import { recipes } from '@/app/recipes/data/recipesData'

// Static routes configuration
const STATIC_ROUTES = [
  { url: '', priority: 1.0, changeFrequency: 'daily' as const },
  { url: '/shop', priority: 0.9, changeFrequency: 'daily' as const },
  { url: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
  { url: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
  { url: '/faq', priority: 0.6, changeFrequency: 'monthly' as const },
  { url: '/recipes', priority: 0.8, changeFrequency: 'weekly' as const },
  { url: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
  { url: '/privacy', priority: 0.4, changeFrequency: 'yearly' as const },
  { url: '/terms', priority: 0.4, changeFrequency: 'yearly' as const },
  { url: '/affiliate', priority: 0.5, changeFrequency: 'monthly' as const },
  { url: '/returns', priority: 0.5, changeFrequency: 'monthly' as const },
  { url: '/real-healthy-juices', priority: 0.7, changeFrequency: 'weekly' as const },
  { url: '/bingers', priority: 0.7, changeFrequency: 'weekly' as const },
  { url: '/vinegars', priority: 0.7, changeFrequency: 'weekly' as const },
  { url: '/ingredients', priority: 0.7, changeFrequency: 'weekly' as const },
]

// Category routes (from static data in category page)
const CATEGORIES = [
  'crushes',
  'syrups',
  'fruits-vegetables',
  'pastas-noodles',
  'milk-cream',
  'sauces'
]

// Cuisine routes (from static data in cuisine page)
const CUISINES = [
  'italian',
  'american',
  'indian',
  'chinese',
  'thai',
  'european',
  'japanese',
  'korean'
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://stalknspice.com'

  try {
    // Fetch all products for sitemap
    const productsData = await vendureClient.request(GET_ALL_PRODUCTS_FOR_SITEMAP, {
      options: { take: 10000 } // Adjust based on catalog size
    })

    // Fetch collections
    const collectionsData = await vendureClient.request(GET_ALL_COLLECTIONS_FOR_SITEMAP, {
      options: { take: 100 }
    })

    const products = productsData?.products?.items || []
    const collections = collectionsData?.collections?.items || []

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map(route => ({
      url: `${baseUrl}${route.url}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))

    // Product routes (highest priority for revenue)
    const productRoutes: MetadataRoute.Sitemap = products.map(product => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    // Collection routes
    const collectionRoutes: MetadataRoute.Sitemap = collections
      .filter(c => c.slug && c.slug.trim())
      .map(collection => ({
        url: `${baseUrl}/collection/${collection.slug}`,
        lastModified: collection.updatedAt ? new Date(collection.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

    // Category routes
    const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map(cat => ({
      url: `${baseUrl}/category/${cat}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Cuisine routes
    const cuisineRoutes: MetadataRoute.Sitemap = CUISINES.map(cuisine => ({
      url: `${baseUrl}/cuisine/${cuisine}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Recipe routes (content marketing priority)
    const recipeRoutes: MetadataRoute.Sitemap = recipes.map(recipe => ({
      url: `${baseUrl}/recipes/${recipe.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [
      ...staticRoutes,
      ...productRoutes,
      ...collectionRoutes,
      ...categoryRoutes,
      ...cuisineRoutes,
      ...recipeRoutes,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static routes as fallback
    return STATIC_ROUTES.map(route => ({
      url: `${baseUrl}${route.url}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))
  }
}
