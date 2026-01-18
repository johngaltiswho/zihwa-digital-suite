"use client";
import React from "react";

export default function TermsConditions() {
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
            Terms & <span className="text-[#00a651]">Conditions</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            Last Updated: {currentDate}
          </p>
        </div>

        {/* CONTENT BODY */}
        <div className="prose prose-slate max-w-none space-y-10 text-slate-700">
          
          <section>
            <p className="text-lg leading-relaxed">
              Welcome to <span className="font-bold text-black uppercase">Pars Optima Enterprises</span>. These terms and conditions outline the rules and regulations for the use of our website and the purchase of our pharmaceutical and cosmetic products.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tight">1. Pharmaceutical Eligibility</h2>
            <p className="leading-relaxed">
              By purchasing medical products from this site, you acknowledge and agree to the following:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-medium">
              <li>You must be at least 18 years of age.</li>
              <li>A valid prescription from a registered medical practitioner is mandatory for prescription-only medications.</li>
              <li>You agree to use medications only as directed by your healthcare professional.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tight">2. Cosmetic Product Use</h2>
            <p>Our cosmetic range is curated for dermatological excellence. However, users should note:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Products are for external use only.</li>
              <li>Always perform a patch test before full application of new skincare products.</li>
              <li>Pars Optima is not liable for allergic reactions due to pre-existing sensitivities.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tight">3. User Accounts</h2>
            <p>
              If you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tight">4. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of Pars Optima Enterprises. Our trademarks may not be used in connection with any product or service without the prior written consent of Pars Optima Enterprises.
            </p>
          </section>

          <section className="p-8 bg-slate-50 border-l-4 border-[#00a651] mt-12">
            <h2 className="text-xl font-black text-[#1a3a5a] uppercase tracking-tight mb-2">Legal Inquiries</h2>
            <p className="text-sm">
              If you have any questions about our Terms and Conditions, please reach out to our legal department at 
              <span className="font-bold text-[#00a651]"> legal@parsoptima.com</span>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}