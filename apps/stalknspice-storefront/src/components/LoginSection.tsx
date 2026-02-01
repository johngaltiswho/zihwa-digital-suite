"use client";

import React, { useState } from "react";
import { User, Lock, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/vendure/auth-context";

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
      // Redirect to account page or home on successful login
      router.push("/account");
    } catch (err) {
      // Error is already set in context
      console.error("Login error:", err);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 ">
      <div className="w-full max-w-[500px] bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-10 md:p-10 border border-gray-100">

        {/* Header Section */}
        <div className="text-center mb-2">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            Log in to your gourmet account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-full flex items-center gap-2">
            <AlertCircle className="text-red-600" size={18} />
            <p className="text-red-600 text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="chef@stalknspice.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full bg-gray-50 rounded-full px-6 py-3 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#8B2323]/10 border-none transition-all disabled:opacity-50"
              />
              <User className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full bg-gray-50 rounded-full px-6 py-3 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#8B2323]/10 border-none transition-all disabled:opacity-50"
              />
              <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 ml-4">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#8B2323] focus:ring-[#8B2323]"
            />
            <label htmlFor="rememberMe" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Remember Me
            </label>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link 
              href="/forgot-password" 
              className="text-[10px] font-bold text-[#8B2323] uppercase tracking-widest hover:text-black transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#8B2323] text-white font-bold uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing In..." : "Sign In"} {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Footer / Redirect to Register */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            New to Stalks N Spice?{" "}
            <Link 
              href="/register" 
              className="text-[#8B2323] hover:underline font-black"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}