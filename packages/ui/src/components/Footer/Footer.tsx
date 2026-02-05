"use client";

import React from "react";
// Add these imports at the top of Footer.tsx
import { Tag, Heart, ShoppingCart, ChefHat, ArrowLeft, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type LinkProps = {
  href: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
};

function AppLink({ href, children, target, rel }: LinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}
    >
      {children}
    </a>
  );
}

// ==========================================
// 1. AACP FOOTER
// ==========================================
export function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          fontSize: "13px",
          color: "#4b5563",
        }}
      >
        {/* LEFT LINKS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span className="text-gray-600 select-none">INTRANET</span>

          <AppLink href="/privacy-policy">PRIVACY POLICY</AppLink>
          <AppLink href="/terms-of-service">TERMS OF SERVICE</AppLink>
        </div>

        {/* CENTER */}
        <div style={{ textAlign: "center", lineHeight: "1.6" }}>
          <div>
            © 2024 by AACP Infrastructure Systems Pvt. Ltd. All Rights Reserved.
          </div>
          <div>Created by Zihwa Insights</div>
        </div>

        {/* RIGHT SOCIAL */}
        <div style={{ display: "flex", gap: "14px" }}>
          <AppLink
            href="https://www.facebook.com/aacpinfra/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="black">
              <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5.004 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 17.004 22 12z" />
            </svg>
          </AppLink>
          
          <AppLink
            href="https://www.instagram.com/aacpinfra/"
            target="_blank"
            rel="noopener noreferrer"
          >
          <svg width="30" height="30" viewBox="0 0 24 20" fill="black" aria-label="Instagram" >
              <path d="M7 2C4.238 2 2 4.238 2 7v10c0 2.762 2.238 5 5 5h10c2.762 0 5-2.238 5-5V7c0-2.762-2.238-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3.5A4.5 4.5 0 1 0 16.5 12 4.505 4.505 0 0 0 12 7.5zm0 7.4A2.9 2.9 0 1 1 14.9 12 2.904 2.904 0 0 1 12 14.9zm4.75-8.65a1.05 1.05 0 1 0 1.05 1.05 1.05 1.05 0 0 0-1.05-1.05z" />
          </svg>
          </AppLink>

          <AppLink
            href="https://www.linkedin.com/company/aacpinfra/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="28" height="30" viewBox="0 0 24 24" fill="black">
              <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0zM8 8h4.8v2.2h.07c.67-1.2 2.3-2.47 4.73-2.47 5.06 0 6 3.33 6 7.66V24h-5v-7.98c0-1.9-.03-4.34-2.64-4.34-2.64 0-3.04 2.06-3.04 4.2V24H8z" />
            </svg>
          </AppLink>
        </div>
      </div>
    </footer>
  );
}


