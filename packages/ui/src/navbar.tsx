import React from 'react';

interface NavbarProps {
  brandName?: string;
  className?: string;
}

export const Navbar = ({ brandName = "Brand Name", className = "" }: NavbarProps) => (
  <nav className={`bg-black text-white px-4 py-2 ${className}`}>
    <h1 className="text-lg font-semibold">{brandName}</h1>
  </nav>
);