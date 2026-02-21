"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Zap, ChevronDown, Loader2 } from "lucide-react";
import { UnifiedProductCard } from "@/components/UnifiedProductCard";
import { CategorySidebar } from "@/components/CategorySidebar";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const collectionFromUrl = searchParams.get("collection");
  const selectedCollection = collectionFromUrl && collectionFromUrl.trim() !== "" ? collectionFromUrl : null;
  const searchFromUrl = searchParams.get("search");
  const selectedSearchTerm = searchFromUrl && searchFromUrl.trim() !== "" ? searchFromUrl.trim() : null;

  const { products, loading, hasMore, error, sentinelRef, totalItems } = useInfiniteProducts({
    pageSize: 20,
    collectionSlug: selectedCollection || undefined,
    searchTerm: selectedSearchTerm || undefined,
  });

  const activeCategoryName = selectedSearchTerm
    ? `Search: "${selectedSearchTerm}"`
    : selectedCollection
      ? selectedCollection
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "All Products";

  const handleCollectionClick = (slug: string | null) => {
    if (slug) {
      router.push(`/shop?collection=${slug}`);
    } else {
      router.push("/shop");
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronDown size={20} className="rotate-90 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-lg md:text-xl font-black text-[#8B2323] uppercase tracking-tight">MARKETPLACE</h1>
              <p className="text-[10px] md:text-xs text-gray-500 font-medium">{totalItems} GOURMET ITEMS</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-[#FEF2F2] px-5 py-2.5 rounded-full border border-red-100">
            <Zap size={14} className="text-[#8B2323]" />
            <span className="text-[11px] font-bold text-[#8B2323] uppercase tracking-tight">EXPRESS DELIVERY</span>
          </div>
        </div>
      </header>

      <div className="flex max-w-[1600px] mx-auto">
        <CategorySidebar selectedCollection={selectedCollection} onCollectionClick={handleCollectionClick} />

        <section className="flex-1 bg-white p-4 md:p-6">
          <div className="flex items-end gap-3 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 leading-none">{activeCategoryName}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-gray-100 pb-4">
            {["Brand", "Pack Size", "Price", "Discount", "Type"].map((filter) => (
              <button
                key={filter}
                className="px-4 py-1.5 border border-gray-300 rounded-full text-[12px] font-medium text-gray-600 flex items-center gap-2 hover:border-[#8B2323] hover:text-[#8B2323] transition-colors"
              >
                {filter} <ChevronDown size={14} />
              </button>
            ))}
          </div>

          {error && <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

          {loading && products.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-gray-50 aspect-square rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-2">Try selecting a different category</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((p) => (
                  <UnifiedProductCard key={p.id} product={p} variant="premium" showMRP={false} />
                ))}
              </div>

              <div ref={sentinelRef} className="h-20 flex items-center justify-center mt-4">
                {loading && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 size={20} className="animate-spin" />
                    <span className="text-sm">Loading more products...</span>
                  </div>
                )}
                {!hasMore && products.length > 0 && <p className="text-sm text-gray-400">You've reached the end</p>}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
