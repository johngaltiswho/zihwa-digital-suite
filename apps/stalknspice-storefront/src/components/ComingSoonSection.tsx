"use client";
import React from "react";
import { Lock, Sparkles, Bell } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
}

export default function ComingSoonSection({ title, description }: ComingSoonProps) {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-10">
      <div className="relative mb-10">
        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-red-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        
        {/* The Icon */}
        <div className="relative w-24 h-24 bg-white border border-gray-100 shadow-2xl rounded-[40px] flex items-center justify-center text-[#8B2323]">
          <Lock size={48} strokeWidth={1.5} />
        </div>
        
        {/* Floating Sparkle */}
        <div className="absolute -top-4 -right-4 text-yellow-500 animate-bounce">
          <Sparkles size={28} />
        </div>
      </div>

      <h1 className="text-5xl md:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tighter">
        {title} <br /> <span className="text-[#8B2323]">Coming Soon.</span>
      </h1>
      
      <p className="max-w-xl mx-auto text-gray-500 text-lg md:text-xl font-medium mb-12 leading-relaxed">
        {description}
      </p>

      {/* Interactive Notify Form */}
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="email" 
            placeholder="Enter email for early access" 
            className="flex-1 bg-gray-50 border border-gray-100 rounded-full px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#8B2323]/10"
          />
          <button className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#8B2323] transition-all">
            <Bell size={14} /> Notify Me
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-8 uppercase tracking-widest font-bold">Be the first to unlock the gourmet vault.</p>
      </div>
    </section>
  );
}