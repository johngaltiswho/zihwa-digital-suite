import React, { Suspense } from "react"

import ImageGallery from "@/modules/products/components/image-gallery"
import ProductActions from "@/modules/products/components/product-actions"
import ProductOnboardingCta from "@/modules/products/components/product-onboarding-cta"
import ProductTabs from "@/modules/products/components/product-tabs"
import RelatedProducts from "@/modules/products/components/related-products"
import ProductInfo from "@/modules/products/templates/product-info"
import SkeletonRelatedProducts from "@/modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Product Detail Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          data-testid="product-container"
        >
          {/* Product Images */}
          <div className="order-1 lg:order-1">
            <ImageGallery images={product?.images || []} />
          </div>

          {/* Product Info & Actions */}
          <div className="order-2 lg:order-2 flex flex-col gap-8">
            <ProductInfo product={product} />
            
            <Suspense
              fallback={
                <ProductActions
                  disabled={true}
                  product={product}
                  region={region}
                />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>

            <ProductTabs product={product} />
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="bg-gray-900 py-16">
        <div
          className="max-w-6xl mx-auto px-6"
          data-testid="related-products-container"
        >
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default ProductTemplate
