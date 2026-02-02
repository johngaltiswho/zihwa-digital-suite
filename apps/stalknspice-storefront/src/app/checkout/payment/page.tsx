"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/vendure/cart-context";
import { vendureClient } from "@/lib/vendure/client";
import { ADD_PAYMENT_TO_ORDER, TRANSITION_ORDER_TO_STATE } from "@/lib/vendure/mutations/checkout";
import { CREATE_RAZORPAY_ORDER } from "@/lib/vendure/mutations/razorpay";
import { loadRazorpayScript, openRazorpayCheckout, RazorpayResponse } from "@/lib/vendure/razorpay";
import Link from "next/link";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import Image from "next/image";

type PaymentMethod = 'razorpay' | 'dummy';

export default function PaymentPage() {
  const router = useRouter();
  const { activeOrder, itemCount, refreshCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    loadRazorpayScript().then((loaded) => {
      setRazorpayLoaded(loaded);
      if (!loaded) {
        console.error('Failed to load Razorpay script');
      }
    });
  }, []);

  // Redirect if cart is empty or order not ready for payment
  useEffect(() => {
    if (!activeOrder || itemCount === 0) {
      router.push("/cart");
    } else if (!activeOrder.shippingAddress || !activeOrder.shippingLines || activeOrder.shippingLines.length === 0) {
      // Order doesn't have shipping set up yet, redirect back
      router.push("/checkout");
    } else if (activeOrder.state === "PaymentSettled" || activeOrder.state === "PaymentAuthorized") {
      // Order already paid, redirect to cart
      router.push("/cart");
    }
  }, [activeOrder, itemCount, router]);

  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(price / 100);
  };

  const handleRazorpayPayment = async () => {
    if (!activeOrder || !razorpayLoaded) return;

    setLoading(true);
    setError(null);

    try {
      // Transition order to ArrangingPayment state
      const transitionResponse = await vendureClient.request(TRANSITION_ORDER_TO_STATE, {
        state: "ArrangingPayment",
      });

      if (transitionResponse.transitionOrderToState.errorCode) {
        throw new Error(transitionResponse.transitionOrderToState.message);
      }

      // Create Razorpay order
      const razorpayOrderResponse = await vendureClient.request(CREATE_RAZORPAY_ORDER, {
        amount: activeOrder.totalWithTax, // Amount in smallest unit (paise)
      });

      const { id, amount, currency, keyId } = razorpayOrderResponse.createRazorpayOrder;

      // Open Razorpay checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Stalks N Spice",
        description: `Order ${activeOrder.code}`,
        order_id: id,
        handler: async (response: RazorpayResponse) => {
          try {
            // Add payment to order with Razorpay details
            const paymentResponse = await vendureClient.request(ADD_PAYMENT_TO_ORDER, {
              input: {
                method: "razorpay-payment-handler",
                metadata: {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
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

            // Navigate to confirmation
            router.push(`/checkout/confirmation?orderCode=${order.code}`);
          } catch (err: any) {
            console.error("Failed to complete payment:", err);
            setError(err.message || "Payment processing failed");
            setLoading(false);
          }
        },
        prefill: {
          name: activeOrder.shippingAddress?.fullName || "",
          email: activeOrder.customer?.emailAddress || "",
          contact: activeOrder.shippingAddress?.phoneNumber || "",
        },
        theme: {
          color: "#8B2323",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment cancelled");
          },
        },
      };

      openRazorpayCheckout(options);
    } catch (err: any) {
      console.error("Failed to initiate Razorpay payment:", err);
      setError(err.message || "Failed to initiate payment. Please try again.");
      setLoading(false);
    }
  };

  const handleDummyPayment = async () => {
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

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else {
      await handleDummyPayment();
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

              {/* Payment Method Selection */}
              <div className="space-y-4 mb-6">
                {/* Razorpay Option */}
                <label
                  className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#8B2323] bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard size={20} className="text-[#8B2323]" />
                        <h3 className="font-bold text-gray-900">Razorpay</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay securely with Credit/Debit Card, UPI, Net Banking, or Wallet
                      </p>
                      {!razorpayLoaded && (
                        <p className="text-xs text-yellow-600 mt-2">⚠️ Loading Razorpay...</p>
                      )}
                    </div>
                  </div>
                </label>

                {/* Dummy Payment Option (Test Mode) */}
                <label
                  className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'dummy'
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="dummy"
                      checked={paymentMethod === 'dummy'}
                      onChange={() => setPaymentMethod('dummy')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Lock size={20} className="text-yellow-600" />
                        <h3 className="font-bold text-gray-900">Test Payment (Dummy)</h3>
                        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-bold">
                          TEST MODE
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        For testing only - Payment will be automatically approved
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-bold">{error}</p>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading || (paymentMethod === 'razorpay' && !razorpayLoaded)}
                className="w-full mt-8 bg-[#8B2323] text-white font-bold uppercase tracking-widest py-4 rounded-full hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Processing Order...</>
                ) : (
                  <>
                    <Lock size={20} />
                    {paymentMethod === 'razorpay' ? 'Pay with Razorpay' : 'Place Test Order'} - {formatPrice(activeOrder.totalWithTax, activeOrder.currencyCode)}
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
