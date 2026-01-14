"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewsLetter from "../../components/NewsLetter";

export default function ReturnsPage() {
  return (
    <main className="bg-white min-h-screen font-sans">
      {/* Main Content Container */}
      <section className="max-w-[1000px] mx-auto px-2 py-12 md:py-6">
        
        {/* HEADER - Centered Title & Line */}
        <div className="mb-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 uppercase tracking-tighter">
            Return <span className="text-[#8B2323]">Policy</span>
          </h1>
          {/* Centered Line */}
          <div className="w-24 h-1 bg-[#8B2323] mx-auto rounded-full" />
        </div>

        {/* TEXT BODY - Left Aligned */}
        <div className="text-gray-700 leading-relaxed space-y-3 text-lg text-left">
          <p>
            Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately we can’t offer you a refund or exchange.
          </p>
          <p>
            To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
          </p>
          <p>
            To complete your return, we require a receipt or proof of purchase.
          </p>
          <p>
            Please do not send your purchase back to the manufacturer.
          </p>

          {/* Partial Refunds Section */}
          <div className="bg-gray-50 p-8 md:p-8 rounded-[30px] border border-gray-100 my-16 text-left">
            <p className="font-bold text-gray-900 mb-2 text-xl">
              There are certain situations where only partial refunds are granted: (if applicable)
            </p>
            <ul className="space-y-3 font-medium">
              <li>1) Any item not in its original condition, is damaged or missing parts for reasons not due to our error.</li>
              <li>2) Any item that is returned more than 30 days after delivery</li>
            </ul>
          </div>

          {/* Detailed Policy Sections */}
          <div className="space-y-8 pt-4">
            <section className="text-left">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">REFUNDS</h2>
              <p>
                Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within 10 days from the receipt of the item.
              </p>
            </section>

            <section className="text-left">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">LATE OR MISSING REFUNDS</h2>
              <p>
                If you haven’t received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. Next contact your bank. There is often some processing time before a refund is posted. If you’ve done all of this and you still have not received your refund yet, please contact us at <span className="text-[#8B2323] font-bold">stalksnspice@yahoo.com</span>.
              </p>
            </section>

            <section className="text-left">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">SALE ITEMS</h2>
              <p>
                Only regular priced items may be refunded, unfortunately sale items cannot be refunded.
              </p>
            </section>

            <section className="text-left">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">EXCHANGES</h2>
              <p>
                We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at <span className="text-[#8B2323] font-bold">stalksnspice@yahoo.com</span> and send your item to: #403, 22nd Cross, 2nd Sector, HSR Layout, Bangalore, 560102, Bangalore, KA, 560102, India.
              </p>
            </section>

            <section className="text-left">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">SHIPPING</h2>
              <div className="space-y-4">
                <p>
                  To return your product, you should mail your product to: #403, 22nd Cross, 2nd Sector, HSR Layout, Bangalore, 560102, Bangalore, KA, 560102, India.
                </p>
                <p>
                  You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
                </p>
                <p>
                  Depending on where you live, the time it may take for your exchanged product to reach you, may vary.
                </p>
                <p className="font-medium text-gray-500 italic">
                  If you are shipping an item over Rs.5000, you should consider using a trackable shipping service or purchasing shipping insurance. We don’t guarantee that we will receive your returned item.
                </p>
              </div>
            </section>
          </div>
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