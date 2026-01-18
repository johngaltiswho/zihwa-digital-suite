"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/vendure/cart-context";
import { vendureClient } from "@/lib/vendure/client";
import { GET_ELIGIBLE_SHIPPING_METHODS, SET_ORDER_SHIPPING_METHOD } from "@/lib/vendure/mutations/checkout";
import type { ShippingMethod } from "@/lib/vendure/types";
import Link from "next/link";
import { ArrowLeft, Truck, CheckCircle } from "lucide-react";

export default function ShippingMethodPage() {
  const router = useRouter();
  const { activeOrder, itemCount, refreshCart } = useCart();
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch shipping methods
  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        setLoading(true);
        const data = await vendureClient.request(GET_ELIGIBLE_SHIPPING_METHODS);

        if (data.eligibleShippingMethods && data.eligibleShippingMethods.length > 0) {
          setShippingMethods(data.eligibleShippingMethods);
          // Auto-select first method
          setSelectedMethodId(data.eligibleShippingMethods[0].id);
        } else {
          setError("No shipping methods available for your location.");
        }
      } catch (err) {
        console.error("Failed to fetch shipping methods:", err);
        setError("Failed to load shipping methods. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchShippingMethods();
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (!activeOrder || itemCount === 0) {
      router.push("/cart");
    }
  }, [activeOrder, itemCount, router]);

  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(price / 100);
  };

  const handleContinue = async () => {
    if (!selectedMethodId) {
      alert("Please select a shipping method");
      return;
    }

    setSubmitting(true);
    try {
      const response = await vendureClient.request(SET_ORDER_SHIPPING_METHOD, {
        shippingMethodId: [selectedMethodId],
      });

      if (response.setOrderShippingMethod.errorCode) {
        throw new Error(response.setOrderShippingMethod.message);
      }

      // Refresh cart to get updated totals
      await refreshCart();

      // Navigate to payment
      router.push("/checkout/payment");
    } catch (error) {
      console.error("Failed to set shipping method:", error);
      alert("Failed to select shipping method. Please try again.");
    } finally {
      setSubmitting(false);
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
            href="/checkout"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#8B2323] transition-colors font-medium mb-4"
          >
            <ArrowLeft size={18} />
            Back to Shipping Address
          </Link>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
            Shipping Method
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
            Step 2 of 3: Select Shipping
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Shipping Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-6">
                Select Shipping Method
              </h2>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Loading shipping options...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {shippingMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethodId(method.id)}
                      className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                        selectedMethodId === method.id
                          ? "border-[#8B2323] bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedMethodId === method.id
                                ? "border-[#8B2323] bg-[#8B2323]"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedMethodId === method.id && (
                              <CheckCircle className="text-white" size={12} />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Truck
                                className={
                                  selectedMethodId === method.id ? "text-[#8B2323]" : "text-gray-500"
                                }
                                size={20}
                              />
                              <h3 className="text-lg font-bold text-gray-900">{method.name}</h3>
                            </div>
                            {method.description && (
                              <p className="text-sm text-gray-600">{method.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-gray-900">
                            {method.priceWithTax === 0
                              ? "FREE"
                              : formatPrice(method.priceWithTax, activeOrder.currencyCode)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!loading && !error && (
                <button
                  onClick={handleContinue}
                  disabled={submitting || !selectedMethodId}
                  className="w-full mt-8 bg-[#8B2323] text-white font-bold uppercase tracking-widest py-4 rounded-full hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Processing..." : "Continue to Payment"}
                </button>
              )}
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
                      : selectedMethodId
                      ? "FREE"
                      : "TBD"}
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
