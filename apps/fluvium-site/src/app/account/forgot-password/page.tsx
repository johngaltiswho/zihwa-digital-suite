'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/vendure/auth-context';

export default function ForgotPasswordPage() {
  const { requestPasswordReset, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    clearError();
    setNotice(null);

    try {
      await requestPasswordReset(email);
      setNotice('If an account exists for this email, a reset link has been sent.');
    } catch {
      // Error state is handled by auth context.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />
      <div className="pt-28 px-6 pb-16">
        <div className="max-w-md mx-auto bg-gray-800/40 border border-gray-700/50 rounded-xl p-8">
          <h1 className="text-3xl font-light text-white mb-3">Forgot Password</h1>
          <p className="text-gray-400 mb-6">Enter your email to receive a password reset link.</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-gray-900/60 border border-gray-700 rounded-lg px-4 py-3 text-white"
              required
            />
            {notice ? <p className="text-green-400 text-sm">{notice}</p> : null}
            {error ? <p className="text-red-400 text-sm">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-4 py-3 rounded-lg font-medium disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-5 text-sm text-gray-400">
            <Link href="/account" className="text-cyan-400 hover:text-cyan-300">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
