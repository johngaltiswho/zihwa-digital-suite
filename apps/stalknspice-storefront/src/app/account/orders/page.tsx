"use client";

import { useAuth } from "@/lib/vendure/auth-context";
import { vendureClient } from "@/lib/vendure/client";
import { GET_ACTIVE_CUSTOMER_ORDERS } from "@/lib/vendure/queries/customer";
import type { Order } from "@/lib/vendure/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Package, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OrdersPage() {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;

      try {
        setOrdersLoading(true);
        const data = await vendureClient.request(GET_ACTIVE_CUSTOMER_ORDERS, {
          options: {
            sort: { orderPlacedAt: "DESC" },
          },
        });

        if (data.activeCustomer?.orders) {
          setOrders(data.activeCustomer.orders.items);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(price / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8B2323] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-[#8B2323] hover:text-black font-bold mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Account
          </Link>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">My Orders</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            View your order history
          </p>
        </div>

        {/* Loading State */}
        {ordersLoading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-[#8B2323] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-bold">Loading your orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && !ordersLoading && (
          <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-12 border border-gray-100 text-center">
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-block bg-[#8B2323] text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!ordersLoading && !error && orders.length === 0 && (
          <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-12 border border-gray-100 text-center">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">
              No Orders Yet
            </h2>
            <p className="text-gray-600 mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <Link
              href="/"
              className="inline-block bg-[#8B2323] text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!ordersLoading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 border border-gray-100 hover:shadow-2xl transition-shadow"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-black text-gray-900">
                        Order #{order.code}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getOrderStatusColor(
                          order.state
                        )}`}
                      >
                        {order.state}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(order.orderPlacedAt || order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[#8B2323]">
                      {formatPrice(order.totalWithTax, order.currencyCode)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.lines.reduce((sum, line) => sum + line.quantity, 0)} items
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.lines.slice(0, 3).map((line) => (
                    <div key={line.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                        {line.productVariant.product.featuredAsset && (
                          <Image
                            src={line.productVariant.product.featuredAsset.preview}
                            alt={line.productVariant.product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">
                          {line.productVariant.product.name}
                        </p>
                        <p className="text-sm text-gray-600">{line.productVariant.name}</p>
                        <p className="text-sm text-gray-500">Qty: {line.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {formatPrice(line.linePriceWithTax, order.currencyCode)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.lines.length > 3 && (
                    <p className="text-sm text-gray-600 italic">
                      +{order.lines.length - 3} more items
                    </p>
                  )}
                </div>

                {/* View Details Button */}
                <Link
                  href={`/account/orders/${order.code}`}
                  className="inline-flex items-center gap-2 bg-[#8B2323] text-white font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-black transition-all shadow-lg shadow-[#8B2323]/20"
                >
                  View Order Details
                  <ChevronRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
