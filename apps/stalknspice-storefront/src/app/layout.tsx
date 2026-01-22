'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { StalknSpiceFooter } from "@repo/ui";
import { AuthProvider } from "@/lib/vendure/auth-context";
import { CartProvider } from "@/lib/vendure/cart-context";
import { CollectionsProvider, useCollections } from "@/lib/vendure/collections-context";
import HeaderWrapper from "@/components/HeaderWrapper";
import { useMemo } from "react";

const inter = Inter({ subsets: ["latin"] });

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { topLevelCollections, isLoading } = useCollections();

  // Transform collections to navigation items
  const navItems = useMemo(() => {
    if (isLoading || topLevelCollections.length === 0) {
      return [];
    }
    // Filter out collections without valid slugs and map to nav items
    return topLevelCollections
      .filter(collection => collection.slug && collection.slug.trim() !== '')
      .map(collection => ({
        label: collection.name,
        href: `/collection/${collection.slug}`,
      }));
  }, [topLevelCollections, isLoading]);

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
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CollectionsProvider>
            <CartProvider>
              <LayoutContent>{children}</LayoutContent>
            </CartProvider>
          </CollectionsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}