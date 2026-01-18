"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { vendureClient } from "@/lib/vendure/client";
import { UPDATE_CUSTOMER_EMAIL } from "@/lib/vendure/mutations/auth";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailChangePage() {
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

    const verifyEmailChange = async () => {
      try {
        const data = await vendureClient.request(UPDATE_CUSTOMER_EMAIL, { token });

        if (data.updateCustomerEmailAddress.__typename === "Success") {
          setStatus("success");
          setMessage("Your email address has been updated successfully! Please log in with your new email.");
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(
            data.updateCustomerEmailAddress.message ||
              "Email update failed. The token may be invalid or expired."
          );
        }
      } catch (err: any) {
        setStatus("error");
        setMessage("An error occurred during email verification. Please try again.");
        console.error("Email verification error:", err);
      }
    };

    verifyEmailChange();
  }, [searchParams, router]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-[500px] bg-white rounded-[50px] shadow-xl shadow-gray-200/50 p-10 border border-gray-100 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-[#8B2323] animate-spin mx-auto mb-6" />
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">
              Verifying Email Change
            </h1>
            <p className="text-gray-500 text-sm">Please wait while we update your email address...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">
              Email Updated!
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
                href="/account"
                className="block w-full bg-[#8B2323] text-white font-bold uppercase tracking-widest py-4 rounded-full hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20"
              >
                Go to Account
              </Link>
              <Link
                href="/login"
                className="block w-full border-2 border-gray-300 text-gray-700 font-bold uppercase tracking-widest py-4 rounded-full hover:border-[#8B2323] hover:text-[#8B2323] transition-all"
              >
                Go to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