export function StalknSpiceFooter() {
  const router = useRouter();

  return (
    <>
      <footer
        className="pb-24 md:pb-8"
        style={{
          width: "100%",
          backgroundColor: "#f9f9f9",
          paddingTop: "30px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div className="max-w-[1100px] mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
          {/* 1. Payment Methods */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexDirection: "row" }}>
            <div style={{ border: "1.5px solid #000", padding: "4px 10px", borderRadius: "2px", backgroundColor: "#fff" }}>
              <span style={{ fontWeight: "900", fontStyle: "italic", fontSize: "16px", letterSpacing: "-1px" }}>VISA</span>
            </div>
            <div style={{ backgroundColor: "#000", color: "#fff", padding: "6px 12px", borderRadius: "3px", display: "flex", alignItems: "center" }}>
              <span style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "14px" }}>PayPal</span>
            </div>
            <div style={{ backgroundColor: "#000", padding: "4px 8px", borderRadius: "3px", height: "32px", display: "flex", alignItems: "center" }}>
              <svg width="50" height="24" viewBox="0 0 60 30">
                 <circle cx="22" cy="15" r="11" fill="white" fillOpacity="0.8" />
                 <circle cx="38" cy="15" r="11" fill="white" fillOpacity="0.8" />
                 <text x="30" y="17" textAnchor="middle" style={{ fontSize: "8px", fontWeight: "bold", fill: "#000" }}>Maestro</text>
              </svg>
            </div>
          </div>

          {/* 2. Copyright */}
          <div style={{ fontSize: "18px", color: "#000", fontWeight: "400", textAlign: "center" }}>
            © Zihwa Insights . All Rights Reserved.
          </div>

          {/* 3. Social Icons */}
          <div style={{ display: "flex", gap: "10px", flexDirection: "row" }}>
            <AppLink href="https://www.facebook.com/stalksnspice1997" target="_blank">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="19" fill="none" stroke="black" strokeWidth="1.5" />
                <path d="M23 15h-2c-.55 0-1 .45-1 1v2h3l-.5 3h-2.5v7h-3v-7h-2v-3h2v-2c0-2.21 1.79-4 4-4h2v3z" fill="black" />
              </svg>
            </AppLink>
             {/* Instagram */}
          <AppLink href="https://www.instagram.com/stalksnspice/" target="_blank">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="19" fill="none" stroke="black" strokeWidth="1.5" />
              <rect x="12" y="12" width="16" height="16" rx="4" fill="none" stroke="black" strokeWidth="1.5" />
              <circle cx="20" cy="20" r="3.5" fill="none" stroke="black" strokeWidth="1.5" />
              <circle cx="24.5" cy="15.5" r="1" fill="black" />
            </svg>
          </AppLink>

          {/* Twitter/X */}
          <AppLink href="https://x.com/stalksnspice" target="_blank">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="19" fill="none" stroke="black" strokeWidth="1.5" />
              <path d="M28 15c-.6.3-1.2.4-1.9.5.7-.4 1.2-1.1 1.4-1.9-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.8 0-3.3 1.5-3.3 3.3 0 .3 0 .5.1.8-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1.1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4 0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4h-.8c1.5 1 3.2 1.5 5.2 1.5 6.2 0 9.6-5.1 9.6-9.6v-.4c.7-.5 1.2-1.1 1.7-1.8z" fill="black" />
            </svg>
          </AppLink>
          </div>
        </div>
      </footer>
      

      {/* ========================================== */}
      {/* MOBILE BOTTOM NAVIGATION */}
      {/* ========================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 z-[9999] h-[65px] flex justify-around items-center text-gray-900 shadow-[0_-5px_25px_rgba(0,0,0,0.07)]">
        
        <button onClick={() => router.back()} className="flex flex-col items-center gap-1 w-16">
          <ArrowLeft size={22} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Back</span>
        </button>

        <Link href="/offers" className="flex flex-col items-center gap-1 w-16">
          <Tag size={22} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Offers</span>
        </Link>
        
        {/* Centered "Home" button with Raised Design */}
        <Link href="/Shop" className="relative -top-3 flex flex-col items-center">
          <div className="p-1.5 bg-white rounded-full shadow-lg">
             <div className="w-14 h-14 bg-[#8B2323] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                <Store size={30} />
             </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#8B2323] mt-1">Shop</span>
        </Link>
        
        <Link href="/wishlist" className="flex flex-col items-center gap-1 w-16">
          <Heart size={22} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Wishlist</span>
        </Link>

        <Link href="/cart" className="flex flex-col items-center gap-1 w-16">
          <div className="relative">
            <ShoppingCart size={22} />
            <span className="absolute -top-1 -right-1 bg-[#8B2323] text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Cart</span>
        </Link>
      </div>
    </>
  );
}
export function ParsOptimaFooter() {
  // Define link arrays with actual routes
  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "FAQ'S", href: "/faqs" },
    { name: "Contact Us", href: "/contact" },
  ];

  const orderLinks = [
    { name: "Track Delivery", href: "/track" },
    { name: "Return Meds", href: "/returns" },
    { name: "Help Center", href: "/contact" },
  ];

  const policyLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-conditions" },
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Shipping Policy", href: "/shipping-policy" },
  ];

  return (
    <footer className="w-full bg-white font-sans border-t border-slate-100">
      {/* --- FOOTER TOP: MULTI-COLUMN LINKS --- */}
      <section className="py-10 max-w-[1440px] mx-auto px-12 lg:px-12 border-b border-slate-50">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Column 1: Our Company */}
          <div className="space-y-2">
            <h5 className="font-bold text-[#1a3a5a] uppercase text-medium tracking-widest border-b border-slate-100 pb-3">Our Company</h5>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 text-[13px] hover:text-[#00a651] font-bold uppercase transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Order Hub */}
          <div className="space-y-2">
            <h5 className="font-bold text-[#1a3a5a] uppercase text-medium tracking-widest border-b border-slate-100 pb-3">Order Hub</h5>
            <ul className="space-y-2">
              {orderLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 text-[13px] hover:text-[#00a651] font-bold uppercase transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Policies */}
          <div className="space-y-2">
            <h5 className="font-bold text-[#1a3a5a] uppercase text-medium tracking-widest border-b border-slate-100 pb-3">Our Policies</h5>
            <ul className="space-y-2">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 text-[13px] hover:text-[#00a651] font-bold uppercase transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 & 5: Newsletter (Spans 2 columns on large screens) */}
          <div className="col-span-2 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">NEWSLETTER</h2>
            <div className="flex flex-col md:flex-row max-w-md border-black border-[1.2px] rounded-sm overflow-hidden shadow-md">
              <input 
                type="email" 
                placeholder="ENTER YOUR EMAIL HERE" 
                className="flex-1 p-4 outline-none text-left text-sm font-medium placeholder-gray-400"
              />
              <button className="bg-black text-white px-8 py-4 font-bold hover:bg-gray-800 transition-all uppercase text-sm tracking-widest whitespace-nowrap">
                Submit
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* --- FOOTER BASE --- */}
      <div className="bg-[#f9f9f9] py-8">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
          
          {/* Payment Methods */}
          <div className="flex gap-3 items-center">
            <div className="border-[1.5px] border-black px-2.5 py-1 rounded-[2px] bg-white">
              <span className="font-black italic text-[14px] tracking-tighter text-black">VISA</span>
            </div>
            <div className="bg-black text-white px-3 py-1.5 rounded-[3px] flex items-center">
              <span className="font-bold italic text-[12px]">PayPal</span>
            </div>
            <div className="bg-black px-2 py-1 rounded-[3px] h-8 flex items-center">
              <svg width="45" height="20" viewBox="0 0 60 30">
                <circle cx="22" cy="15" r="11" fill="white" fillOpacity="0.8" />
                <circle cx="38" cy="15" r="11" fill="white" fillOpacity="0.8" />
                <text x="30" y="17" textAnchor="middle" className="text-[8px] font-bold fill-black">Maestro</text>
              </svg>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-[13px] text-gray-500 font-medium text-center">
            © {new Date().getFullYear()} <span className="text-black font-semibold uppercase">Pars Optima Enterprises</span>. All Rights Reserved.
          </div>

          {/* Social Icons */}
          <div className="flex gap-2">
            <Link href="https://facebook.com" target="_blank" className="hover:scale-110 transition-transform">
              <svg width="36" height="36" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="19" fill="none" stroke="black" strokeWidth="1.2" />
                <path d="M23 15h-2c-.55 0-1 .45-1 1v2h3l-.5 3h-2.5v7h-3v-7h-2v-3h2v-2c0-2.21 1.79-4 4-4h2v3z" fill="black" />
              </svg>
            </Link>
            <Link href="https://instagram.com" target="_blank" className="hover:scale-110 transition-transform">
              <svg width="36" height="36" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="19" fill="none" stroke="black" strokeWidth="1.2" />
                <rect x="12" y="12" width="16" height="16" rx="4" fill="none" stroke="black" strokeWidth="1.2" />
                <circle cx="20" cy="20" r="3.5" fill="none" stroke="black" strokeWidth="1.2" />
                <circle cx="24.5" cy="15.5" r="1" fill="black" />
              </svg>
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:scale-110 transition-transform">
              <svg width="36" height="36" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="19" fill="none" stroke="black" strokeWidth="1.2" />
                <path d="M28 15c-.6.3-1.2.4-1.9.5.7-.4 1.2-1.1 1.4-1.9-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.8 0-3.3 1.5-3.3 3.3 0 .3 0 .5.1.8-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1.1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4 0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4h-.8c1.5 1 3.2 1.5 5.2 1.5 6.2 0 9.6-5.1 9.6-9.6v-.4c.7-.5 1.2-1.1 1.7-1.8z" fill="black" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}