"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Trophy, UserPlus } from "lucide-react";
import NewsLetter from "../../components/NewsLetter";

export default function AffiliateProgramPage() {
  return (
    <main className="bg-white min-h-screen font-sans">
      {/* Main Content Container */}
      <section className="max-w-[1000px] mx-auto px-6 py-12 md:py-8">
        
        {/* HEADER - Centered Title & Line */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 uppercase tracking-tighter">
            Affiliate <span className="text-[#8B2323]">Program</span>
          </h1>
          <div className="w-24 h-1 bg-[#8B2323] mx-auto rounded-full" />
        </div>

        {/* TEXT BODY - Left Aligned */}
        <div className="text-gray-700 leading-relaxed space-y-6 text-lg text-left">
          
          <p>
            Join the Stalks N Spice affiliate program and start earning money today. Stalks N Spice Affiliates Program helps cooks, foodies and bloggers monetize their traffic. With thousands of products available on Stalks N Spice. Affiliates use coupon codes to direct their audience to their recommendations, and earn from qualifying purchases and programs.
          </p>

          {/* FAQ SECTION */}
          <div className="space-y-10">
            <h2 className="text-2xl font-black text-gray-900 uppercase text-center tracking-[0.2em] border-b border-gray-100 pb-4">
                FREQUENTLY ASKED QUESTIONS
            </h2>

            {/* QUESTION 1 - WORKINGS & COMMISSION */}
            <section className="text-left">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <HelpCircle size={22} className="text-[#8B2323]" />
                How Does The Affiliate Program Work?
              </h3>
              <p className="mb-6">
                As an affiliate you will provided with a unique coupon code which offers 3% discount. You can share this coupon codes on your choice of social media channel where most of your audience and followers are. Each time your coupon code is used you will get paid based on the total sales generated the previous month. Payment will be made monthly based on the previous months sales. The commission, based on the total sales made is as outlined below:
              </p>
              
              {/* Commission Tiers - Structured for Readability */}
              <div className="bg-gray-50 p-8 rounded-[30px] border border-gray-100 max-w-md">
                <ul className="space-y-3 font-bold text-gray-800">
                  <li className="flex justify-between border-b border-gray-200 pb-2">
                    <span>Less than Rs.2000</span>
                    <span className="text-[#8B2323]">2%</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 pb-2">
                    <span>Rs.2000 - Rs.5000</span>
                    <span className="text-[#8B2323]">4%</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 pb-2">
                    <span>Rs.5000 - Rs.10000</span>
                    <span className="text-[#8B2323]">6%</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 pb-2">
                    <span>Rs.10000 - Rs.20000</span>
                    <span className="text-[#8B2323]">8%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Greater than Rs.20000</span>
                    <span className="text-[#8B2323]">10%</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* QUESTION 2 - BENEFITS */}
            <section className="text-left">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-3">
                <Trophy size={22} className="text-[#8B2323]" />
                Are There Any Other Benefits To The Program?
              </h3>
              <p>
                Yes, we often give send out samples of products to try out! The value of the samples can often vary from Rs.50 to Rs.1000
              </p>
            </section>

            {/* QUESTION 3 - QUALIFY */}
            <section className="text-left">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-3">
                <CheckCircle size={22} className="text-[#8B2323]" />
                How Do I Qualify For The program?
              </h3>
              <p>
                Cooks and foodies who have a passion for food and love experimenting with new ingredients can participate in this program.
              </p>
            </section>

            {/* QUESTION 4 - SIGN UP */}
            <section className="text-left bg-gray-600 p-10 md:p-12 rounded-[40px] text-white shadow-xl">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 flex items-center gap-3 italic">
                <UserPlus size={26} />
                How Do I Sign Up?
              </h3>
              <p className="text-lg opacity-90 mb-6">
                You can email us with your social media links and blogs to start your journey as a Stalks N Spice affiliate.
              </p>
              <p className="text-xl font-bold bg-white/10 w-fit px-6 py-3 rounded-full border border-white/20">
                umamaheshwar@stalksnspice.com
              </p>
            </section>
          </div>
        </div>

        {/* RETURN HOME BUTTON */}
        <div className="mt-10 pt-10 border-t border-gray-100 text-center">
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

// Small helper for the icon used above
function CheckCircle({ size, className }: { size: number, className: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    )
}