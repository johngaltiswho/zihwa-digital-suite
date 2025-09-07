'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gradient-to-t from-black to-gray-900 border-t border-gray-800/50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Logo & Brand */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-light tracking-wide text-white mb-2">
                <span className="neon-glow">Fluvium</span>
              </h3>
              <p className="text-gray-400 text-sm font-light">
                Dream to Live Free
              </p>
            </div>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              Where ancient warrior wisdom meets modern leadership. 
              Your journey to flow begins here.
            </p>
          </div>

          {/* City/Location Availability */}
          <div className="md:col-span-1">
            <h4 className="text-white font-light mb-4">Locations</h4>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm font-light">Bangalore, IN</p>
              <p className="text-cyan-400 text-sm font-light mt-3">
                + Virtual Sessions Available
              </p>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="md:col-span-1">
            <h4 className="text-white font-light mb-4">Stay Connected</h4>
            <p className="text-gray-400 text-sm font-light mb-4">
              Get insights, class updates, and exclusive content.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white text-sm font-light focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                required
              />
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-4 py-3 text-sm font-medium tracking-wider hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 rounded-lg"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Social Links & Terms */}
          <div className="md:col-span-1">
            <h4 className="text-white font-light mb-4">Connect</h4>
            
            {/* Social Links */}
            <div className="flex space-x-4 mb-6">
              <a href="https://www.instagram.com/fluvium" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 transition-all duration-300">
                <span className="text-lg">📷</span>
              </a>
              <a href="https://www.youtube.com/@fluvium4341" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 transition-all duration-300">
                <span className="text-lg">📺</span>
              </a>
            </div>

            {/* Terms & Links */}
            <div className="space-y-2">
              <Link href="/privacy-policy" className="block text-gray-400 hover:text-cyan-400 text-sm font-light transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="block text-gray-400 hover:text-cyan-400 text-sm font-light transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/membership-agreement" className="block text-gray-400 hover:text-cyan-400 text-sm font-light transition-colors duration-300">
                Membership Agreement
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-cyan-400 text-sm font-light transition-colors duration-300">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm font-light mb-4 md:mb-0">
            © 2024 Fluvium. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a href="mailto:info@fluvium.co" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2">
              <span className="text-lg">✉</span>
              info@fluvium.co
            </a>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}