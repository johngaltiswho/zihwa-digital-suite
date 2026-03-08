'use client'

import { useMemo } from "react"
import { StalknSpiceFooter } from "@repo/ui"
import { AuthProvider } from "@/lib/vendure/auth-context"
import { CartProvider } from "@/lib/vendure/cart-context"
import { CollectionsProvider, useCollections } from "@/lib/vendure/collections-context"
import { WishlistProvider } from "@/lib/vendure/wishlist-context"
import HeaderWrapper from "@/components/HeaderWrapper"

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { topLevelCollections, isLoading } = useCollections()

  // Transform collections to navigation items
  const navItems = useMemo(() => {
    if (isLoading || topLevelCollections.length === 0) {
      return []
    }
    // Filter out collections without valid slugs and map to nav items
    return topLevelCollections
      .filter(collection => collection.slug && collection.slug.trim() !== '')
      .map(collection => ({
        label: collection.name,
        href: `/shop?collection=${collection.slug}`,
      }))
  }, [topLevelCollections, isLoading])

  return (
    <>
      <HeaderWrapper
        navItems={navItems}
        logoSrc="/images/sns-logo.png"
        isEcommerce={true}
        collections={topLevelCollections}
      />

      <main className="min-h-screen">
        {children}
      </main>
      <StalknSpiceFooter />
    </>
  )
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CollectionsProvider>
        <CartProvider>
          <WishlistProvider>
            <LayoutContent>{children}</LayoutContent>
          </WishlistProvider>
        </CartProvider>
      </CollectionsProvider>
    </AuthProvider>
  )
}
