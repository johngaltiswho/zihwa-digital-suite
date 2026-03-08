'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthButton from '@/components/AuthButton';

export default function Header() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-gray-800/30">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Fluvium Brand */}
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link href="/">
            <h3 className="text-2xl font-light tracking-wide text-white hover:text-cyan-400 transition-colors duration-300">
              <span className="neon-glow">Fluvium</span>
            </h3>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={`hidden md:flex items-center space-x-8 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link href="/#about" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">About</Link>
          <Link href="/#offerings" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">Offerings</Link>
          <Link href="/humility-db" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">Humility DB</Link>
          <Link href="/shop-maintenance" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">Shop</Link>
          <Link href="/#founder" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">Founder</Link>
          <AuthButton />
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
