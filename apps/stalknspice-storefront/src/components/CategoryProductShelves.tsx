"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { UnifiedProductCard } from "@/components/UnifiedProductCard";
import type { CategoryShelf } from "@/lib/vendure/home-shelves";

interface CategoryProductShelvesProps {
  shelves: CategoryShelf[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function CategoryProductShelves({ shelves, loading, error, onRetry }: CategoryProductShelvesProps) {
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollShelf = (shelfId: string, direction: "left" | "right") => {
    const container = scrollRefs.current[shelfId];
    if (!container) return;

    const amount = Math.round(container.clientWidth * 0.8);
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="py-6 space-y-8">
        {[...Array(3)].map((_, sectionIndex) => (
          <div key={sectionIndex} className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5">
            <div className="h-8 w-64 bg-gray-100 rounded mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-72 bg-gray-50 rounded-2xl animate-pulse border border-gray-100" />
              ))}
            </div>
          </div>
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-6">
        <div className="border border-red-200 bg-red-50 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-sm font-medium text-red-700">{error}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 rounded-lg text-sm font-semibold border border-red-300 text-red-700 hover:bg-red-100 transition-colors"
            >
              Retry
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  if (shelves.length === 0) {
    return null;
  }

  return (
    <section className="py-6 space-y-10">
      {shelves.map((shelf) => (
        <div key={shelf.collectionId} className="relative bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">{shelf.collectionName}</h2>
            <Link
              href={`/shop?collection=${encodeURIComponent(shelf.collectionSlug)}`}
              className="text-[#8B2323] font-black text-sm md:text-base uppercase tracking-wide hover:underline"
            >
              Explore all items
            </Link>
          </div>

          <div className="relative">
            <div
              ref={(node) => {
                scrollRefs.current[shelf.collectionId] = node;
              }}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory shelf-scrollbar pb-2"
            >
              {shelf.products.map((product) => (
                <div
                  key={product.id}
                  className="snap-start shrink-0 w-[48%] sm:w-[34%] md:w-[28%] lg:w-[22%] xl:w-[18%]"
                >
                  <UnifiedProductCard product={product} variant="premium" showMRP={false} />
                </div>
              ))}
            </div>

            <button
              type="button"
              aria-label={`Scroll ${shelf.collectionName} left`}
              onClick={() => scrollShelf(shelf.collectionId, "left")}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white border border-gray-200 shadow items-center justify-center hover:bg-red-50 hover:border-red-200 text-[#8B2323]"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label={`Scroll ${shelf.collectionName} right`}
              onClick={() => scrollShelf(shelf.collectionId, "right")}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white border border-gray-200 shadow items-center justify-center hover:bg-red-50 hover:border-red-200 text-[#8B2323]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
