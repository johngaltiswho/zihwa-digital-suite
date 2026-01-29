"use client";
import React from "react";

export default function ShippingPolicy() {
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
            Shipping <span className="text-[#00a651]">Policy</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            Last Updated: {currentDate}
          </p>
        </div>

        {/* CONTENT BODY */}
        <div className="prose prose-slate max-w-none space-y-10 text-slate-700">
          
          <section>
            <p className="text-lg leading-relaxed">
              <span className="font-bold text-black uppercase">Pars Optima Enterprises</span> utilizes specialized logistics to ensure the safe and timely arrival of your health and beauty essentials. We prioritize temperature-controlled handling for sensitive pharmaceutical goods.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tight">1. Delivery Timelines</h2>
            <p className="leading-relaxed">
              We aim to process and dispatch all orders within 24 hours of placement (excluding weekends and public holidays).
            </p>
            <ul className="list-disc pl-6 space-y-2 font-medium">
              <li><strong>Express Delivery:</strong> 1-2 Business Days.</li>
              <li><strong>Standard Delivery:</strong> 3-5 Business Days.</li>
              <li><strong>Priority Medical Shipping:</strong> Guaranteed 24-hour dispatch.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tight">2. Shipping Rates</h2>
            <p>Shipping costs are calculated based on weight and destination at checkout. We offer free standard shipping on all orders over $150.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tight">3. Pharmaceutical Safety</h2>
            <p>
              To maintain the integrity of medical products, we use clinical-grade insulated packaging where necessary. Please ensure someone is available to receive the package to avoid exposure to extreme temperatures outside your door.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tight">4. Order Tracking</h2>
            <p>
              Once your order has been shipped, you will receive a tracking number via email. You can monitor the progress of your delivery directly through our logistics partner&apos;s portal.
            </p>
          </section>

          <section className="p-8 bg-slate-50 border-l-4 border-[#00a651] mt-12">
            <h2 className="text-xl font-black text-[#1a3a5a] uppercase tracking-tight mb-2">Logistics Support</h2>
            <p className="text-sm">
              For issues regarding a delayed or missing package, please contact our logistics desk at 
              <span className="font-bold text-[#00a651]"> shipping@parsoptima.com</span>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}