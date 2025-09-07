import { listProductsWithSort } from "@/lib/medusa-lib/data/products"
import { getRegion } from "@/lib/medusa-lib/data/regions"
import ProductPreview from "@/modules/products/components/product-preview"
import { Pagination } from "@/modules/store/components/pagination"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      {products.length > 0 ? (
        <>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            data-testid="products-list"
          >
            {products.map((p) => {
              return (
                <ProductPreview key={p.id} product={p} region={region} />
              )
            })}
          </div>
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination
                data-testid="product-pagination"
                page={page}
                totalPages={totalPages}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-6 opacity-50">🛒</div>
          <h3 className="text-2xl font-light text-white mb-4">No products found</h3>
          <p className="text-gray-400 font-light">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </>
  )
}
