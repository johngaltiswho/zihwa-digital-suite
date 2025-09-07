import { HttpTypes } from "@medusajs/types"
import Link from "next/link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-6">
        {product.collection && (
          <Link
            href={`/shop/collections/${product.collection.handle}`}
            className="text-cyan-400 hover:text-cyan-300 text-sm uppercase tracking-wider transition-colors"
          >
            {product.collection.title}
          </Link>
        )}
        
        <h1
          className="text-4xl font-light text-white leading-tight"
          data-testid="product-title"
        >
          {product.title}
        </h1>

        {product.description && (
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-3">
              Description
            </h3>
            <p
              className="text-gray-200 text-lg leading-relaxed whitespace-pre-line"
              data-testid="product-description"
            >
              {product.description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
