"use client";

import { useAuth } from "@/lib/vendure/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

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

        {/* Empty State - Will be replaced with real orders in Phase 4 */}
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
      </div>
    </section>
  );
}
