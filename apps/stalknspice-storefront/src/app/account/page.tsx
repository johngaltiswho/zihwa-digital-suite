"use client";

import { useAuth } from "@/lib/vendure/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, Mail, Phone, LogOut, Package, Settings } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const { customer, isLoading, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8B2323] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null; // Will redirect via useEffect
  }

  return (
    <section className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">
                Welcome Back, {customer.firstName}!
              </h1>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">
                Manage your account & orders
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-[#8B2323] hover:text-white text-gray-700 font-bold uppercase tracking-widest rounded-full transition-all text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Account Info Card */}
        <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 mb-6 border border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-6">
            Account Information
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <User className="text-[#8B2323]" size={24} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</p>
                <p className="text-lg font-bold text-gray-900">
                  {customer.title && `${customer.title} `}
                  {customer.firstName} {customer.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <Mail className="text-[#8B2323]" size={24} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</p>
                <p className="text-lg font-bold text-gray-900">{customer.emailAddress}</p>
              </div>
            </div>

            {customer.phoneNumber && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <Phone className="text-[#8B2323]" size={24} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</p>
                  <p className="text-lg font-bold text-gray-900">{customer.phoneNumber}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Orders */}
          <Link href="/account/orders">
            <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 border border-gray-100 hover:border-[#8B2323] transition-all cursor-pointer group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-[#8B2323] transition-all">
                  <Package className="text-[#8B2323] group-hover:text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">My Orders</h3>
                  <p className="text-gray-400 text-sm font-bold">View order history</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">Track and manage your orders</p>
            </div>
          </Link>

          {/* Profile Settings */}
          <Link href="/account/profile">
            <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 border border-gray-100 hover:border-[#8B2323] transition-all cursor-pointer group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-[#8B2323] transition-all">
                  <Settings className="text-[#8B2323] group-hover:text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Profile</h3>
                  <p className="text-gray-400 text-sm font-bold">Edit your information</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">Update your profile and contact details</p>
            </div>
          </Link>
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block bg-[#8B2323] text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
