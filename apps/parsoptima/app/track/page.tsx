"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link"; // Added missing import
import { 
  Search, Truck, Package, CheckCircle2, 
  HelpCircle, ArrowRight, FileText // Added missing FileText import
} from "lucide-react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => setIsSearching(false), 1500);
  };

  return (
    <main className="min-h-screen bg-[#fcfdfe] font-sans pb-20">
      {/* 
         NOTE: ParsOptimaHeader and ParsOptimaFooter are removed from here 
         because they are already provided by your RootLayout.
      */}

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl lg:text-5xl font-black text-[#1a3a5a] uppercase tracking-tight">Track Your Medicine</h1>
            <p className="text-slate-500 max-w-lg mx-auto font-sm">Enter your Order ID and Phone Number to get real-time updates.</p>
          </div>

          {/* TRACKING FORM */}
          <div className="bg-white p-8 lg:p-8 rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100 mb-12">
            <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Order ID</label>
                <input 
                  type="text" 
                  placeholder="PO-123456" 
                  className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#00a651]/20 transition-all font-semibold text-sm"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </div>
              <div className="md:col-span-1 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+91 00000 00000" 
                  className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[#00a651]/20 transition-all font-semibold text-sm"
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <button 
                  disabled={isSearching}
                  className="w-full h-14 bg-[#00a651] hover:bg-[#008c44] text-white rounded-2xl font-bold uppercase text-xs transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-600/20"
                >
                  {isSearching ? "Searching..." : <><Search size={18}/> Track Now</>}
                </button>
              </div>
            </form>
          </div>

          {/* VISUAL TRACKER PREVIEW */}
          <div className="bg-white p-4 rounded-[40px] border border-slate-100 opacity-40 grayscale pointer-events-none">
            <h3 className="text-sm font-bold text-[#1a3a5a] uppercase tracking-widest mb-8 text-center">Live Status Preview</h3>
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
               <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 hidden md:block" />
               
               {[
                 { label: "Order Placed", icon: <FileText size={20}/>, active: true },
                 { label: "Quality Check", icon: <CheckCircle2 size={20}/>, active: true },
                 { label: "In Transit", icon: <Truck size={20}/>, active: false },
                 { label: "Delivered", icon: <Package size={20}/>, active: false },
               ].map((step, i) => (
                 <div key={i} className="relative z-10 flex flex-row md:flex-col items-center gap-4 bg-white pr-4">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${step.active ? "bg-[#00a651] text-white shadow-lg shadow-green-600/20" : "bg-slate-100 text-slate-300"}`}>
                     {step.icon}
                   </div>
                   <span className={`text-[11px] font-black uppercase tracking-widest ${step.active ? "text-[#1a3a5a]" : "text-slate-300"}`}>{step.label}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="mt-16 flex flex-col md:flex-row justify-center items-center gap-8 text-slate-400">
             <div className="flex items-center gap-3 text-sm font-bold">
                <HelpCircle size={20} className="text-[#00a651]"/> Need help? Call +91-9972508616
             </div>
             <Link href="/contact" className="text-xs font-black uppercase text-[#1a3a5a] border-b-2 border-[#1a3a5a] pb-1 flex items-center gap-2">
                Contact Support <ArrowRight size={14}/>
             </Link>
          </div>
        </div>
      </section>
    </main>
  );
}