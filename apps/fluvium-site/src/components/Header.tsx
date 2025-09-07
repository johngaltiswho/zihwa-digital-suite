'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
          <a href="/#about" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">About</a>
          <a href="/#offerings" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">Offerings</a>
          <Link href="/humility-db" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">Humility DB</Link>
          <Link href="/shop-maintenance" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">Shop</Link>
          <a href="/#founder" className="text-gray-300 hover:text-white transition-colors duration-300 font-light">Founder</a>
          <button className="neon-border bg-transparent text-white px-6 py-2 text-sm font-light tracking-wider hover:bg-cyan-400/10 transition-all duration-300">
            Join the Tribe
          </button>
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