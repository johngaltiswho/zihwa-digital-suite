import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-dark border-t border-neutral-medium">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Logo and Copyright */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <Link href="/" className="text-xl font-bold text-primary">
              <span className="accent-orange">Invero</span>
            </Link>
            <p className="text-sm text-secondary">
              © {currentYear} Invero. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <Link
              href="/privacy"
              className="text-sm text-secondary hover:text-primary transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-secondary hover:text-primary transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-sm text-secondary hover:text-primary transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-sm text-secondary">
            <a
              href="mailto:contact@invero.com"
              className="hover:text-primary transition-colors duration-200"
            >
              contact@invero.com
            </a>
            <span className="hidden md:inline">|</span>
            <a
              href="tel:+1-555-0123"
              className="hover:text-primary transition-colors duration-200"
            >
              +1 (555) 012-3456
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};