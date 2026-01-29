"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Bell, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

interface ComingSoonProps {
  title: string;
  subtitle: string;
  accentColor: string; // e.g., "text-green-600" or "text-pink-600"
}

export default function ComingSoon({ title, subtitle, accentColor }: ComingSoonProps) {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 relative overflow-hidden bg-white">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-slate-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-50 rounded-full blur-3xl -ml-20 -mb-20 opacity-50" />

      <div className="max-w-2xl w-full text-center relative z-10 space-y-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-8 py-6 bg-slate-50 rounded-full border-slate-100 shadow-sm"
        >
          <Sparkles size={16} className={accentColor} />
          <span className="text-[15px] font-black uppercase tracking-[0.1em] text-slate-400">Launching Very Soon</span>
        </motion.div>

        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl lg:text-6xl font-bold text-[#1a3a5a] uppercase tracking-tighter leading-none"
          >
            {title} <br /> <span className={accentColor}>is arriving</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-slate-500 font-sm text-lg max-w-lg mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* NOTIFY FORM */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="bg-white p-2 rounded-[32px] shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col md:flex-row gap-2 max-w-md mx-auto"
        >
          <div className="flex-1 flex items-center px-6 gap-3 py-3 md:py-0">
            <Mail size={18} className="text-slate-300" />
            <input type="email" placeholder="Enter your email" className="w-full text-sm font-bold outline-none placeholder:text-slate-300" />
          </div>
          <button className="bg-[#1a3a5a] hover:bg-black text-white px-8 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
            Notify Me <Bell size={14} />
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="pt-6"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-[#1a3a5a] transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
        </motion.div>
      </div>
    </section>
  );
}