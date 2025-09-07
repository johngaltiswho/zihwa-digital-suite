'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link href="/" className="logo">Pars Optima Enterprises LLP</Link>
          <ul className="nav-links">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/brands">Our Brands</Link></li>
            <li><Link href="/operations">Operations</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <ul className="mobile-nav-links">
              <li><Link href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link></li>
              <li><Link href="/brands" onClick={() => setMobileMenuOpen(false)}>Our Brands</Link></li>
              <li><Link href="/operations" onClick={() => setMobileMenuOpen(false)}>Operations</Link></li>
              <li><Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}