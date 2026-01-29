"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/vendure/cart-context";

export default function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors flex">
      <ShoppingCart size={32} className="text-gray-600 " />
      {itemCount > 0 && (
        <span className="absolute top-0 -right-0 bg-[#8B2323] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  );
}
