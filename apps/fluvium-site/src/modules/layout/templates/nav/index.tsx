import { Suspense } from "react"

import { listRegions } from "@/lib/medusa-lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import CartButton from "@/modules/layout/components/cart-button"
import SideMenu from "@/modules/layout/components/side-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-black border-gray-800">
        <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between w-full h-full">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
          </div>

          <div className="flex items-center h-full">
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden md:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="text-white hover:text-cyan-400 transition-colors duration-200"
                href="/shop-maintenance"
                data-testid="nav-shop-link"
              >
                Shop
              </LocalizedClientLink>
              <LocalizedClientLink
                className="text-white hover:text-cyan-400 transition-colors duration-200"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="text-white hover:text-cyan-400 flex gap-2 transition-colors duration-200"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
