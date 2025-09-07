import { Text } from "@medusajs/ui"
import { listProducts } from "@/lib/medusa-lib/data/products"
import { getProductPrice } from "@/lib/medusa-lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <Link 
      href={`/shop/products/${product.handle}`} 
      className="block bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      data-testid="product-wrapper"
    >
      {/* Product Image */}
      <div className="w-full aspect-square bg-gray-800 rounded-lg overflow-hidden">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0].url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl text-gray-500">📦</div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-white font-light text-lg line-clamp-2 mb-3" data-testid="product-title">
          {product.title}
        </h3>

        <div className="flex items-center justify-between">
          {cheapestPrice ? (
            <span className="text-cyan-400 font-semibold text-lg">
              <PreviewPrice price={cheapestPrice} />
            </span>
          ) : (
            <span className="text-gray-400 text-sm">Price on request</span>
          )}
        </div>
      </div>
    </Link>
  )
}
