"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { vendureClient } from "@/lib/vendure/client";
import { VERIFY_CUSTOMER_ACCOUNT } from "@/lib/vendure/mutations/auth";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

// 1. Logic moved into a Content component
function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    const verifyAccount = async () => {
      try {
        const data = await vendureClient.request(VERIFY_CUSTOMER_ACCOUNT, { token });

        if (data.verifyCustomerAccount.__typename === "CurrentUser") {
          setStatus("success");
          setMessage("Your email has been verified successfully! You can now log in.");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(
            data.verifyCustomerAccount.message || "Verification failed. The token may be invalid or expired."
          );
        }
      } catch (err: any) {
        setStatus("error");
        setMessage("An error occurred during verification. Please try again.");
        console.error("Verification error:", err);
      }
    };

    verifyAccount();
  }, [searchParams, router]);

  return (
    <div className="w-full max-w-[500px] bg-white rounded-[50px] shadow-xl shadow-gray-200/50 p-10 border border-gray-100 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-16 h-16 text-[#8B2323] animate-spin mx-auto mb-6" />
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">
            Verifying Your Email
          </h1>
          <p className="text-gray-500 text-sm">Please wait while we verify your account...</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">
            Verification Successful!
          </h1>
          <p className="text-gray-600 text-sm mb-6">{message}</p>
          <p className="text-gray-400 text-xs">Redirecting to login...</p>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">
            Verification Failed
          </h1>
          <p className="text-gray-600 text-sm mb-8">{message}</p>
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-[#8B2323] text-white font-bold uppercase tracking-widest py-4 rounded-full hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20"
            >
              Go to Login
            </Link>
            <Link
              href="/register"
              className="block w-full border-2 border-gray-300 text-gray-700 font-bold uppercase tracking-widest py-4 rounded-full hover:border-[#8B2323] hover:text-[#8B2323] transition-all"
            >
              Register New Account
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

// 2. Main Page export wraps content in Suspense
export default function VerifyPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Suspense fallback={
        <div className="w-full max-w-[500px] bg-white rounded-[50px] p-10 text-center">
           <Loader2 className="w-16 h-16 text-[#8B2323] animate-spin mx-auto mb-6" />
           <p className="text-gray-500">Checking verification status...</p>
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </section>
  );
}