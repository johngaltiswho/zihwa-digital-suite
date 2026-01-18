"use client";
import React from "react";
import { PackageCheck, RefreshCcw, ShieldAlert } from "lucide-react";

export default function ReturnMeds() {
  return (
    <div className="bg-white min-h-screen pt-12 pb-12 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-black text-[#1a3a5a] tracking-tighter uppercase leading-none mb-8">
            RETURNS & <br/> <span className="text-[#00a651]">REFUNDS.</span>
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed mb-12">
            At Pars Optima, safety is our highest priority. Due to health regulations, the return of pharmaceutical products is strictly governed by medical safety standards.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="p-8 bg-[#f8fafc] border-[1.2px] border-black rounded-sm">
            <ShieldAlert className="text-[#1a3a5a] mb-6" size={32} />
            <h3 className="font-black text-[#1a3a5a] uppercase text-sm mb-4">The Golden Rule</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Medicines cannot be returned once the seal is broken or if they have been stored outside our temperature-controlled environment.</p>
          </div>
          <div className="p-8 bg-[#00a651] text-white rounded-sm">
            <PackageCheck className="mb-6" size={32} />
            <h3 className="font-black uppercase text-sm mb-4">What&apos;s Eligible?</h3>
            <p className="text-white/80 text-sm leading-relaxed">Incorrect items, damaged packaging upon arrival, or cosmetics that are unopened and in their original shrink-wrap.</p>
          </div>
          <div className="p-8 bg-black text-white rounded-sm">
            <RefreshCcw className="mb-6 text-[#00a651]" size={32} />
            <h3 className="font-bold uppercase text-sm mb-4">The Process</h3>
            <p className="text-white/60 text-sm leading-relaxed">Refunds are processed within 7-10 business days after the returned product passes our safety inspection.</p>
          </div>
        </div>

        <div className="bg-slate-50 p-10 md:p-16 rounded-sm border border-slate-200">
           <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-[#1a3a5a] uppercase mb-6">Need to start a return?</h2>
              <p className="text-slate-600 mb-8">Please provide your order number and clear photos of the item. Our pharmaceutical safety team will review your request within 24 hours.</p>
              <button className="bg-black text-white px-10 py-4 font-bold uppercase text-xs tracking-[0.1em] hover:bg-[#1a3a5a] transition-all">
                Submit Return Request
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}