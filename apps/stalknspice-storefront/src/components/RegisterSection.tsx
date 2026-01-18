"use client";
import React, { useState } from "react";
import { User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/vendure/auth-context";

export default function RegisterSection() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [success, setSuccess] = useState(false);
  const { register, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccess(false);

    try {
      await register({
        firstName,
        lastName,
        emailAddress: email,
        password,
        phoneNumber: phoneNumber || undefined,
      });

      setSuccess(true);

      // Note: Vendure may require email verification.
      // If verification is required, show success message
      // Otherwise, redirect to login
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      // Error is already set in context
      console.error("Registration error:", err);
    }
  };

  const handleNameChange = (value: string) => {
    const names = value.trim().split(" ");
    if (names.length >= 2) {
      setFirstName(names[0]);
      setLastName(names.slice(1).join(" "));
    } else {
      setFirstName(value);
      setLastName("");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-6">
      <div className="w-full max-w-[500px] bg-white rounded-[50px] shadow-xl p-10 md:p-10 border border-gray-100">

        <div className="text-center mb-6">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">Create Account</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Join the Stalks N Spice community</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-full flex items-center gap-2">
            <CheckCircle className="text-green-600" size={18} />
            <p className="text-green-600 text-sm font-bold">
              Account created successfully! Redirecting to login...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-full flex items-center gap-2">
            <AlertCircle className="text-red-600" size={18} />
            <p className="text-red-600 text-sm font-bold">{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="John Doe"
                value={`${firstName}${lastName ? " " + lastName : ""}`}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                disabled={isLoading}
                className="w-full bg-gray-50 rounded-full px-6 py-4 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#8B2323]/10 border-none disabled:opacity-50"
              />
              <User className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full bg-gray-50 rounded-full px-6 py-4 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#8B2323]/10 border-none disabled:opacity-50"
              />
              <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
                className="w-full bg-gray-50 rounded-full px-6 py-4 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#8B2323]/10 border-none disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={isLoading}
                className="w-full bg-gray-50 rounded-full px-6 py-4 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#8B2323]/10 border-none disabled:opacity-50"
              />
              <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            </div>
            <p className="text-[10px] text-gray-400 ml-4">Minimum 8 characters</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#8B2323] text-white font-bold uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Create Account"} {!isLoading && <ArrowRight size={16} />}
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