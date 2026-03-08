'use client';

import Link from 'next/link';
import HumilityDBClient from '@/components/HumilityDBClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/vendure/auth-context';

export default function HumilityDB() {
  const { customer, isAuthenticated, isLoading } = useAuth();
  const isLoaded = true; // For now, just set this to true
  
  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '◯' },
    { id: 'techniques', name: 'Techniques', icon: '▶' },
    { id: 'flow', name: 'Flow Training', icon: '∞' },
    { id: 'reflection', name: 'Reflection', icon: '✎' },
    { id: 'mindset', name: 'Mindset', icon: '⚡' }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />

      {/* Content */}
      <div className="pt-24 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`text-5xl md:text-6xl font-light tracking-wide mb-6 text-white transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              The <span className="neon-glow animate-pulse-glow">Humility</span> Database
            </h1>
            <p className={`text-xl text-gray-400 font-light max-w-3xl mx-auto transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Your personal digital dojo. Where technique meets philosophy, and practice becomes transformation.
            </p>
          </div>

          {!isLoading && !isAuthenticated ? (
            <div className="max-w-xl mx-auto text-center bg-gray-800/40 border border-gray-700/50 rounded-xl p-8">
              <p className="text-gray-300 mb-6">
                Sign in to access your Humility DB dashboard, upload videos, and track progress.
              </p>
              <Link
                href="/account"
                className="inline-block bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-6 py-3 rounded-lg font-medium tracking-wide hover:from-cyan-500 hover:to-purple-600 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <HumilityDBClient customer={customer} tabs={tabs} />
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
