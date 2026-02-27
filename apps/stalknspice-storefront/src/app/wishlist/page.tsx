"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/lib/vendure/wishlist-context";
import { useCart } from "@/lib/vendure/cart-context";
import { getAssetUrl } from "@/lib/vendure/asset-utils";
import { useState } from "react";
import Newsletter from "@/components/NewsLetter";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist, count } = useWishlist();
  const { addToCart } = useCart();

  const [addingId, setAddingId] = useState<string | null>(null);

  // 🔴 UPDATED: simple inline toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleAddToCart = async (variantId: string, productId: string) => {
    setAddingId(productId);
    try {
      await addToCart(variantId, 1);
      showToast("Added to cart"); // 🔴 UPDATED
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setAddingId(null);
    }
  };

  /* ---------------- EMPTY STATE ---------------- */
  if (count === 0) {
    return (
      <>
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-2 text-center bg-[#FAF7F2]">
          <div className="w-24 h-24 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-4">
            <Heart size={36} className="stroke-[#8B2323] fill-transparent" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            YOUR WISHLIST
          </h1>
          <p className="text-[#8B2323] font-black text-2xl md:text-3xl mb-6">
            IS EMPTY.
          </p>

          <p className="text-gray-500 max-w-md mb-8">
            Save your favourite ingredients and pantry staples here. We'll let you know when they go on sale.
          </p>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#8B2323] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#6e1b1b] transition-colors"
          >
            Start Shopping <ArrowRight size={16} />
          </Link>
        </div>

        <Newsletter />
      </>
    );
  }

  /* ---------------- FILLED STATE ---------------- */
  return (
    <>
      <div className="min-h-screen bg-[#FAF7F2] py-4 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                YOUR WISHLIST
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {count} {count === 1 ? "item" : "items"} saved
              </p>
            </div>

            <button
              onClick={() => {
                clearWishlist();
                showToast("Wishlist cleared"); // 🔴 UPDATED
              }}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-600 transition-colors font-medium"
            >
              <Trash2 size={14} />
              Clear all
            </button>
          </div>

          {/* Wishlist Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => {
              const isOutOfStock =
                item.stockLevel === "OUT_OF_STOCK" ||
                item.stockLevel === 0 ||
                item.stockLevel === "0";

              return (
                <div
                  key={item.productId}
                  className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <Link href={`/product/${item.slug}?variant=${item.variantId}`}>
                    <div className="relative aspect-square w-full bg-gray-50 rounded-xl overflow-hidden mb-3">
                      <Image
                        src={getAssetUrl(item.image)}
                        alt={item.name}
                        fill
                        className={`object-contain p-2 transition-transform duration-300 hover:scale-105 ${
                          isOutOfStock ? "grayscale opacity-50" : ""
                        }`}
                      />

                      {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                          <span className="bg-red-500 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Title */}
                  <Link href={`/product/${item.slug}?variant=${item.variantId}`}>
                    <h3 className="text-[13px] font-bold text-gray-800 leading-tight line-clamp-2 mb-1 hover:text-[#8B2323] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 mb-3">
                      {item.variantName.includes("-")
                        ? item.variantName.split("-").pop()?.trim()
                        : "1 unit"}
                    </p>
                  </Link>

                  {/* Actions */}
                  <div className="mt-auto space-y-2 pt-1 border-t border-gray-100">
                    {/* Add to cart */}
                    <button
                      onClick={() =>
                        handleAddToCart(item.variantId, item.productId)
                      }
                      disabled={isOutOfStock || addingId === item.productId}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase transition-all
                        ${
                          isOutOfStock
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-[#8B2323] text-white hover:bg-[#6e1b1b]"
                        }`}
                    >
                      <ShoppingCart size={14} />
                      {addingId === item.productId
                        ? "Adding..."
                        : isOutOfStock
                        ? "Sold Out"
                        : "Add to Cart"}
                    </button>

                    {/* Remove from wishlist */}
                    <button
                      onClick={() => {
                        removeFromWishlist(item.productId);
                        showToast("Removed from wishlist"); // 🔴 UPDATED
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold
                                 border border-red-200 text-red-600 bg-red-50
                                 hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 size={14} />
                      Remove from Wishlist
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue shopping */}
          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[#8B2323] font-bold hover:underline"
            >
              Continue Shopping <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <Newsletter />

      {/* 🔴 UPDATED: INLINE TOAST (no extra file) */}
      {toastMessage && (
        <div
          className="
            fixed bottom-6 right-6 z-[9999]
            bg-[#8B2323] text-white
            px-5 py-3 rounded-xl
            shadow-lg text-sm font-bold
            animate-in fade-in slide-in-from-bottom-3
          "
        >
          {toastMessage}
        </div>
      )}
    </>
  );
}