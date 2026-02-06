"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/vendure/auth-context";
import { vendureClient } from "@/lib/vendure/client";
import { GET_ORDER_BY_CODE } from "@/lib/vendure/queries/customer";
import type { Order } from "@/lib/vendure/types";
import Link from "next/link";
import { ArrowLeft, Package, CheckCircle, Truck } from "lucide-react";
import Image from "next/image";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const orderCode = params.code as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderCode || !isAuthenticated) return;

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
  }, [orderCode, isAuthenticated]);

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

  const getOrderStatusColor = (state: string) => {
    const statusColors: Record<string, string> = {
      PaymentSettled: "bg-green-100 text-green-800",
      Delivered: "bg-green-100 text-green-800",
      Shipped: "bg-blue-100 text-blue-800",
      PartiallyShipped: "bg-blue-100 text-blue-800",
      Cancelled: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-800",
      ArrangingPayment: "bg-yellow-100 text-yellow-800",
    };
    return statusColors[state] || "bg-gray-100 text-gray-800";
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8B2323] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <section className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-red-600 text-xl mb-6">{error || "Order not found"}</p>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 bg-[#8B2323] text-white font-bold px-6 py-3 rounded-full hover:bg-black transition-all"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-[#8B2323] hover:text-black font-bold mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to All Orders
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">
                Order #{order.code}
              </h1>
              <p className="text-gray-600">
                Placed on {formatDate(order.orderPlacedAt || order.createdAt)}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold ${getOrderStatusColor(
                order.state
              )}`}
            >
              {order.state}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-6 flex items-center gap-3">
                <Package size={24} />
                Order Items
              </h2>

              <div className="space-y-4">
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
                      <Link
                        href={`/product/${line.productVariant.product.slug}`}
                        className="font-bold text-gray-900 hover:text-[#8B2323] transition-colors"
                      >
                        {line.productVariant.product.name}
                      </Link>
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
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-6 flex items-center gap-3">
                  <Truck size={24} />
                  Shipping Address
                </h2>
                <div className="text-gray-700">
                  <p className="font-bold">{order.shippingAddress.fullName}</p>
                  {order.shippingAddress.company && <p>{order.shippingAddress.company}</p>}
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
              </div>
            )}

            {/* Payment Information */}
            {order.payments && order.payments.length > 0 && (
              <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-6 flex items-center gap-3">
                  <CheckCircle size={24} />
                  Payment Information
                </h2>
                <div className="space-y-3">
                  {order.payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900">{payment.method}</p>
                        <p className="text-sm text-gray-600">
                          Status: <span className="font-medium">{payment.state}</span>
                        </p>
                        {payment.transactionId && (
                          <p className="text-sm text-gray-500">
                            Transaction ID: {payment.transactionId}
                          </p>
                        )}
                      </div>
                      <p className="font-bold text-gray-900">
                        {formatPrice(payment.amount, order.currencyCode)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-bold">
                    {formatPrice(order.subTotalWithTax, order.currencyCode)}
                  </span>
                </div>
                {order.shippingWithTax > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-bold">
                      {formatPrice(order.shippingWithTax, order.currencyCode)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-black text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(order.totalWithTax, order.currencyCode)}</span>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="border-t border-gray-200 pt-6 space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Order Number</p>
                  <p className="font-bold text-gray-900">{order.code}</p>
                </div>
                <div>
                  <p className="text-gray-600">Order Date</p>
                  <p className="font-bold text-gray-900">
                    {formatDate(order.orderPlacedAt || order.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Total Items</p>
                  <p className="font-bold text-gray-900">
                    {order.lines.reduce((sum, line) => sum + line.quantity, 0)} items
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link
                  href="/account/orders"
                  className="block w-full text-center bg-gray-100 text-gray-700 font-bold uppercase tracking-widest py-3 rounded-full hover:bg-gray-200 transition-all"
                >
                  View All Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
