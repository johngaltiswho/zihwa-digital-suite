'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { retrieveCustomer, signout } from "@/lib/medusa-lib/data/customer";
import { HttpTypes } from "@medusajs/types";

export default function AuthButton() {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customerData = await retrieveCustomer();
        setCustomer(customerData);
      } catch (error) {
        console.error('Error fetching customer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  const handleSignOut = async () => {
    try {
      await signout('in'); // Using 'in' as default country code
      setCustomer(null);
      window.location.reload(); // Refresh to update auth state
    } catch (error) {
      console.error('Error signing out:', error);
    }
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