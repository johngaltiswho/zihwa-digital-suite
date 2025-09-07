import { Metadata } from "next"

import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@/modules/store/templates"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params?: Promise<{
    countryCode?: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params || {};
  const searchParams = await props.searchParams;
  const { sortBy, page } = searchParams

  // Use default country code if not provided
  const countryCode = params.countryCode || process.env.NEXT_PUBLIC_DEFAULT_REGION || 'in'

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
    />
  )
}
