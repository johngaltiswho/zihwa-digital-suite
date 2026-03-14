"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/vendure/cart-context";
import { vendureClient } from "@/lib/vendure/client";
import { ADD_PAYMENT_TO_ORDER, GET_ORDER_BY_CODE, TRANSITION_ORDER_TO_STATE } from "@/lib/vendure/mutations/checkout";
import { CREATE_RAZORPAY_ORDER } from "@/lib/vendure/mutations/razorpay";
import { loadRazorpayScript, openRazorpayCheckout, RazorpayResponse } from "@/lib/vendure/razorpay";
import { GET_ELIGIBLE_PAYMENT_METHODS } from "@/lib/vendure/queries/cart";
import Link from "next/link";
import { ArrowLeft, CreditCard, Loader2, Lock } from "lucide-react";
import Image from "next/image";

type PaymentMethod = 'razorpay';

function getAddPaymentErrorMessage(result: any): string {
  if (!result) {
    return "Payment failed: empty response from server";
  }

  const typeName = result.__typename as string | undefined;
  if (typeName === "Order") {
    return "";
  }

  if (result.paymentErrorMessage) {
    return String(result.paymentErrorMessage);
  }
  if (result.eligibilityCheckerMessage) {
    return String(result.eligibilityCheckerMessage);
  }
  if (result.message) {
    return String(result.message);
  }

  return typeName
    ? `Payment failed (${typeName}).`
    : "Payment failed for an unknown reason.";
}

