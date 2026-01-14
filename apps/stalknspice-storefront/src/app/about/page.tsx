"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import NewsLetter from "../../components/NewsLetter";

export default function AboutUsPage() {
  return (
    <main className="bg-white min-h-screen font-sans">
      {/* Main Content Container */}
      <section className="max-w-[1000px] mx-auto px-6 py-12 md:py-8">
        
        {/* HEADER - Centered Title & Line */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase tracking-tighter leading-tight">
            Premium Food Service Distributor <br /> 
            <span className="text-[#8B2323]">With Excellence Over a Decade</span>
          </h1>
          <div className="w-24 h-1 bg-[#8B2323] mx-auto rounded-full" />
        </div>

        {/* TEXT BODY - Left Aligned */}
        <div className="text-gray-700 leading-relaxed space-y-8 text-lg text-left">
          
          <div className="space-y-6">
            <p>
              In 1997 STALKS 'n' SPICE pioneered the concept of supplying food products to HORECA (Hotels, restaurants & caterers) and also clubs, schools, software companies and other kind of institutions.
            </p>
            <p>
              Today, renowned for its undeviating quality standards, transparency, customer satisfaction and unshakable integrity. STALKS 'n' SPICE is well accepted as best supplier by hotel industries.
            </p>
            <p className="font-bold text-gray-900">
              A primary contribution factor for its immense success is its unique business model adopting a well thought out approach. It is astutely self reliant in important areas such as:
            </p>
          </div>

          {/* Business Model List */}
          <ul className="space-y-4">
            {[
              'In-house manufacturing facility of certain products with our own brands " TOPPS" & "MY FAVOURITE".',
              'Well equipped own warehouse facility.',
              'Company owned vehicles for delivering products with experienced drivers and delivery boys.',
              'Authorized distributors for: Dabur India Limited (Real juices), Kellogs India Pvt.Ltd etc.',
              'Having tie-up with Domestic & international companies for procurement thus avoiding delay in supply and gaining full control of quality, timely delivery with competitive price.'
            ].map((item, idx) => (
              <li key={idx} className="flex gap-4 items-start">
                <CheckCircle2 className="text-[#8B2323] mt-1 flex-shrink-0" size={20} />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Salient Features Section */}
          <section className="pt-10">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-8 border-b border-gray-100 pb-2 text-center">
              Salient Features
            </h2>
            <ul className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {[
                "Stalks 'n' Spice is set up in H.S.R Layout, which is well connected to other parts of Banglore City.",
                "Fully computerized office with efficient staff to deliver products in time.",
                "Having branches at Mysore and Hyderabad.",
                "Supply of the products throughout the year.",
                "Well trained staff to receive orders and supply the products.",
                "Availabilty of all imported products. Well equipped own warehouse facility."
              ].map((feature, idx) => (
                <li key={idx} className="flex gap-3 items-start text-base">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8B2323] mt-2.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* RETURN HOME BUTTON */}
        <div className="mt-20 pt-10 border-t border-gray-100 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 bg-[#8B2323] hover:bg-black text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all shadow-lg active:scale-95"
          >
            <ArrowLeft size={18} /> Return Home
          </Link>
        </div>

      </section>

      <div className="pb-20">
        <NewsLetter />
      </div>
    </main>
  );
}