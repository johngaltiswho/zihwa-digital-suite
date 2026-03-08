'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/vendure/auth-context';
import type { RegisterCustomerInput } from '@/lib/vendure/types';

export default function AccountPage() {
  const { customer, isAuthenticated, isLoading, login, register, logout, error, clearError } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    clearError();
    setNotice(null);

    try {
      if (mode === 'signin') {
        await login(email, password, true);
      } else {
        const input: RegisterCustomerInput = {
          emailAddress: email,
          password,
          ...(firstName ? { firstName } : {}),
          ...(lastName ? { lastName } : {}),
        };
        await register(input);
        setNotice('Account created. You can now sign in.');
        setMode('signin');
      }
    } catch {
      // Error is already handled in auth context state.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />
      <div className="pt-28 px-6 pb-16">
        <div className="max-w-md mx-auto bg-gray-800/40 border border-gray-700/50 rounded-xl p-8">
          <h1 className="text-3xl font-light text-white mb-3">Account</h1>
          <p className="text-gray-400 mb-6">Sign in or create a Vendure customer account.</p>

          {isLoading ? (
            <p className="text-gray-300">Checking session...</p>
          ) : isAuthenticated && customer ? (
            <div className="space-y-4">
              <p className="text-gray-200">
                Signed in as <span className="text-cyan-400">{customer.emailAddress}</span>
              </p>
              <div className="flex gap-3">
                <Link
                  href="/humility-db"
                  className="flex-1 text-center bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-4 py-3 rounded-lg font-medium"
                >
                  Open Humility DB
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="flex-1 neon-border bg-transparent text-white px-4 py-3 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="flex rounded-lg border border-gray-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    clearError();
                    setNotice(null);
                  }}
                  className={`flex-1 py-2 text-sm ${mode === 'signin' ? 'bg-cyan-500 text-black' : 'bg-gray-900/60 text-gray-300'}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    clearError();
                    setNotice(null);
                  }}
                  className={`flex-1 py-2 text-sm ${mode === 'signup' ? 'bg-cyan-500 text-black' : 'bg-gray-900/60 text-gray-300'}`}
                >
                  Sign Up
                </button>
              </div>
              {mode === 'signup' ? (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full bg-gray-900/60 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full bg-gray-900/60 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>
              ) : null}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-gray-900/60 border border-gray-700 rounded-lg px-4 py-3 text-white"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-gray-900/60 border border-gray-700 rounded-lg px-4 py-3 text-white"
                required
              />
              {mode === 'signin' ? (
                <div className="text-right -mt-2">
                  <Link href="/account/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300">
                    Forgot password?
                  </Link>
                </div>
              ) : null}
              {notice ? <p className="text-green-400 text-sm">{notice}</p> : null}
              {error ? <p className="text-red-400 text-sm">{error}</p> : null}
              {error?.includes('No Channel with the token') ? (
                <p className="text-amber-300 text-xs">
                  Configure `NEXT_PUBLIC_VENDURE_CHANNEL_TOKEN` to a valid token, or create the `fluvium` channel in Vendure Admin.
                </p>
              ) : null}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-4 py-3 rounded-lg font-medium disabled:opacity-60"
              >
                {submitting ? (mode === 'signin' ? 'Signing in...' : 'Creating account...') : mode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
