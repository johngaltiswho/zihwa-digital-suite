"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/vendure/wishlist-context";
import type { Product } from "@/lib/vendure/types";

interface WishlistButtonProps {
  product: Product;
  variantId?: string;
  size?: number;
  className?: string;

  /* 🔹 UPDATED: optional tooltip support */
  tooltip?: boolean;
}

export function WishlistButton({
  product,
  variantId,
  size = 16,
  className = "",
  tooltip = false
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(product.id);

  const label = active ? "Remove from wishlist" : "Add to wishlist";

  return (
    <div className="relative group">
      {/* ============================= */}
      {/* ❤️ WISHLIST BUTTON (UPDATED) */}
      {/* ============================= */}
      <button
        type="button"
        aria-label={label}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product, variantId);
        }}
        className={`transition-all duration-200 ${className}`}
      >
        <Heart
          size={23}
          className={`transition-all duration-200 ${
            active
              ? "fill-[#8B2323] stroke-[#8B2323]"
              : "stroke-gray-400 fill-transparent group-hover:stroke-[#8B2323]"
          }`}
        />
      </button>

      {/* ============================= */}
      {/* 🏷️ TOOLTIP (UPDATED) */}
      {/* ============================= */}
      {tooltip && (
  <span
    className="
      pointer-events-none
      absolute top-full -mt-3 left-1/2 -translate-x-1/1
      whitespace-nowrap
      rounded-md bg-gray-900 px-6 py-1
      text-[10px] font-medium text-white
      opacity-0 group-hover:opacity-100
      transition-opacity duration-200
      shadow-lg
      z-[9999]
    "
  >
    {label}
  </span>
)}
    </div>
  );
}