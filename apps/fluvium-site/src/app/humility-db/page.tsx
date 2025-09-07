import Image from 'next/image';
import Link from 'next/link';
import { retrieveCustomer } from "@/lib/medusa-lib/data/customer";
import AuthButton from '@/components/AuthButton';
import HumilityDBClient from '@/components/HumilityDBClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function HumilityDB() {
  const customer = await retrieveCustomer().catch(() => null);
  const isLoaded = true; // For now, just set this to true
  const activeTab = 'dashboard'; // Default tab
  
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

          {/* Client Component */}
          <HumilityDBClient customer={customer} tabs={tabs} />
        </div>
      </div>
      <Footer />
    </main>
  );
}