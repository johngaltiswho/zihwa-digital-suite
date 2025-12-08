'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cuisines = [
    'Indian', 'Italian', 'Mexican', 'Thai', 'Chinese', 
    'Mediterranean', 'Middle Eastern', 'Korean', 'Japanese'
  ];

  const categories = [
    'Spices & Herbs', 'Oils & Vinegars', 'Sauces & Condiments',
    'Grains & Pulses', 'Nuts & Dried Fruits', 'Tea & Coffee'
  ];

  return (
    <header className="bg-white shadow-xl sticky top-0 z-50 border-b border-orange-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white py-3">
        <div className="sns-container">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 hover:text-orange-200 transition-colors duration-200">
                <span className="text-lg">📞</span>
                <span className="font-medium">+91-9876543210</span>
              </div>
              <div className="flex items-center gap-2 hover:text-orange-200 transition-colors duration-200">
                <span className="text-lg">📧</span>
                <span className="font-medium">hello@stalknspice.com</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/wholesale" className="flex items-center gap-1 hover:text-orange-200 transition-colors duration-200 font-medium">
                <span>💼</span>
                Wholesale
              </Link>
              <Link href="/track-order" className="flex items-center gap-1 hover:text-orange-200 transition-colors duration-200 font-medium">
                <span>📦</span>
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="sns-container py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-105 transition-transform duration-300 animate-pulse-glow">
              S&S
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                Stalks N Spice
              </h1>
              <p className="text-sm font-medium text-gray-600">Premium International Ingredients</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                🔍
              </div>
              <input
                type="text"
                placeholder="Search for premium spices, exotic ingredients, trusted brands..."
                className="w-full pl-12 pr-4 py-4 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-orange-50/50 text-gray-900 placeholder-gray-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-2 rounded-xl font-bold transition-all duration-200 hover:scale-105 shadow-lg">
                Search
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link href="/account" className="hidden md:flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors duration-200 group">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                <span className="text-xl">👤</span>
              </div>
              <span className="font-medium">Account</span>
            </Link>
            
            <Link href="/cart" className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors duration-200 group relative">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200 relative">
                <span className="text-xl">🛒</span>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse-glow">
                  0
                </span>
              </div>
              <span className="hidden md:inline font-medium">Cart</span>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center hover:bg-orange-200 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-gray-50 border-t border-gray-200">
        <div className="sns-container">
          <div className="hidden md:flex items-center justify-between py-3">
            <div className="flex items-center gap-8">
              <div className="relative group">
                <button className="flex items-center gap-1 text-gray-700 hover:text-orange-600 font-medium">
                  Shop by Cuisines
                  <span className="text-sm">▼</span>
                </button>
                {/* Cuisines Dropdown */}
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {cuisines.map((cuisine) => (
                    <Link
                      key={cuisine}
                      href={`/shop/cuisine/${cuisine.toLowerCase()}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      {cuisine}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center gap-1 text-gray-700 hover:text-orange-600 font-medium">
                  Categories
                  <span className="text-sm">▼</span>
                </button>
                {/* Categories Dropdown */}
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/shop/category/${category.toLowerCase().replace(/\\s+/g, '-')}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/brands" className="text-gray-700 hover:text-orange-600 font-medium">
                Brands
              </Link>
              <Link href="/recipes" className="text-gray-700 hover:text-orange-600 font-medium">
                Recipes
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-600 font-medium">
                About
              </Link>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-600 font-medium">🚚 45min Delivery</span>
              <span className="text-orange-600 font-medium">📦 Single Basket</span>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="py-4 space-y-2">
              <Link href="/shop" className="block px-4 py-2 text-gray-700">Shop</Link>
              <Link href="/cuisines" className="block px-4 py-2 text-gray-700">Cuisines</Link>
              <Link href="/categories" className="block px-4 py-2 text-gray-700">Categories</Link>
              <Link href="/brands" className="block px-4 py-2 text-gray-700">Brands</Link>
              <Link href="/recipes" className="block px-4 py-2 text-gray-700">Recipes</Link>
              <Link href="/about" className="block px-4 py-2 text-gray-700">About</Link>
              <Link href="/wholesale" className="block px-4 py-2 text-gray-700">Wholesale</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}