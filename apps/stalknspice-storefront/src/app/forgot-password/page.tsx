"use client";

import { useState } from "react";
import { vendureClient } from "@/lib/vendure/client";
import { REQUEST_PASSWORD_RESET } from "@/lib/vendure/mutations/auth";
import { Mail, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await vendureClient.request(REQUEST_PASSWORD_RESET, {
        emailAddress: email,
      });

      if (data.requestPasswordReset.__typename === "Success") {
        setSuccess(true);
      } else {
        setError(data.requestPasswordReset.message || "Failed to send reset email.");
      }
    } catch (err: any) {
      setError("An error occurred. Please try again.");
      console.error("Password reset request error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-[500px] bg-white rounded-[50px] shadow-xl shadow-gray-200/50 p-10 border border-gray-100 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">
            Check Your Email
          </h1>
          <p className="text-gray-600 text-sm mb-8">
            We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and
            follow the instructions.
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#8B2323] text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20"
          >
            Back to Login
          </Link>
          <p className="text-gray-400 text-xs mt-6">
            In dev mode, check{" "}
            <a
              href="http://localhost:3002/mailbox"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8B2323] underline"
            >
              mailbox
            </a>{" "}
            for the reset link
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-[500px] bg-white rounded-[50px] shadow-xl shadow-gray-200/50 p-10 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            Enter your email to reset
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-full flex items-center gap-2">
            <AlertCircle className="text-red-600" size={18} />
            <p className="text-red-600 text-sm font-bold">{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full bg-gray-50 rounded-full px-6 py-4 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#8B2323]/10 border-none disabled:opacity-50"
              />
              <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#8B2323] text-white font-bold uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Reset Link"} {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Remember your password?{" "}
            <Link href="/login" className="text-[#8B2323] hover:underline font-black">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
