"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { vendureClient } from "@/lib/vendure/client";
import { RESET_PASSWORD } from "@/lib/vendure/mutations/auth";
import { Lock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

export default function PasswordResetPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const data = await vendureClient.request(RESET_PASSWORD, {
        token,
        password,
      });

      if (data.resetPassword.__typename === "CurrentUser") {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.resetPassword.message || "Password reset failed. The token may be invalid or expired.");
      }
    } catch (err: any) {
      setError("An error occurred. Please try again.");
      console.error("Password reset error:", err);
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
            Password Reset Successful!
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Your password has been reset. You can now log in with your new password.
          </p>
          <p className="text-gray-400 text-xs">Redirecting to login...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-[500px] bg-white rounded-[50px] shadow-xl shadow-gray-200/50 p-10 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">
            Reset Password
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            Enter your new password
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-full flex items-center gap-2">
            <AlertCircle className="text-red-600" size={18} />
            <p className="text-red-600 text-sm font-bold">{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">
              New Password
            </label>
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
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? "Resetting Password..." : "Reset Password"}{" "}
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </section>
  );
}
