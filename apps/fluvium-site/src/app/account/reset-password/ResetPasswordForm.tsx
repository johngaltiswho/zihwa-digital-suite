'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/vendure/auth-context';

interface ResetPasswordFormProps {
  initialToken: string;
}

export default function ResetPasswordForm({ initialToken }: ResetPasswordFormProps) {
  const { resetPassword, error, clearError } = useAuth();

  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    clearError();
    setNotice(null);
    setLocalError(null);

    if (!token.trim()) {
      setLocalError('Reset token is required.');
      setSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      setSubmitting(false);
      return;
    }

    try {
      await resetPassword(token.trim(), password);
      setNotice('Password reset successful. You are now signed in.');
    } catch {
      // Error state is handled by auth context.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800/40 border border-gray-700/50 rounded-xl p-8">
      <h1 className="text-3xl font-light text-white mb-3">Reset Password</h1>
      <p className="text-gray-400 mb-6">Set a new password using your reset token.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Reset token"
          className="w-full bg-gray-900/60 border border-gray-700 rounded-lg px-4 py-3 text-white"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full bg-gray-900/60 border border-gray-700 rounded-lg px-4 py-3 text-white"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full bg-gray-900/60 border border-gray-700 rounded-lg px-4 py-3 text-white"
          required
        />
        {notice ? <p className="text-green-400 text-sm">{notice}</p> : null}
        {localError ? <p className="text-red-400 text-sm">{localError}</p> : null}
        {error ? <p className="text-red-400 text-sm">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-4 py-3 rounded-lg font-medium disabled:opacity-60"
        >
          {submitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <div className="mt-5 text-sm text-gray-400">
        <Link href="/account" className="text-cyan-400 hover:text-cyan-300">
          Back to account
        </Link>
      </div>
    </div>
  );
}
