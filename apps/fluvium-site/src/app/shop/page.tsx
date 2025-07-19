import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { listCollections } from "@/lib/medusa-lib/data/collections"
import { getRegion } from "@/lib/medusa-lib/data/regions"
import { listProducts } from "@/lib/medusa-lib/data/products"

export const metadata: Metadata = {
  title: "Fluvium Shop - Premium Martial Arts Gear",
  description:
    "Premium martial arts gear for the modern warrior. Quality equipment that matches your commitment to excellence.",
}

export default async function ShopHome() {
  // Use default region from env
  const region = await getRegion(process.env.NEXT_PUBLIC_DEFAULT_REGION || 'in')

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  // Get featured products
  const { products } = await listProducts({
    pageParam: 1,
    queryParams: { limit: 8 },
    countryCode: process.env.NEXT_PUBLIC_DEFAULT_REGION || 'in',
  })

  if (!region) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-white mb-4">Setting up your region...</h1>
          <p className="text-gray-400">Please configure your region in Medusa Admin</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="shop-hero">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="shop-title">
            Fluvium <span className="neon-glow">Shop</span>
          </h1>
          <p className="shop-subtitle">
            Premium martial arts gear for the modern warrior. Quality equipment that matches your commitment to excellence.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-white mb-4">
              Featured Products
            </h2>
            <p className="text-gray-400 font-light">
              Discover our premium collection of martial arts equipment
            </p>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/products/${product.handle}`}
                  className="product-card group"
                >
                  {/* Product Image */}
                  <div className="product-image">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.title}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-4xl text-gray-500">📦</div>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="product-info">
                    <h3 className="product-title line-clamp-2">
                      {product.title}
                    </h3>
                    
                    {product.description && (
                      <p className="product-description line-clamp-3">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      {product.variants && product.variants[0] && product.variants[0].calculated_price ? (
                        <span className="product-price">
                          ₹{product.variants[0].calculated_price.calculated_amount}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">Price on request</span>
                      )}
                      
                      <button className="shop-button">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-6 opacity-50">🛒</div>
              <h3 className="text-2xl font-light text-white mb-4">No products available</h3>
              <p className="text-gray-400 font-light mb-8">
                Products need variants to be displayed. Please add variants to your products in Medusa Admin.
              </p>
              <Link href="/shop/store" className="shop-button-outline">
                Browse All Products
              </Link>
            </div>
          )}

          {/* View All Products Button */}
          {products && products.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/shop/store" className="shop-button-outline">
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Collections Preview */}
      {collections && collections.length > 0 && (
        <section className="py-16 px-6 bg-gradient-to-b from-transparent to-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-white mb-4">
                Shop by Category
              </h2>
              <p className="text-gray-400 font-light">
                Explore our carefully curated collections
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.slice(0, 6).map((collection) => (
                <Link
                  key={collection.id}
                  href={`/shop/collections/${collection.handle}`}
                  className="product-card group"
                >
                  <div className="product-image">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-4xl text-gray-400">📁</div>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{collection.title}</h3>
                    <button className="shop-button-outline w-full">
                      Browse Collection
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}