"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Minus, UserPlus, ShoppingBag, Percent } from "lucide-react";
import NewsLetter from "../../components/NewsLetter";

export default function GourmetBingersPage() {
  return (
    <main className="bg-white min-h-screen font-sans">
      
      {/* 1. JUMBOTRON HERO SECTION */}
      <section className="relative w-full h-[400px] md:h-[550px] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image 
          src="https://s3.ap-south-1.amazonaws.com/stalksnspice.com/landing-page/monin.jpg"
          alt="Gourmet Bingers"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none mb-6">
            Gourmet <br /> <span className="text-red-500">Bingers</span>
          </h1>
          <p className="text-white text-lg md:text-2xl font-bold uppercase tracking-[0.3em] max-w-2xl opacity-90">
            Get Rewarded for Shopping. Benefits based on monthly purchases.
          </p>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">
            Extra Rewards for Shopping Your Essentials. <br /> 
            <span className="text-[#8B2323]">Here is How:</span>
          </h2>
          <div className="w-24 h-1 bg-[#8B2323] mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-[30px] flex items-center justify-center text-4xl font-black text-black group-hover:text-[#8B2323] group-hover:bg-red-50 transition-all mb-8 shadow-sm">
              1
            </div>
            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest mb-4">Join For Free</h3>
            <p className="text-gray-500 leading-relaxed">Sign Up to be a part of the Gourmet Bingers Program</p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-[30px] flex items-center justify-center text-4xl font-black text-black group-hover:text-[#8B2323] group-hover:bg-red-50 transition-all mb-8 shadow-sm">
              2
            </div>
            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest mb-4">Shop</h3>
            <p className="text-gray-500 leading-relaxed">Shop your daily essentials like dals, oil, etc. or your favourite gourmet ingredients.</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-[30px] flex items-center justify-center text-4xl font-black text-black group-hover:text-[#8B2323] group-hover:bg-red-50 transition-all mb-8 shadow-sm">
              3
            </div>
            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest mb-4">Discounts Based on Level</h3>
            <p className="text-gray-500 leading-relaxed">Get upto 10% automatic discounts applied automatically while you checkout.</p>
          </div>
        </div>
      </section>

      {/* 3. LOYALTY TIERS TABLE */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h4 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-2">Exclusive Deals & Offers</h4>
            <p className="text-[#8B2323] font-bold uppercase tracking-[0.2em] text-xs">Gourmet Bingers Loyalty Tiers</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-[40px] overflow-hidden shadow-2xl border-collapse">
              <thead>
                <tr className="bg-gray-100 text-black">
                  <th className="p-8 text-left uppercase tracking-widest text-sm font-black">Benefits</th>
                  <th className="p-8 text-center border-l border-white/10">
                    <span className="block text-lg font-black uppercase italic">Foodie</span>
                    <span className="block text-[10px] font-bold text-gray-400 mt-1">&lt; Rs.1999</span>
                  </th>
                  <th className="p-8 text-center border-l border-white/10 bg-[#8B2323]">
                    <span className="block text-lg font-black uppercase italic">Home Chef</span>
                    <span className="block text-[10px] font-bold text-red-200 mt-1">Rs.2000 - Rs.4999</span>
                  </th>
                  <th className="p-8 text-center border-l border-white/10">
                    <span className="block text-lg font-black uppercase italic">Master Chef</span>
                    <span className="block text-[10px] font-bold text-gray-400 mt-1">&gt; Rs.5000</span>
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700 font-bold">
                <tr className="border-b border-gray-50">
                  <td className="p-8 flex items-center gap-3"><Percent size={18} className="text-[#8B2323]" /> Discount</td>
                  <td className="p-8 text-center text-gray-400">0%</td>
                  <td className="p-8 text-center text-[#8B2323] text-xl font-black">5%</td>
                  <td className="p-8 text-center text-gray-900 text-xl font-black">10%</td>
                </tr>
                <tr className="border-b border-gray-50 bg-gray-50/30">
                  <td className="p-8">New Tier Welcome Gift</td>
                  <td className="p-8 text-center"><Check className="mx-auto text-green-500" size={24} /></td>
                  <td className="p-8 text-center"><Check className="mx-auto text-green-500" size={24} /></td>
                  <td className="p-8 text-center"><Check className="mx-auto text-green-500" size={24} /></td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="p-8">Priority Access to Discounts</td>
                  <td className="p-8 text-center"><Minus className="mx-auto text-gray-200" size={24} /></td>
                  <td className="p-8 text-center"><Check className="mx-auto text-green-500" size={24} /></td>
                  <td className="p-8 text-center"><Check className="mx-auto text-green-500" size={24} /></td>
                </tr>
                <tr className="border-b border-gray-50 bg-gray-50/30">
                  <td className="p-8">Priority Access to New Releases</td>
                  <td className="p-8 text-center"><Minus className="mx-auto text-gray-200" size={24} /></td>
                  <td className="p-8 text-center"><Check className="mx-auto text-green-500" size={24} /></td>
                  <td className="p-8 text-center"><Check className="mx-auto text-green-500" size={24} /></td>
                </tr>
                <tr>
                  <td className="p-8">Free Standard Shipping</td>
                  <td className="p-8 text-center"><Minus className="mx-auto text-gray-200" size={24} /></td>
                  <td className="p-8 text-center"><Minus className="mx-auto text-gray-200" size={24} /></td>
                  <td className="p-8 text-center"><Check className="mx-auto text-green-500" size={24} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 text-center">
         <div className="bg-gray-500 rounded-[50px] p-12 md:p-20 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6">Ready to Binge?</h2>
              <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">Join thousands of foodies already saving on their monthly gourmet essentials.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/register" className="bg-[#8B2323] px-12 py-4 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl">Join Now</Link>
                <Link href="/" className="bg-white/10 border border-white/20 px-12 py-4 rounded-full font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                  <ArrowLeft size={18} /> Back Home
                </Link>
              </div>
            </div>
         </div>
      </section>

      <div className="pb-20">
        <NewsLetter />
      </div>
    </main>
  );
}