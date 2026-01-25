"use client";
import React from "react";

export default function RefundPolicy() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white min-h-screen pt-12 pb-10 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* HEADER */}
        <div className="border-b-2 border-black pb-8 mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-[#1a3a5a] tracking-tighter uppercase mb-4">
            Refund <span className="text-[#00a651]">Policy</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            Last Updated: {currentDate}
          </p>
        </div>

        {/* CONTENT BODY */}
        <div className="prose prose-slate max-w-none space-y-10 text-slate-700">
          
          <section>
            <p className="text-lg leading-relaxed">
              At <span className="font-bold text-black uppercase">Pars Optima Enterprises</span>, we stand by the quality of our products. However, due to the nature of our inventory (Pharmaceuticals and Cosmetics), specific return regulations apply to ensure public health and safety.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tight">1. Pharmaceutical Returns</h2>
            <p className="leading-relaxed">
              To comply with global medical safety standards, pharmaceutical products are generally <strong>non-returnable</strong> once they have left our temperature-controlled facility.
            </p>
            <ul className="list-disc pl-6 space-y-2 font-medium">
              <li>Returns are only accepted for incorrect items delivered.</li>
              <li>Damaged packaging must be reported within 24 hours of delivery.</li>
              <li>Prescription medications cannot be returned due to change of mind.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tight">2. Cosmetic Returns</h2>
            <p>Cosmetic products can be returned within 14 days of delivery provided they meet the following criteria:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The product must be unopened and unused.</li>
              <li>The original shrink-wrap and safety seals must be intact.</li>
              <li>The item must be in its original retail packaging.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tight">3. Refund Process</h2>
            <p>
              Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 7-10 business days.
            </p>
          </section>

          <section className="p-8 bg-slate-50 border-l-4 border-[#00a651] mt-12">
            <h2 className="text-xl font-black text-[#1a3a5a] uppercase tracking-tight mb-2">Support</h2>
            <p className="text-sm">
              To initiate a return or check your refund status, please contact our support team at 
              <span className="font-bold text-[#00a651]"> returns@parsoptima.com</span>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}