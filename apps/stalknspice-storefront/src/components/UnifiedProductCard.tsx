"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useCart } from "@/lib/vendure/cart-context";
import { WishlistButton } from "@/components/WishlistButton";
import { getAssetUrl } from "@/lib/vendure/asset-utils";
import type { Product } from "@/lib/vendure/types";

interface UnifiedProductCardProps {
  product: Product;
  variant?: "shop" | "category" | "premium";
  showMRP?: boolean;
}

export function UnifiedProductCard({
  product,
  variant = "shop",
  showMRP = true
}: UnifiedProductCardProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();

  const currentVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const rawStock = currentVariant?.stockLevel;
  const isOutOfStock = rawStock === 'OUT_OF_STOCK' || rawStock === 0 || rawStock === '0';

  const price = (currentVariant?.price || 0) / 100;
  const mrp = price * 1.2;
  const savings = mrp - price;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedVariantId || adding || isOutOfStock) return;

    setAdding(true);
    try {
      await addToCart(selectedVariantId, 1);
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setAdding(false);
    }
  };

  // Variant-specific styling
  const containerClasses = {
    shop: "bg-white border border-gray-100 p-3 hover:shadow-md",
    category: "bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md",
    premium: "bg-white border border-gray-100 rounded-2xl p-3 hover:shadow-lg"
  };

  const buttonClasses = {
    shop: `px-4 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-1
      ${isOutOfStock
        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
        : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
      }`,
    category: `px-5 py-1.5 border border-red-700 text-red-700 font-bold text-[12px] rounded-lg bg-red-50 hover:bg-red-800 hover:text-white transition-all uppercase
      ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`,
    premium: `px-5 py-2 border border-[#8B2323] text-[#8B2323] font-bold text-[12px] rounded-xl bg-[#8B2323]/5 hover:bg-[#8B2323] hover:text-white transition-all uppercase
      ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`
  };

  const imageContainerClasses = {
    shop: "relative aspect-square mb-2 bg-white flex items-center justify-center",
    category: "relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden mb-3",
    premium: "relative aspect-square w-full bg-gray-50 rounded-xl overflow-hidden mb-3"
  };

  const imageScaleClasses = {
    shop: "group-hover/link:scale-105 transition-transform",
    category: "group-hover:scale-105 transition-transform duration-500",
    premium: "group-hover:scale-110 transition-transform duration-500"
  };

  const titleHoverClasses = {
    shop: "group-hover/link:text-green-600",
    category: "group-hover/link:text-[#8B2323]",
    premium: "group-hover/link:text-[#8B2323]"
  };

  return (
    <div
  className={`${containerClasses[variant]} flex flex-col transition-shadow relative group overflow-visible`}
>
      {/* ── Wishlist heart button ── */}
      <WishlistButton
        product={product}
        variantId={selectedVariantId}
        size={16}
        className="
          absolute top-0 right-0 z-30
          p-1.5 rounded-full
          bg-white/90 hover:bg-white
          shadow-sm border border-gray-100
        "
        tooltip
      />
      {/* Product Link Section */}
      <Link href={`/product/${product.slug}?variant=${selectedVariantId}`} className="flex-grow flex flex-col group/link">
        <div className={imageContainerClasses[variant]}>
          {/* Green dot indicator for shop variant */}
          {variant === "shop" && (
            <div className="absolute top-0 right-0 border border-green-600 p-[1px] w-3 h-3 flex items-center justify-center z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
            </div>
          )}

          <Image
            src={getAssetUrl(currentVariant?.featuredAsset?.preview || product.featuredAsset?.preview)}
            alt={product.name}
            fill
            className={`object-contain p-2 ${imageScaleClasses[variant]} ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
          />

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-20">
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded italic">Out Of Stock</span>
            </div>
          )}
        </div>

        <h3 className={`font-medium text-gray-700 leading-tight line-clamp-2 mb-1 ${titleHoverClasses[variant]}
          ${variant === "shop" ? "text-[13px] h-8" : "text-[13px] font-bold text-gray-800 h-8"}`}>
          {product.name}
        </h3>

        <p className="text-[11px] md:text-[12px] text-gray-500 mb-2">
          {currentVariant?.name.includes('-')
            ? currentVariant.name.split('-').pop()?.trim() || '1 unit'
            : '1 unit'}
        </p>
      </Link>

      {/* Variant Selector (if multiple options) */}
      {product.variants.length > 1 && variant !== "shop" && (
        <select
          value={selectedVariantId}
          onChange={(e) => setSelectedVariantId(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="mb-2 text-[11px] p-1 border border-gray-300 font-medium rounded bg-white outline-none cursor-pointer text-gray-600"
        >
          {product.variants.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name.split(' - ').pop() || v.name}
            </option>
          ))}
        </select>
      )}

      {/* Pricing and Add to Cart Section */}
      <div className="mt-auto pt-2 border-t border-gray-50">
        {showMRP && variant === "shop" ? (
          <>
            <div className="flex items-center gap-4 text-[11px] mb-2">
              <span className="text-gray-400">MRP <span className="line-through">₹{mrp.toFixed(0)}</span></span>
              <span className="font-bold text-gray-800">Our Price <span className="text-sm">₹{price.toFixed(0)}</span></span>
            </div>

            <div className="flex items-center justify-between">
              <div className="bg-green-50 text-green-700 text-[10px] font-bold px-1.5 py-0.5 border border-green-100">
                ₹{savings.toFixed(0)} OFF
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding}
                className={buttonClasses[variant]}
              >
                {adding ? <Loader2 size={12} className="animate-spin" /> : null}
                {isOutOfStock ? 'SOLD' : adding ? '...' : 'ADD'}
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[14px] font-black text-gray-900">
                ₹{price.toFixed(0)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || adding}
              className={buttonClasses[variant]}
            >
              {adding ? <Loader2 size={12} className="animate-spin" /> : null}
              {isOutOfStock ? 'SOLD' : adding ? 'Adding...' : 'Add'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
