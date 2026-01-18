'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// TODO: Replace with Vendure customer type
interface Customer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export default function AuthButton() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);

  // TODO: Replace with Vendure authentication
  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSignOut = async () => {
    // TODO: Implement Vendure sign out
    setCustomer(null);
    window.location.reload();
  };

  if (loading) {
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
          Welcome, {customer.first_name || customer.email}
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
