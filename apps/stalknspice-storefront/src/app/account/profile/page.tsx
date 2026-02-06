"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/vendure/auth-context";
import { vendureClient } from "@/lib/vendure/client";
import { UPDATE_CUSTOMER } from "@/lib/vendure/queries/customer";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const { customer, isLoading, isAuthenticated, refreshCustomer } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Initialize form with customer data
  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        phoneNumber: customer.phoneNumber || "",
      });
    }
  }, [customer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear success message when user starts editing
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await vendureClient.request(UPDATE_CUSTOMER, {
        input: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber || null,
        },
      });

      if (response.updateCustomer) {
        // Refresh customer data in auth context
        await refreshCustomer();
        setSuccess(true);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8B2323] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-[#8B2323] hover:text-black font-bold mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Account
          </Link>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            Update your personal information
          </p>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={customer?.emailAddress || ""}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-2">
                Email address cannot be changed through this form
              </p>
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B2323] transition-colors"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B2323] transition-colors"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Phone Number (optional)
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+1 234 567 8900"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B2323] transition-colors"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-bold">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-bold flex items-center gap-2">
                  <CheckCircle size={20} />
                  Profile updated successfully!
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#8B2323] text-white font-bold uppercase tracking-widest py-4 rounded-full hover:bg-black transition-all shadow-xl shadow-[#8B2323]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>Saving Changes...</>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-bold">Account ID:</span> {customer?.id}
              </p>
              <p className="text-gray-600">
                <span className="font-bold">Email:</span> {customer?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