export default function PaymentPage() {
  const router = useRouter();
  const { activeOrder, itemCount, isLoading: isCartLoading } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [isCompletingOrder, setIsCompletingOrder] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    loadRazorpayScript().then((loaded) => {
      setRazorpayLoaded(loaded);
      if (!loaded) {
        console.error('Failed to load Razorpay script');
      }
    });
  }, []);

  // Dev-time diagnostic: surface payment method/channel configuration early.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const data = await vendureClient.request(GET_ELIGIBLE_PAYMENT_METHODS);
        if (!mounted) return;

        const methods = data?.eligiblePaymentMethods ?? [];
        const channelToken =
          typeof window !== "undefined"
            ? localStorage.getItem("vendure-selected-channel-token") ??
              localStorage.getItem("vendure-channel-token") ??
              "__default_channel__"
            : "__default_channel__";

        console.info("[Checkout][Payment] Eligible payment methods", {
          channelToken,
          methods: methods.map((m: any) => ({
            id: m?.id,
            code: m?.code,
            name: m?.name,
            isEligible: m?.isEligible,
            eligibilityMessage: m?.eligibilityMessage,
          })),
        });
      } catch (e) {
        console.warn("[Checkout][Payment] Failed to load eligible payment methods", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Redirect if cart is empty or order not ready for payment
  useEffect(() => {
    if (isCompletingOrder) {
      return;
    }

    if (isCartLoading) {
      return;
    }

    if (!activeOrder || itemCount === 0) {
      router.push("/cart");
    } else if (!activeOrder.shippingAddress || !activeOrder.shippingLines || activeOrder.shippingLines.length === 0) {
      // Order doesn't have shipping set up yet, redirect back
      router.push("/checkout");
    } else if (activeOrder.state === "PaymentSettled" || activeOrder.state === "PaymentAuthorized") {
      // Order already paid, redirect to cart
      router.push("/cart");
    }
  }, [activeOrder, itemCount, isCartLoading, isCompletingOrder, router]);

  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(price / 100);
  };

  const ensureArrangingPayment = async () => {
    if (!activeOrder) return;

    // Avoid invalid self-transition when user retries payment on same order.
    if (activeOrder.state === "ArrangingPayment") {
      return;
    }

    const transitionResponse = await vendureClient.request(TRANSITION_ORDER_TO_STATE, {
      state: "ArrangingPayment",
    });

    const result = transitionResponse.transitionOrderToState;
    if (result?.errorCode) {
      const transitionErrorText = `${result?.transitionError ?? ""} ${result?.message ?? ""}`;
      const isAlreadyArrangingPayment =
        result?.fromState === "ArrangingPayment" ||
        transitionErrorText.includes('ArrangingPayment" to "ArrangingPayment');
      if (isAlreadyArrangingPayment) {
        return;
      }
      const message = result?.message || "Failed to transition order to payment state";
      throw new Error(message);
    }
  };

  const resolvePaymentMethodCode = async (preferred: PaymentMethod): Promise<string> => {
    const data = await vendureClient.request(GET_ELIGIBLE_PAYMENT_METHODS);
    const methods = (data?.eligiblePaymentMethods ?? []).filter((m: any) => m?.isEligible !== false);

    if (methods.length === 0) {
      throw new Error("No eligible payment methods available for this order.");
    }

    if (preferred === "razorpay") {
      const razorpayMethod = methods.find((m: any) => {
        const code = String(m?.code ?? "").toLowerCase();
        const name = String(m?.name ?? "").toLowerCase();
        const desc = String(m?.description ?? "").toLowerCase();
        return code.includes("razorpay") || name.includes("razorpay") || desc.includes("razorpay");
      });
      if (razorpayMethod?.code) {
        return razorpayMethod.code;
      }
      const availableCodes = methods.map((m: any) => m.code).filter(Boolean).join(", ");
      throw new Error(
        `Razorpay payment method is not eligible for this channel/order. Available methods: ${availableCodes || "none"}`
      );
    }

    if (preferred === "dummy") {
      const dummyMethod = methods.find((m: any) => {
        const code = String(m?.code ?? "").toLowerCase();
        const name = String(m?.name ?? "").toLowerCase();
        const desc = String(m?.description ?? "").toLowerCase();
        return code.includes("dummy") || name.includes("dummy") || desc.includes("dummy");
      });
      if (dummyMethod?.code) {
        return dummyMethod.code;
      }
    }

    // Final fallback: use first eligible method, but surface what was selected.
    return methods[0].code;
  };

  const handleRazorpayPayment = async () => {
    if (!activeOrder || !razorpayLoaded) return;
    const orderCode = activeOrder.code;

    setLoading(true);
    setError(null);

    try {
      await ensureArrangingPayment();

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
            setIsCompletingOrder(true);
            const paymentMethodCode = await resolvePaymentMethodCode("razorpay");

            // Add payment to order with Razorpay details
            const paymentResponse = await vendureClient.request(ADD_PAYMENT_TO_ORDER, {
              input: {
                method: paymentMethodCode,
                metadata: {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                },
              },
            });

            const addPaymentResult = paymentResponse.addPaymentToOrder;
            console.info("addPaymentToOrder response:", paymentResponse);
            if (addPaymentResult?.__typename !== "Order") {
              console.error("addPaymentToOrder returned non-Order result:", addPaymentResult);
              // Defensive fallback: in some edge cases we get an empty object back.
              // Verify the order status before failing the UX.
              const isEmptyObject =
                addPaymentResult &&
                typeof addPaymentResult === "object" &&
                Object.keys(addPaymentResult).length === 0;

              if (isEmptyObject) {
                try {
                  const verify = await vendureClient.request(GET_ORDER_BY_CODE, { code: orderCode });
                  const placedOrder = verify?.orderByCode;
                  const looksPaid =
                    placedOrder &&
                    (placedOrder.state === "PaymentSettled" ||
                      placedOrder.state === "PaymentAuthorized" ||
                      placedOrder.active === false);
                  if (looksPaid) {
                    router.push(`/checkout/confirmation?orderCode=${placedOrder.code}`);
                    return;
                  }
                } catch (verifyError) {
                  console.error("Failed to verify placed order after empty addPaymentToOrder response:", verifyError);
                }
              }

              throw new Error(getAddPaymentErrorMessage(addPaymentResult));
            }

            // Order placed successfully
            const order = addPaymentResult;

            // Navigate to confirmation
            router.push(`/checkout/confirmation?orderCode=${order.code}`);
          } catch (err: any) {
            console.error("Failed to complete payment:", err);
            setError(err.message || "Payment processing failed");
            setIsCompletingOrder(false);
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
    const orderCode = activeOrder.code;

    setLoading(true);
    setError(null);

    try {
      setIsCompletingOrder(true);
      await ensureArrangingPayment();
      const paymentMethodCode = await resolvePaymentMethodCode("dummy");

      // Add dummy payment
      const paymentResponse = await vendureClient.request(ADD_PAYMENT_TO_ORDER, {
        input: {
          method: paymentMethodCode,
          metadata: {
            cardNumber: "****-****-****-1234",
            cardHolder: "Test Customer",
          },
        },
      });

      const addPaymentResult = paymentResponse.addPaymentToOrder;
      console.info("addPaymentToOrder response:", paymentResponse);
      if (addPaymentResult?.__typename !== "Order") {
        console.error("addPaymentToOrder returned non-Order result:", addPaymentResult);
        throw new Error(getAddPaymentErrorMessage(addPaymentResult));
      }

      // Order placed successfully
      const order = addPaymentResult;

      // Navigate to confirmation with order code
      router.push(`/checkout/confirmation?orderCode=${order.code}`);
    } catch (err: any) {
      console.error("Failed to place order:", err);
      // Safety fallback in case order actually got placed but mutation returned an
      // empty/non-order shape.
      try {
        const verify = await vendureClient.request(GET_ORDER_BY_CODE, { code: orderCode });
        const placedOrder = verify?.orderByCode;
        const looksPaid =
          placedOrder &&
          (placedOrder.state === "PaymentSettled" ||
            placedOrder.state === "PaymentAuthorized" ||
            placedOrder.active === false);
        if (looksPaid) {
          router.push(`/checkout/confirmation?orderCode=${placedOrder.code}`);
          return;
        }
      } catch (verifyError) {
        console.error("Failed to verify order after dummy payment error:", verifyError);
      }
      setError(err.message || "Failed to place order. Please try again.");
      setIsCompletingOrder(false);
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

  if (isCartLoading) {
    return null;
  }

  if (!activeOrder || itemCount === 0) {
    return null; // Will redirect
  }

  return (
    <section className="min-h-screen bg-gray-50 py-4 px-4 relative">
      {isCompletingOrder && (
        <div className="fixed inset-0 z-[300] bg-white/85 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-2xl p-8 text-center">
            <Loader2 className="w-10 h-10 text-[#8B2323] animate-spin mx-auto mb-4" />
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">
              Confirming Payment
            </h3>
            <p className="text-gray-600">
              Please wait while we verify your payment and finalize your order.
            </p>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <Link
            href="/checkout/shipping"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#8B2323] transition-colors font-medium mb-2"
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
