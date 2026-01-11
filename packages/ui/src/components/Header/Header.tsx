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

      {/* PREMIUM MOBILE SIDEBAR MENU */}
      {isMenuOpen && (
        <>
          {/* BACKDROP */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(17, 24, 39, 0.8)', // Using AACP gray-900 with transparency
              zIndex: 9998,
              backdropFilter: 'blur(4px)'
            }}
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* SIDEBAR */}
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '320px',
            height: '100vh',
            background: '#111827', // Using AACP brand gray-900
            zIndex: 9999,
            boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.3)',
            overflowY: 'auto',
            animation: 'slideIn 0.3s ease-out'
          }}>
            {/* SIDEBAR HEADER */}
            <div style={{
              padding: '32px 24px 24px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                AACP Infrastructure
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* NAVIGATION ITEMS */}
            <div style={{ padding: '24px 0' }}>
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={index}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px 24px',
                      color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: isActive ? '700' : '500',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      borderLeft: isActive ? '4px solid #ffffff' : '4px solid transparent',
                      transition: 'all 0.2s ease',
                      marginBottom: '4px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                        e.target.style.paddingLeft = '32px';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.paddingLeft = '24px';
                      }
                    }}
                  >
                    <span style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                      marginRight: '12px',
                      transition: 'all 0.2s ease'
                    }}></span>
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* FOOTER */}
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              right: '24px',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '16px'
            }}>
              Building Excellence Together
            </div>
          </div>

          <style jsx global>{`
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </>
      )}
    </header>
  );
}