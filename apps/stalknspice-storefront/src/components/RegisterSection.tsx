"use client";
import React from "react";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-6">
      <div className="w-full max-w-[500px] bg-white rounded-[50px] shadow-xl p-10 md:p-10 border border-gray-100">
        
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">Create Account</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Join the Stalks N Spice community</p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
            <div className="relative">
              <input type="text" placeholder="Your Name" className="w-full bg-gray-50 rounded-full px-6 py-4 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#8B2323]/10 border-none" />
              <User className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
            <div className="relative">
              <input type="email" placeholder="email@example.com" className="w-full bg-gray-50 rounded-full px-6 py-4 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#8B2323]/10 border-none" />
              <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Password</label>
            <div className="relative">
              <input type="password" placeholder="••••••••" className="w-full bg-gray-50 rounded-full px-6 py-4 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#8B2323]/10 border-none" />
              <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            </div>
          </div>

          <button className="w-full bg-[#8B2323] text-white font-bold uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20">
            Create Account <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Already have an account? <Link href="/login" className="text-[#8B2323] hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
}