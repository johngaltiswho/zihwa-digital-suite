"use client";

import { useCart } from "@/lib/vendure/cart-context";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { activeOrder, itemCount, updateQuantity, removeFromCart, isLoading } = useCart();
  const [updatingLineId, setUpdatingLineId] = useState<string | null>(null);

  const handleUpdateQuantity = async (orderLineId: string, newQuantity: number) => {
    setUpdatingLineId(orderLineId);
    try {
      await updateQuantity(orderLineId, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setUpdatingLineId(null);
    }
  };

  const handleRemove = async (orderLineId: string) => {
    setUpdatingLineId(orderLineId);
    try {
      await removeFromCart(orderLineId);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setUpdatingLineId(null);
    }
  };

  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price / 100);
  };

  // Empty cart state
  if (!activeOrder || itemCount === 0) {
    return (
      <section className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-12 border border-gray-100 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#8B2323] text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">
          Shopping Cart
        </h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-8">
          {itemCount} {itemCount === 1 ? "Item" : "Items"} in your cart
        </p>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {activeOrder.lines.map((line) => {
              const isUpdating = updatingLineId === line.id;
              const imageUrl = line.featuredAsset?.preview || line.productVariant.product.featuredAsset?.preview;

              return (
                <div
                  key={line.id}
                  className="bg-white rounded-[20px] shadow-md p-6 border border-gray-100 flex gap-6"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden relative">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={line.productVariant.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <Link
                      href={`/product/${line.productVariant.product.slug}`}
                      className="font-bold text-lg text-gray-900 hover:text-[#8B2323] transition-colors"
                    >
                      {line.productVariant.product.name}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">{line.productVariant.name}</p>
                    <p className="text-sm text-gray-500 mt-1">SKU: {line.productVariant.sku}</p>

                    <div className="flex items-center gap-4 mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 border border-gray-200 rounded-full">
                        <button
                          onClick={() => handleUpdateQuantity(line.id, line.quantity - 1)}
                          disabled={isUpdating || line.quantity <= 1}
                          className="p-2 hover:bg-gray-100 rounded-l-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-bold">{line.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(line.id, line.quantity + 1)}
                          disabled={isUpdating}
                          className="p-2 hover:bg-gray-100 rounded-r-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(line.id)}
                        disabled={isUpdating}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove from cart"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900">
                      {formatPrice(line.linePriceWithTax, activeOrder.currencyCode)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatPrice(line.unitPriceWithTax, activeOrder.currencyCode)} each
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-bold">
                    {formatPrice(activeOrder.subTotalWithTax, activeOrder.currencyCode)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-bold">
                    {activeOrder.shippingWithTax > 0
                      ? formatPrice(activeOrder.shippingWithTax, activeOrder.currencyCode)
                      : "Calculated at checkout"}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-black text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(activeOrder.totalWithTax, activeOrder.currencyCode)}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-[#8B2323] text-white font-bold uppercase tracking-widest py-4 rounded-full text-center hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/"
                className="block w-full mt-4 text-center text-gray-600 hover:text-[#8B2323] font-bold text-sm transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
