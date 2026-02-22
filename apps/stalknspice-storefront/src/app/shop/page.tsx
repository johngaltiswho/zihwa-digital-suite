"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Zap, ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState, Suspense } from "react";
import { UnifiedProductCard } from "@/components/UnifiedProductCard";
import { CategorySidebar } from "@/components/CategorySidebar";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import type { Product } from "@/lib/vendure/types";
import { vendureClient } from "@/lib/vendure/client";
import { GET_BRAND_COLLECTIONS } from "@/lib/vendure/queries/products";

type FiltersState = {
  brand: string;
  packSize: string;
  price: string;
  discount: string;
  stockType: string;
};

const defaultFilters: FiltersState = {
  brand: "all",
  packSize: "all",
  price: "all",
  discount: "all",
  stockType: "all",
};

function getPrimaryVariant(product: Product) {
  return product.variants?.[0];
}

function getPackSize(product: Product) {
  const variantName = getPrimaryVariant(product)?.name || "";
  if (!variantName) return "Unknown";
  if (variantName.includes("-")) {
    return variantName.split("-").pop()?.trim() || "Unknown";
  }
  if (variantName.includes(" - ")) {
    return variantName.split(" - ").pop()?.trim() || "Unknown";
  }
  return variantName.trim();
}

function getBrandNames(product: Product) {
  const brandsFromCollections =
    product.collections
      ?.filter((c) => /brand/i.test(c.name))
      .map((c) => c.name.replace(/^brand[-\s]*/i, "").trim())
      .filter(Boolean) || [];
  return brandsFromCollections;
}

function getPriceInr(product: Product) {
  const variant = getPrimaryVariant(product);
  return ((variant?.price ?? 0) as number) / 100;
}

function getDiscountPercent(product: Product) {
  const price = getPriceInr(product);
  if (!price || price <= 0) return 0;
  const mrp = price * 1.2;
  return ((mrp - price) / mrp) * 100;
}

function isOutOfStock(product: Product) {
  const stock = getPrimaryVariant(product)?.stockLevel;
  return stock === "OUT_OF_STOCK" || stock === "0";
}

function ShopPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [allBrandOptions, setAllBrandOptions] = useState<string[]>([]);

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

  const filterOptions = useMemo(() => {
    const brandsFromLoadedProducts = Array.from(
      new Set(
        products.flatMap((p) => getBrandNames(p)),
      ),
    ).sort((a, b) => a.localeCompare(b));
    const brands = Array.from(new Set([...allBrandOptions, ...brandsFromLoadedProducts])).sort((a, b) =>
      a.localeCompare(b),
    );

    const packSizes = Array.from(
      new Set(
        products.map((p) => getPackSize(p)).filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return {
      brands,
      packSizes,
    };
  }, [products, allBrandOptions]);

  useEffect(() => {
    let ignore = false;
    const loadAllBrands = async () => {
      try {
        const pageSize = 100;
        let skip = 0;
        let totalItems = 0;
        const allItems: Array<{ name: string }> = [];

        do {
          const data = await vendureClient.request(GET_BRAND_COLLECTIONS, {
            options: {
              filter: {
                name: { contains: "Brand" },
              },
              take: pageSize,
              skip,
            },
          });

          const items = data.collections?.items || [];
          totalItems = data.collections?.totalItems || 0;
          allItems.push(...items);
          skip += pageSize;
        } while (skip < totalItems);

        const brands =
          allItems
            .map((item) => item.name.replace(/^brand[-\s]*/i, "").trim())
            .filter((name) => name.length > 0) || [];

        if (!ignore) {
          setAllBrandOptions(Array.from(new Set(brands)).sort((a, b) => a.localeCompare(b)));
        }
      } catch (e) {
        console.error("Failed to load brand options:", e);
      }
    };

    loadAllBrands();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filters.brand !== "all") {
        const brandNames = getBrandNames(product);
        if (!brandNames.includes(filters.brand)) return false;
      }

      if (filters.packSize !== "all") {
        if (getPackSize(product) !== filters.packSize) return false;
      }

      if (filters.price !== "all") {
        const price = getPriceInr(product);
        if (filters.price === "under-100" && !(price < 100)) return false;
        if (filters.price === "100-250" && !(price >= 100 && price <= 250)) return false;
        if (filters.price === "250-500" && !(price > 250 && price <= 500)) return false;
        if (filters.price === "500-plus" && !(price > 500)) return false;
      }

      if (filters.discount !== "all") {
        const discount = getDiscountPercent(product);
        if (filters.discount === "10-plus" && !(discount >= 10)) return false;
        if (filters.discount === "20-plus" && !(discount >= 20)) return false;
        if (filters.discount === "30-plus" && !(discount >= 30)) return false;
      }

      if (filters.stockType !== "all") {
        const outOfStock = isOutOfStock(product);
        if (filters.stockType === "in-stock" && outOfStock) return false;
        if (filters.stockType === "out-of-stock" && !outOfStock) return false;
      }

      return true;
    });
  }, [products, filters]);

  const hasActiveFilters = Object.values(filters).some((v) => v !== "all");

  const handleCollectionClick = (slug: string | null) => {
    if (slug) {
      router.push(`/shop?collection=${slug}`);
    } else {
      router.push("/shop");
    }
  };

  return (
    <main className="bg-white">
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
            <div className="relative">
              <select
                value={filters.brand}
                onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
                className="appearance-none pr-8 px-4 py-1.5 border border-gray-300 rounded-full text-[12px] font-medium text-gray-600 bg-white hover:border-[#8B2323] focus:border-[#8B2323] focus:outline-none"
              >
                <option value="all">Brand</option>
                {filterOptions.brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>

            <div className="relative">
              <select
                value={filters.packSize}
                onChange={(e) => setFilters((prev) => ({ ...prev, packSize: e.target.value }))}
                className="appearance-none pr-8 px-4 py-1.5 border border-gray-300 rounded-full text-[12px] font-medium text-gray-600 bg-white hover:border-[#8B2323] focus:border-[#8B2323] focus:outline-none"
              >
                <option value="all">Pack Size</option>
                {filterOptions.packSizes.map((pack) => (
                  <option key={pack} value={pack}>
                    {pack}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>

            <div className="relative">
              <select
                value={filters.price}
                onChange={(e) => setFilters((prev) => ({ ...prev, price: e.target.value }))}
                className="appearance-none pr-8 px-4 py-1.5 border border-gray-300 rounded-full text-[12px] font-medium text-gray-600 bg-white hover:border-[#8B2323] focus:border-[#8B2323] focus:outline-none"
              >
                <option value="all">Price</option>
                <option value="under-100">Under Rs. 100</option>
                <option value="100-250">Rs. 100 - Rs. 250</option>
                <option value="250-500">Rs. 250 - Rs. 500</option>
                <option value="500-plus">Rs. 500+</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>

            <div className="relative">
              <select
                value={filters.discount}
                onChange={(e) => setFilters((prev) => ({ ...prev, discount: e.target.value }))}
                className="appearance-none pr-8 px-4 py-1.5 border border-gray-300 rounded-full text-[12px] font-medium text-gray-600 bg-white hover:border-[#8B2323] focus:border-[#8B2323] focus:outline-none"
              >
                <option value="all">Discount</option>
                <option value="10-plus">10%+ Off</option>
                <option value="20-plus">20%+ Off</option>
                <option value="30-plus">30%+ Off</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>

            <div className="relative">
              <select
                value={filters.stockType}
                onChange={(e) => setFilters((prev) => ({ ...prev, stockType: e.target.value }))}
                className="appearance-none pr-8 px-4 py-1.5 border border-gray-300 rounded-full text-[12px] font-medium text-gray-600 bg-white hover:border-[#8B2323] focus:border-[#8B2323] focus:outline-none"
              >
                <option value="all">Type</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>

            {hasActiveFilters && (
              <button
                onClick={() => setFilters(defaultFilters)}
                className="px-4 py-1.5 border border-red-200 rounded-full text-[12px] font-semibold text-[#8B2323] bg-red-50 hover:bg-red-100 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {error && <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

          {loading && products.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-gray-50 aspect-square rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-2">
                {hasActiveFilters ? "Try clearing some filters" : "Try selecting a different category"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((p) => (
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
                {!hasMore && filteredProducts.length > 0 && <p className="text-sm text-gray-400">You've reached the end</p>}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <main className="bg-white min-h-screen">
        <div className="flex items-center justify-center h-screen">
          <Loader2 size={40} className="animate-spin text-[#8B2323]" />
        </div>
      </main>
    }>
      <ShopPageContent />
    </Suspense>
  );
}
