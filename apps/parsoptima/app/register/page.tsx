"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#fcfdfe] flex items-center justify-center px-6 py-6">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#1a3a5a] -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-white rounded-[40px] shadow-2xl shadow-slate-900/20 p-8 lg:p-14 border border-slate-100"
      >
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-[#1a3a5a] uppercase mb-2">Join Pars Optima</h1>
          <p className="text-slate-400 font-medium text-sm">Start your journey to better health and beauty.</p>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Full Name */}
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input type="text" placeholder="John Doe" className="w-full h-14 pl-14 pr-6 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00a651]/20 font-bold text-sm outline-none" />
                </div>
             </div>
             {/* Mobile Number */}
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input type="tel" placeholder="+91 00000 00000" className="w-full h-14 pl-14 pr-6 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00a651]/20 font-bold text-sm outline-none" />
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="email" placeholder="john@example.com" className="w-full h-14 pl-14 pr-6 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00a651]/20 font-bold text-sm outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Create Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="password" placeholder="Min. 8 characters" className="w-full h-14 pl-14 pr-6 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00a651]/20 font-bold text-sm outline-none" />
            </div>
          </div>

          <div className="flex items-start gap-3 px-2">
             <div className="w-5 h-5 rounded-md border-2 border-slate-200 mt-0.5 flex items-center justify-center text-white bg-[#00a651]">
                <CheckCircle2 size={12}/>
             </div>
             <p className="text-xs text-slate-400 font-medium leading-relaxed">
               I agree to the <Link href="/terms" className="text-[#1a3a5a] font-bold underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#1a3a5a] font-bold underline">Privacy Policy</Link>.
             </p>
          </div>

          <button className="w-full h-16 bg-[#1a3a5a] hover:bg-black text-white rounded-2xl font-bold uppercase text-xs tracking-[0.2em] transition-all shadow-xl shadow-[#1a3a5a]/20 flex items-center justify-center gap-3 group">
            Create Free Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-1 pt-4 border-t border-slate-50 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Already have an account? {" "}
            <Link href="/login" className="text-[#00a651] font-black uppercase tracking-tighter hover:text-[#1a3a5a] transition-colors">
              Sign In Instead
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}