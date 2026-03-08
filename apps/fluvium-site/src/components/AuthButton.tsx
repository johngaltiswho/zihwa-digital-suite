'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/vendure/auth-context';

export default function AuthButton() {
  const { customer, isLoading, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="neon-border bg-transparent text-white px-6 py-2 text-sm font-light tracking-wider">
        Loading...
      </div>
    );
  }

  if (customer) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-gray-300 text-sm">
          Welcome, {customer.firstName || customer.emailAddress}
        </span>
        <button
          onClick={handleSignOut}
          className="neon-border bg-transparent text-white px-6 py-2 text-sm font-light tracking-wider hover:bg-cyan-400/10 transition-all duration-300"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <Link href="/account">
      <button className="neon-border bg-transparent text-white px-6 py-2 text-sm font-light tracking-wider hover:bg-cyan-400/10 transition-all duration-300">
        Sign In
      </button>
    </Link>
  );
}
