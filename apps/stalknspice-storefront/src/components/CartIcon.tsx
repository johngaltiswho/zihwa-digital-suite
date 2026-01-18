"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/vendure/cart-context";

export default function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
      <ShoppingCart size={24} className="text-gray-700" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#8B2323] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  );
}
