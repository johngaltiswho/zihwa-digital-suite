"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { vendureClient } from "@/lib/vendure/client";
import { GET_ORDER_BY_CODE } from "@/lib/vendure/mutations/checkout";
import type { Order } from "@/lib/vendure/types";
import Link from "next/link";
import { CheckCircle, Package, Home, User } from "lucide-react";
import Image from "next/image";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderCode) {
        setError("No order code provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await vendureClient.request(GET_ORDER_BY_CODE, { code: orderCode });

        if (!data.orderByCode) {
          setError("Order not found");
          return;
        }

        setOrder(data.orderByCode);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderCode]);

  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(price / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-gray-600 text-xl">Loading order details...</p>
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-red-600 text-xl mb-6">{error || "Order not found"}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#8B2323] text-white font-bold px-6 py-3 rounded-full hover:bg-black transition-all"
          >
            <Home size={20} />
            Return to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-12 border border-gray-100 text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Thank you for your order. We've received your order and will begin processing it shortly.
          </p>
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to your email address.
          </p>

          <div className="mt-8 p-6 bg-gray-50 rounded-xl inline-block">
            <p className="text-sm text-gray-600 mb-2">Order Number</p>
            <p className="text-2xl font-black text-[#8B2323]">{order.code}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 border border-gray-100 mb-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-6">
            Order Details
          </h2>

          {/* Order Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                Shipping Address
              </h3>
              {order.shippingAddress && (
                <div className="text-gray-700">
                  <p className="font-bold">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.streetLine1}</p>
                  {order.shippingAddress.streetLine2 && <p>{order.shippingAddress.streetLine2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phoneNumber && (
                    <p className="mt-2">Phone: {order.shippingAddress.phoneNumber}</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                Order Information
              </h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Order Date:</span>
                  <span className="font-bold">
                    {order.orderPlacedAt
                      ? formatDate(order.orderPlacedAt)
                      : formatDate(order.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Order Status:</span>
                  <span className="font-bold text-green-600">{order.state}</span>
                </div>
                {order.shippingLines && order.shippingLines.length > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping Method:</span>
                    <span className="font-bold">{order.shippingLines[0].shippingMethod.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter mb-4">
            Items Ordered
          </h3>
          <div className="space-y-4 mb-8">
            {order.lines.map((line) => (
              <div key={line.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                {line.productVariant.product.featuredAsset && (
                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={line.productVariant.product.featuredAsset.preview}
                      alt={line.productVariant.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{line.productVariant.product.name}</p>
                  <p className="text-sm text-gray-600">{line.productVariant.name}</p>
                  <p className="text-sm text-gray-500">SKU: {line.productVariant.sku}</p>
                  <p className="text-sm text-gray-600 mt-1">Quantity: {line.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {formatPrice(line.linePriceWithTax, order.currencyCode)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatPrice(line.unitPriceWithTax, order.currencyCode)} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6">
            <div className="max-w-md ml-auto space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-bold">
                  {formatPrice(order.subTotalWithTax, order.currencyCode)}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="font-bold">
                  {formatPrice(order.shippingWithTax, order.currencyCode)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-xl font-black text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(order.totalWithTax, order.currencyCode)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center gap-2 bg-[#8B2323] text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20"
          >
            <User size={20} />
            View All Orders
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:border-[#8B2323] hover:text-[#8B2323] transition-all"
          >
            <Home size={20} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
