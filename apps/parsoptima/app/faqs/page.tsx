"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    category: "Orders & Shipping",
    questions: [
      { q: "How long does delivery take?", a: "Standard delivery takes 2-4 business days. For pharmaceutical products, we offer priority handling to ensure safety." },
      { q: "Can I track my order in real-time?", a: "Yes, once your order is dispatched, you will receive a tracking link via email and SMS." }
    ]
  },
  {
    category: "Pharmaceuticals",
    questions: [
      { q: "Do I need a prescription?", a: "For prescription-only medications, you must upload a valid prescription from a registered doctor during checkout." },
      { q: "How are medicines stored during transit?", a: "We use temperature-controlled packaging for sensitive medications to maintain their efficacy." }
    ]
  },
  {
    category: "Cosmetics & Skincare",
    questions: [
      { q: "Are your cosmetics dermatologically tested?", a: "Absolutely. We only curate brands that adhere to strict safety and dermatological standards." },
      { q: "What is the shelf life of the beauty products?", a: "Most products have a shelf life of 12-24 months. Please check the 'Period After Opening' (PAO) symbol on the packaging." }
    ]
  }
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <div className="bg-white min-h-screen pt-12 pb-12 font-sans">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-black text-[#1a3a5a] tracking-tighter uppercase mb-4 text-center">FAQ&apos;S</h1>
        <p className="text-slate-500 text-center mb-12 font-medium uppercase tracking-widest text-sm">Find answers to common questions</p>

        {faqData.map((section, sIdx) => (
          <div key={sIdx} className="mb-12">
            <h2 className="text-[#00a651] font-bold text-xl tracking-[0.1em] uppercase mb-6 border-b border-slate-100 pb-2">{section.category}</h2>
            <div className="space-y-4">
              {section.questions.map((item, qIdx) => {
                const id = `${sIdx}-${qIdx}`;
                const isOpen = openIndex === id;
                return (
                  <div key={id} className="border-b border-slate-100 last:border-0">
                    <button 
                      onClick={() => setOpenIndex(isOpen ? null : id)}
                      className="w-full flex justify-between items-center py-5 text-left group"
                    >
                      <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-[#00a651]' : 'text-[#1a3a5a] group-hover:text-[#00a651]'}`}>
                        {item.q}
                      </span>
                      <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#00a651]' : 'text-slate-300'}`} />
                    </button>
                    {isOpen && (
                      <div className="pb-6 text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-2">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}