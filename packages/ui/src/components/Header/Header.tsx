"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  navItems: NavItem[];
  logoSrc: string;
}

export function SharedHeader({ navItems, logoSrc }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sh-container">
      <div className="sh-main-content">
        {/* LOGO */}
        <Link href="/" className="sh-logo-link">
          <Image
            src={logoSrc}
            alt="Logo"
            width={100}
            height={28}
            priority
            className="sh-logo-img"
          />
        </Link>

        {/* DESKTOP NAV (Hidden on Mobile) */}
        <nav className="sh-desktop-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sh-nav-link ${isActive ? "sh-nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* SANDWICH BUTTON (Visible only on Mobile) */}
        <button 
          className="sh-mobile-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE OVERLAY MENU (Hidden on Desktop) */}
      <div className={`sh-mobile-overlay ${isMenuOpen ? "active" : ""}`}>
        <nav className="sh-mobile-list">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sh-mobile-item ${pathname === item.href ? "active" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}