"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // Simulation of an API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section className="py-6 bg-white border-t border-gray-200">
      <div className="max-w-[1250px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:flex lg:flex-row items-start justify-between gap-x-4 gap-y-10 lg:gap-16">
          
          {/* Column 1: Customer Care (Existing) */}
          <div className="flex flex-col gap-3">
    <h3 className="text-lg font-bold uppercase underline black mb-1">Company</h3>
    <Link href="/about" className="text-[15px] font-bold text-gray-900 hover:text-[#8B2323] transition-colors">About Us</Link>
    <Link href="/tracking" className="text-[15px] font-bold text-gray-900 hover:text-[#8B2323] transition-colors">Tracking</Link>
    <Link href="/faq" className="text-[15px] font-bold text-gray-900 hover:text-[#8B2323] transition-colors">FAQ</Link>
    <Link href="/blog" className="text-[15px] font-bold text-gray-900 hover:text-[#8B2323] transition-colors">Blog</Link>
    <Link href="/affiliate" className="text-[15px] font-bold text-gray-900 hover:text-[#8B2323] transition-colors">Affiliate Program</Link>
    <Link href="/bingers" className="text-[15px] font-bold text-gray-900 hover:text-[#8B2323] transition-colors">Gourmet Bingers</Link>
  </div>
  
  
  {/* Column 2: Links (Existing) */}
  <div className="flex flex-col gap-3">
    <h3 className="text-lg font-bold uppercase underline black mb-1">Customer Care</h3>
    <Link href="/contact" className="text-[15px] font-bold text-gray-900 hover:text-[#8B2323] transition-colors">Contact Us</Link>
    <Link href="/privacy" className="text-[15px] font-bold text-gray-900 hover:text-[#8B2323] transition-colors">Privacy Policy</Link>
    <Link href="/returns" className="text-[15px] font-bold text-gray-900 hover:text-[#8B2323] transition-colors">Return Policy</Link>
    <Link href="/terms" className="text-[15px] font-bold text-gray-900 hover:text-[#8B2323] transition-colors">Terms of Service</Link>
    <Link href="/history" className="text-[15px] font-bold text-gray-900 hover:text-[#8B2323] transition-colors">Purchase History</Link>
    
  </div>
  

  {/* NEW Column 3: Shop Categories (Added) */}
  <div className="hidden lg:flex flex-col gap-3">
    <h3 className="text-lg font-bold uppercase underline black mb-1">Links</h3>
    <Link href="/shop" className="text-[15px] font-bold text-gray-900 hover:text-[#8B2323] transition-colors">Shop</Link>
    <Link href="/recipes" className="text-[15px] font-bold text-gray-900 hover:text-[#8B2323] transition-colors">Recipe's</Link>
    <Link href="/shop/beverages" className="text-[15px] font-bold text-gray-900 hover:text-[#8B2323] transition-colors">Beverages</Link>
    <Link href="/shop/dairy" className="text-[15px] font-bold text-gray-900 hover:text-[#8B2323] transition-colors">Dairy & Frozen</Link>
    <Link href="/shop/fruits" className="text-[15px] font-bold text-gray-900 hover:text-[#8B2323] transition-colors">Fruits & Vegetables</Link>
  </div>
          {/* RIGHT SIDE: NEWSLETTER FORM */}
          <div className="w-full col-span-2 lg:max-w-md text-center pt-6 lg:pt-0 border-t border-gray-100 lg:border-none">
            <h2 className="text-4xl font-bold mb-2 tracking-tight text-gray-900 uppercase">Newsletter</h2>
            <p className="text-gray-600 mb-3 text-lg font-medium">
              Subscribe to our newsletter and avail a small gift delivered to your inbox.
            </p>

            {status === "success" ? (
              <div className="p-4 bg-green-50 text-green-700 rounded-full font-bold border border-green-100 animate-pulse">
                ✓ Thank you! Check your inbox for your gift.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com" 
                  className="w-full max-w-[500px] px-8 py-4 rounded-full border border-gray-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/10 mb-6 text-center italic text-lg"
                />
                
                {/* 2. Red Pill-shaped Button */}
                <button 
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-[#8B2323] text-white px-14 py-3.5 rounded-full font-bold text-lg shadow-xl hover:bg-[#721c1c] transition-all transform active:scale-95 disabled:opacity-50"
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
                
                {status === "error" && (
                  <p className="mt-4 text-red-600 font-medium text-sm">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}