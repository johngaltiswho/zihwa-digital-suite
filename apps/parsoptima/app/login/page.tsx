"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Chrome } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#fcfdfe] flex items-center justify-center px-6 py-6">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#1a3a5a] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-slate-900/20 p-8 lg:p-8 border border-slate-100"
      >
        <div className="text-center mb-5 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-1">
            <ShieldCheck size={14} /> Secure Access
          </div>
          <h1 className="text-3xl font-bold text-[#1a3a5a] uppercase tracking-tighter">Welcome Back</h1>
          <p className="text-slate-400 font-medium text-sm">Access your dashboard</p>
        </div>

        <form className="space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                placeholder="name@example.com"
                className="w-full h-14 pl-14 pr-6 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00a651]/20 font-bold text-sm transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
              <Link href="#" className="text-[10px] font-bold text-[#00a651] uppercase tracking-widest hover:underline">Forgot Password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className="w-full h-14 pl-14 pr-14 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00a651]/20 font-bold text-sm transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="w-full h-16 bg-[#00a651] hover:bg-[#008c44] text-white rounded-2xl font-bold uppercase text-xs tracking-[0.1em] transition-all shadow-xl shadow-green-600/20 flex items-center justify-center gap-3 group mt-4">
            Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-2 pt-5 border-t border-slate-50 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Or continue with</p>
          <button className="w-full h-14 border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-3 font-bold text-slate-700 hover:bg-slate-50 transition-all mb-8">
            <Chrome size={20} /> Google
          </button>
          
          <p className="text-slate-400 text-sm font-medium">
            New to Pars Optima? {" "}
            <Link href="/register" className="text-[#1a3a5a] font-bold uppercase hover:text-[#00a651] transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}