import { Suspense } from "react"

import SkeletonProductGrid from "@/modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@/modules/store/components/refinement-list"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Store Header */}
      <section className="py-16 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-light text-white mb-4" data-testid="store-page-title">
            All <span className="neon-glow">Products</span>
          </h1>
          <p className="text-gray-400 font-light">
            Browse our complete collection of premium martial arts equipment
          </p>
        </div>
      </section>

      {/* Store Content */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            className="flex flex-col lg:flex-row gap-8"
            data-testid="category-container"
          >
            {/* Sidebar - Refinement/Filters */}
            <div className="lg:w-1/4">
              <RefinementList sortBy={sort} />
            </div>
            
            {/* Products Grid */}
            <div className="lg:w-3/4">
              <Suspense fallback={<SkeletonProductGrid />}>
                <PaginatedProducts
                  sortBy={sort}
                  page={pageNumber}
                  countryCode={countryCode}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default StoreTemplate
