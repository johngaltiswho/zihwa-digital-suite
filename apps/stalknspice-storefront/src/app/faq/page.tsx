"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import NewsLetter from "../../components/NewsLetter";

export default function FAQPage() {
  return (
    <main className="bg-white min-h-screen font-sans">
      {/* Main Content Container */}
      <section className="max-w-[1000px] mx-auto px-6 py-12 md:py-8">
        
        {/* HEADER - Centered Title & Line */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 uppercase tracking-tighter">
            Frequently Asked <span className="text-[#8B2323]">Questions</span>
          </h1>
          <div className="w-24 h-1 bg-[#8B2323] mx-auto rounded-full" />
        </div>

        {/* TEXT BODY - Left Aligned */}
        <div className="text-gray-700 leading-relaxed space-y-8 text-lg text-left">
          
          <p className="mb-8">
            Following are the links to most common FAQ's. For any query which is not addressed in the FAQ's please feel free to email us at <span className="text-[#8B2323] font-bold">umamaheshwar@stalksnspice.com</span>
          </p>

          <div className="space-y-12">
            {/* QUESTION 1 */}
            <section className="text-left group">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2 flex items-center gap-3">
                <HelpCircle size={20} className="text-[#8B2323]" />
                How do I contact you?
              </h2>
              <p>
                Please visit the <Link href="/contact" className="text-[#8B2323] font-bold underline decoration-2 underline-offset-4 hover:text-black transition-colors">contact us</Link> page.
              </p>
            </section>

            {/* QUESTION 2 */}
            <section className="text-left group">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2 flex items-center gap-3">
                <HelpCircle size={20} className="text-[#8B2323]" />
                How do I return or exchange a product?
              </h2>
              <p>
                You can go through our <Link href="/returns" className="text-[#8B2323] font-bold underline decoration-2 underline-offset-4 hover:text-black transition-colors">return policy</Link> page. It outlines the procedure for returning/exchanging products. If you need additional assistance, please contact us at <span className="text-[#8B2323] font-bold">umamaheshwar@stalksnspice.com</span>.
              </p>
            </section>

            {/* QUESTION 3 */}
            <section className="text-left group">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2 flex items-center gap-3">
                <HelpCircle size={20} className="text-[#8B2323]" />
                When will my order ship? When will my order be delivered?
              </h2>
              <p>
                Shipping depends on the type of products & it's availability. You will receive a shipment confirmation via email when your order has shipped and tracking information within 24-48 hours of shipment. With the tracking code you can visit the <Link href="/tracking" className="text-[#8B2323] font-bold underline decoration-2 underline-offset-4 hover:text-black transition-colors">tracking</Link> page to track your order.
              </p>
            </section>

            {/* QUESTION 4 */}
            <section className="text-left group">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2 flex items-center gap-3">
                <HelpCircle size={20} className="text-[#8B2323]" />
                Do you have a wholesale program?
              </h2>
              <p>
                We most definitely do. Let us know your requirement by sending a mail to <span className="text-[#8B2323] font-bold">umamaheshwar@stalksnspice.com</span> and we can take it forward.
              </p>
            </section>

            {/* QUESTION 5 */}
            <section className="text-left group">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2 flex items-center gap-3">
                <HelpCircle size={20} className="text-[#8B2323]" />
                Do you provide custom designed apparel?
              </h2>
              <p>
                We most definitely do. Let us know your requirements & design by sending a mail to <span className="text-[#8B2323] font-bold">umamaheshwar@stalksnspice.com</span> and we can take it forward.
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