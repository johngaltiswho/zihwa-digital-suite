"use client";

import React, { useState } from "react";
import { User, Lock, ArrowRight, AlertCircle, ChefHat, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/vendure/auth-context";
import { motion } from "framer-motion";

export default function LoginSection() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password, rememberMe);
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <section className="min-h-screen flex flex-col md:flex-row bg-white">
      
      {/* LEFT SIDE: BRAND EXPERIENCE (Visual & Storytelling) */}
      <div className="hidden md:flex w-1/2 bg-[#1a1a1a] relative overflow-hidden items-center justify-center p-10 ">
        {/* Subtle Background Overlay (You can replace the color with an actual high-res spice image) */}
        <div 
          className="absolute inset-0 opacity-40" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=1974&auto=format&fit=crop')", 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#8B2323]/80 to-transparent" />
        
        <div className="relative z-10 text-center max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex justify-center"
          >
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-[30px] border border-white/20">
               <ChefHat size={48} className="text-white" strokeWidth={1.5} />
            </div>
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-6 italic">
          STALKS 'N' SPICE
          </h2>
          <p className="text-white/70 text-lg font-medium leading-relaxed">
           Log in to access your curated selection.
          </p>
          
          <div className="mt-12 flex items-center justify-center gap-6 text-white/50">
            <div className="flex flex-col items-center">
               <Sparkles size={20} className="mb-2 text-white" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Premium Quality</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="flex flex-col items-center">
              <ArrowRight size={20} className="mb-2 text-white" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM (Clean & High-Contrast) */}
      <div className="w-full md:w-1/2 flex items-start justify-start p-8 lg:pt-8 lg:pl-12 bg-white">
        <div className="w-full max-w-[500px]">
          
          <div className="mb-4">
            <h1 className="text-3xl lg:text-5xl font-serif font-bold text-gray-900 mb-1">
              Sign In
            </h1>
            <div className="h-1 w-20 bg-[#8B2323] rounded-full" />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3"
            >
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-600 text-xs font-bold uppercase tracking-tight leading-relaxed">
                {error}
              </p>
            </motion.div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="group">
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">
                Gourmet ID (Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="chef@stalknspice.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full bg-white border-b-2 border-gray-100 py-3 text-gray-900 font-bold focus:outline-none focus:border-[#8B2323] transition-all placeholder:text-gray-200 text-medium"
                />
                <User className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#8B2323] transition-colors" size={20} />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="group">
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Password
                </label>
                <Link href="/forgot-password" size={14} className="text-[10px] font-black uppercase tracking-widest text-[#8B2323] hover:text-black transition-colors">
                  Forgot Password
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full bg-white border-b-2 border-gray-100 py-3 text-gray-900 font-bold focus:outline-none focus:border-[#8B2323] transition-all placeholder:text-gray-200 text-medium"
                />
                <Lock className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#8B2323] transition-colors" size={20} />
              </div>
            </div>

            {/* OPTIONS */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-lg border-2 border-gray-200 text-[#8B2323] focus:ring-[#8B2323] cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer select-none">
                Remember Me
              </label>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-black text-white font-bold uppercase tracking-[0.2em] py-5 rounded-full flex items-center justify-center gap-3 hover:bg-[#8B2323] transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Validating..." : "Log In"} 
              <ArrowRight size={18} />
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-4 pt-4 text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
              Don't have an account yet? <br />
              <Link 
                href="/register" 
                className="text-[#8B2323] hover:text-black font-black underline underline-offset-4 mt-2 inline-block transition-all"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}