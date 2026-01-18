"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/vendure/cart-context";
import { vendureClient } from "@/lib/vendure/client";
import { ADD_PAYMENT_TO_ORDER, TRANSITION_ORDER_TO_STATE } from "@/lib/vendure/mutations/checkout";
import Link from "next/link";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import Image from "next/image";

export default function PaymentPage() {
  const router = useRouter();
  const { activeOrder, itemCount, refreshCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handlePlaceOrder = async () => {
    if (!activeOrder) return;

    setLoading(true);
    setError(null);

    try {
      // First, transition order to ArrangingPayment state
      const transitionResponse = await vendureClient.request(TRANSITION_ORDER_TO_STATE, {
        state: "ArrangingPayment",
      });

      if (transitionResponse.transitionOrderToState.errorCode) {
        throw new Error(transitionResponse.transitionOrderToState.message);
      }

      // Add dummy payment
      const paymentResponse = await vendureClient.request(ADD_PAYMENT_TO_ORDER, {
        input: {
          method: "dummy-payment-method",
          metadata: {
            cardNumber: "****-****-****-1234",
            cardHolder: "Test Customer",
          },
        },
      });

      if (paymentResponse.addPaymentToOrder.errorCode) {
        throw new Error(paymentResponse.addPaymentToOrder.message);
      }

      // Order placed successfully
      const order = paymentResponse.addPaymentToOrder;

      // Refresh cart (should now be empty)
      await refreshCart();

      // Navigate to confirmation with order code
      router.push(`/checkout/confirmation?orderCode=${order.code}`);
    } catch (err: any) {
      console.error("Failed to place order:", err);
      setError(err.message || "Failed to place order. Please try again.");
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
            href="/checkout/shipping"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#8B2323] transition-colors font-medium mb-4"
          >
            <ArrowLeft size={18} />
            Back to Shipping Method
          </Link>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
            Payment
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
            Step 3 of 3: Review & Pay
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Summary */}
            {activeOrder.shippingAddress && (
              <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-4">
                  Shipping Address
                </h2>
                <div className="text-gray-700">
                  <p className="font-bold">{activeOrder.shippingAddress.fullName}</p>
                  <p>{activeOrder.shippingAddress.streetLine1}</p>
                  {activeOrder.shippingAddress.streetLine2 && (
                    <p>{activeOrder.shippingAddress.streetLine2}</p>
                  )}
                  <p>
                    {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.province}{" "}
                    {activeOrder.shippingAddress.postalCode}
                  </p>
                  <p>{activeOrder.shippingAddress.country}</p>
                  {activeOrder.shippingAddress.phoneNumber && (
                    <p className="mt-2">Phone: {activeOrder.shippingAddress.phoneNumber}</p>
                  )}
                </div>
              </div>
            )}

            {/* Shipping Method Summary */}
            {activeOrder.shippingLines && activeOrder.shippingLines.length > 0 && (
              <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-4">
                  Shipping Method
                </h2>
                <div className="text-gray-700">
                  <p className="font-bold">{activeOrder.shippingLines[0].shippingMethod.name}</p>
                  <p className="text-sm">
                    {formatPrice(activeOrder.shippingLines[0].priceWithTax, activeOrder.currencyCode)}
                  </p>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-6">
                Payment Method
              </h2>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 mb-6 border-2 border-yellow-200">
                <div className="flex items-start gap-3">
                  <Lock className="text-yellow-600 mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Test Mode - Dummy Payment</h3>
                    <p className="text-sm text-gray-700">
                      This is a test payment handler. In production, this will be replaced with a real
                      payment gateway (Stripe, Razorpay, etc.). Click "Place Order" below to complete
                      your test order.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dummy Payment Info Display */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="text-gray-600" size={24} />
                  <h3 className="font-bold text-gray-900">Dummy Payment Method</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Card: **** **** **** 1234</p>
                  <p>Card Holder: Test Customer</p>
                  <p className="text-green-600 font-bold mt-3">✓ Payment will be automatically approved</p>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-bold">{error}</p>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-8 bg-[#8B2323] text-white font-bold uppercase tracking-widest py-4 rounded-full hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Processing Order...</>
                ) : (
                  <>
                    <Lock size={20} />
                    Place Order - {formatPrice(activeOrder.totalWithTax, activeOrder.currencyCode)}
                  </>
                )}
              </button>
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
                  <div key={line.id} className="flex gap-3">
                    {line.productVariant.product.featuredAsset && (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={line.productVariant.product.featuredAsset.preview}
                          alt={line.productVariant.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 text-sm">
                      <p className="font-bold text-gray-900">{line.productVariant.product.name}</p>
                      <p className="text-gray-600">{line.productVariant.name}</p>
                      <p className="text-gray-500">Qty: {line.quantity}</p>
                      <p className="font-bold text-gray-900 mt-1">
                        {formatPrice(line.linePriceWithTax, activeOrder.currencyCode)}
                      </p>
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
                    {formatPrice(activeOrder.shippingWithTax, activeOrder.currencyCode)}
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
