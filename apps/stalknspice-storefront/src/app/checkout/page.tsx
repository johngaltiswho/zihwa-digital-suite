"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/vendure/cart-context";
import { useAuth } from "@/lib/vendure/auth-context";
import { vendureClient } from "@/lib/vendure/client";
import { SET_ORDER_SHIPPING_ADDRESS } from "@/lib/vendure/mutations/checkout";
import type { CreateAddressInput } from "@/lib/vendure/types";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { activeOrder, itemCount } = useCart();
  const { customer, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  // Redirect if cart is empty or order already processed
  useEffect(() => {
    if (!activeOrder || itemCount === 0) {
      router.push("/cart");
    } else if (activeOrder.state !== "AddingItems") {
      // Order already has shipping/payment, redirect to cart
      router.push("/cart");
    }
  }, [activeOrder, itemCount, router]);

  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(price / 100);
  };

  const [shippingAddress, setShippingAddress] = useState({
    fullName: customer?.firstName && customer?.lastName
      ? `${customer.firstName} ${customer.lastName}`
      : "",
    streetLine1: "",
    streetLine2: "",
    city: "",
    province: "",
    postalCode: "",
    countryCode: "IN",
    phoneNumber: customer?.phoneNumber || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare address input
      const addressInput: CreateAddressInput = {
        fullName: shippingAddress.fullName,
        streetLine1: shippingAddress.streetLine1,
        streetLine2: shippingAddress.streetLine2,
        city: shippingAddress.city,
        province: shippingAddress.province,
        postalCode: shippingAddress.postalCode,
        countryCode: shippingAddress.countryCode,
        phoneNumber: shippingAddress.phoneNumber,
      };

      // Set shipping address
      const response = await vendureClient.request(SET_ORDER_SHIPPING_ADDRESS, {
        input: addressInput,
      });

      if (response.setOrderShippingAddress.errorCode) {
        throw new Error(response.setOrderShippingAddress.message);
      }

      // Navigate to shipping method selection
      router.push("/checkout/shipping");
    } catch (error) {
      console.error("Failed to set shipping address:", error);
      alert("Failed to save shipping address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!activeOrder || itemCount === 0) {
    return null; // Will redirect
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#8B2323] transition-colors font-medium mb-4"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </Link>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
            Checkout
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
            Step 1 of 3: Shipping Address
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Shipping Address Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-6">
                Shipping Address
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B2323] transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={shippingAddress.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B2323] transition-colors"
                  />
                </div>

                {/* Street Address Line 1 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="streetLine1"
                    value={shippingAddress.streetLine1}
                    onChange={handleInputChange}
                    required
                    placeholder="House number, street name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B2323] transition-colors"
                  />
                </div>

                {/* Street Address Line 2 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Apartment, suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    name="streetLine2"
                    value={shippingAddress.streetLine2}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B2323] transition-colors"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B2323] transition-colors"
                  />
                </div>

                {/* State/Province and Postal Code */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={shippingAddress.province}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B2323] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B2323] transition-colors"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    name="countryCode"
                    value={shippingAddress.countryCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B2323] transition-colors"
                  >
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    {/* Add more countries as needed */}
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8B2323] text-white font-bold uppercase tracking-widest py-4 rounded-full hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Continue to Shipping Method"}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {activeOrder.lines.map((line) => (
                  <div key={line.id} className="flex gap-3 text-sm">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{line.productVariant.product.name}</p>
                      <p className="text-gray-600">{line.productVariant.name}</p>
                      <p className="text-gray-500">Qty: {line.quantity}</p>
                    </div>
                    <div className="font-bold text-gray-900">
                      {formatPrice(line.linePriceWithTax, activeOrder.currencyCode)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
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
                      : "Calculated at next step"}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-black text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(activeOrder.totalWithTax, activeOrder.currencyCode)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
