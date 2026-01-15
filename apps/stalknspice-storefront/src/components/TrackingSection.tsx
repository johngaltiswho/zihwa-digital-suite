"use client";
import React from "react";
import { Package, Truck, Search } from "lucide-react";

export default function TrackingSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-6 py-10 font-sans text-center">
      {/* 1. Header Section */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 uppercase tracking-tight">
          Track My <span className="text-[#8B2323]">Order</span>
        </h1>
        <p className="max-w-3xl mx-auto text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
          We understand that once you place an order with us, you expect the products to reach you without any delay and damage. 
          Through our extended delivery network we are looking to achieve just that. 
          Please enter your tracking ID below to check the delivery status of your order!
        </p>
      </div>

      {/* 2. Tracking Form */}
      <div className="max-w-4xl mx-auto mb-20">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Enter your Tracking ID here..." 
            className="w-full bg-white border border-gray-100 rounded-full px-10 py-6 text-sm shadow-xl shadow-gray-200 outline-none focus:ring-2 focus:ring-[#8B2323]/10 transition-all font-bold text-gray-800 placeholder-gray-300"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-50 p-3 rounded-full text-gray-300">
             <Search size={18} />
          </div>
        </div>

        <button className="mt-10 bg-[#8B2323] hover:bg-black text-white font-bold uppercase tracking-[0.2em] px-16 py-4 rounded-full transition-all shadow-xl shadow-[#8B2323]/20 active:scale-[0.98]">
          Track Your Order
        </button>
      </div>

      {/* 3. Info Steps */}
      <div className="grid md:grid-cols-3 gap-12 mt-12 border-t border-gray-50 pt-10">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center text-[#8B2323] mb-6">
            <Package size={30} />
          </div>
          <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-2">Order Packed</h3>
          <p className="text-sm text-gray-400 font-medium">Carefully handled by our gourmet experts.</p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center text-[#8B2323] mb-6">
            <Truck size={30} />
          </div>
          <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-2">On The Way</h3>
          <p className="text-sm text-gray-400 font-medium">Fast and secure delivery to your doorstep.</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center text-[#8B2323] mb-6">
            <Search size={30} />
          </div>
          <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-2">Real-time Updates</h3>
          <p className="text-sm text-gray-400 font-medium">Stay informed about your order's journey.</p>
        </div>
      </div>
    </section>
  );
}