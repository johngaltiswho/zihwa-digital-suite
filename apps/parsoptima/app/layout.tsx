"use client"; // Required for useState

import React, { useState } from "react";
import "./globals.css";
import { ParsOptimaHeader, ParsOptimaFooter } from "@repo/ui";
import CartSidebar from "./components/CartSidebar";

// IMPORTANT: Metadata has been removed from here. 
// You must paste it into your app/page.tsx (see step below).

const navLinks = [
  { label: "Medicines", href: "/medicines" },
  { label: "Beauty & Cosmetics", href: "/beauty" },
  { label: "Wellness & Nutrition", href: "/wellness" },
  { label: "Fitness & Health", href: "/fitness" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <html lang="en">
      <body className="antialiased font-sans bg-[#fcfdfe]">
        
        {/* We wrap the header to detect clicks on the cart icon */}
        <div onClick={(e) => {
          const target = e.target as HTMLElement;
          // This looks for the link with /cart and opens the sidebar instead
          if (target.closest('a[href="/cart"]')) {
            e.preventDefault();
            setIsCartOpen(true);
          }
        }}>
          <ParsOptimaHeader 
            logoSrc="/Logo_NoBG.png" 
            navItems={navLinks} 
          />
        </div>

        {children}

        {/* Global Cart Sidebar controlled by the state above */}
        <CartSidebar 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
        />

        <ParsOptimaFooter />
      </body>
    </html>
  );
}