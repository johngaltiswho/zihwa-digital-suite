"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, Search, User, Heart, X,
  ChefHat, PhoneCall, MapPin, Tag, ShoppingCart, 
  ChevronRight, ChevronDown 
} from "lucide-react"; 

// --- MEGA MENU DATA ---
const MEGA_MENU_DATA: Record<string, { products: string[], brands: string[], promoTitle: string }> = {
  "BAKERY, SNACKS & DRY FRUITS": {
    products: ["Baking & Custard Powder", "Chocolate & Caramel Sauces", "Dry Yeast & Bread Improver", "Tutti Fruiti & Agar Agar", "Bread Crumbs", "Cocoa Powder", "Essence", "Choco Chips", "Dry Fruits", "Marmalades & Jams"],
    brands: ["2M COCOA", "BUSH", "BARRY CALLEBAUT", "HERSHEY'S", "BAKERS", "MALA'S"],
    promoTitle: "DESERT SYRUPS & TOPPINGS"
  },
  "BREAKFAST, DAIRY & FROZEN FOOD": {
    products: ["Almond, Coconut & Soy Milk", "Caffeine", "Desert Syrups & Sauces", "Frozen Fast Food", "Beans, Corn & Peas", "Cereals", "Ghee & Condensed Milk", "Spreads", "Butter, Cheese & Paneer", "Cooking Cream"],
    brands: ["ABBIE'S", "CHAYAM", "MCCAIN", "SOFIT", "AMERICAN GARDEN", "DAIRY CRAFT", "NUTELLA", "AMUL", "HERSHEY'S", "RICH"],
    promoTitle: "DIPS & FRUITY MARMALADES"
  },
  "CANNED FOODS": {
    products: ["Artichokes & Asparagus", "Cherry, Litchi & Pears", "Gherkins & Jalapeno", "Olives & Capers", "Paste", "Thai Cooking Paste", "Bamboo Shoots", "Coconut Products", "Mango & Pineapple", "Soups & Stews", "Water Chestnuts"],
    brands: ["FRESHO'S", "LEE KUM KEE", "NAMJAI", "WOH HUP", "GOLDEN CROWN", "NANI KI BARNI", "REAL THAI", "HABIT", "TOPPS"],
    promoTitle: "AUTHENTIC CANNED SELECTION"
  },
  "FRUITS & VEGETABLES": {
    products: ["Beans & Brinjals", "Potato, Onion & Tomato", "Kiwi, Melon & Citrus", "Coconut", "Cucumber, Capsicum & Okra", "Root Vegetables", "Apples & Pomegranate", "Gourd, Pumpkin & Drumstick", "Herbs & Seasoning", "Banana, Sapota & Papaya"],
    brands: ["FRESH SELECTION", "ORGANIC FARMS", "IMPORTED DIRECT"],
    promoTitle: "FRESH FROM THE FARM"
  },
  "HEALTH STORE": {
    products: ["Apple Cider Vinegar", "Milk Alternatives", "Tofu", "Cereal", "Organic Foods", "Specialty Tea's", "Juices", "Quinoa"],
    brands: ["CHAYAM", "SOFIT", "ORGANIC INDIA", "BRAGG"],
    promoTitle: "ESSENTIAL ORGANIC BLENDS"
  },
  "HERBS, SPICES & PROVISIONS": {
    products: ["Aromatic Powders", "Cooking Paste", "Food Colour", "Herbs & Seasonings", "Sprinklers", "Wasabi", "Blended Masalas", "Dals & Pulses", "Grains & Flour", "Whole Spices", "Marinades", "Salt & Pepper", "Sugar"],
    brands: ["AACHI", "MAGGI", "NAMJAI", "BUSH", "KEYA", "MDH", "KNORR", "TRUST SUGARS"],
    promoTitle: "ORGANIC SPICES & SEASONING"
  },
  "BEVERAGES": {
    products: ["Aromatic Bitters", "Energy & Soft Drinks", "Syrup", "Water", "Crushes", "Juices", "Tea", "Puree", "Coffee", "Squashes", "Toppings"],
    brands: ["COCA COLA", "MANAMA", "DABUR REAL", "MY FAVOURITE", "MALA'S", "MONIN"],
    promoTitle: "HEALTHY FRUIT JUICES"
  },
  "RICE, PASTA & NOODLES": {
    products: ["Arborio & Carnaroli Rice", "Indian Rice", "Penne & Macaroni", "Rice Paper & Nori", "Spring Roll Pastry", "Cup Noodles", "Jasmine Rice", "Quinoa & Cous Cous", "Soba & Udon", "Sticky Rice", "Glass Noodles", "Lasagne", "Pad Thai", "Linguine", "Whole Wheat Pasta"],
    brands: ["BARILLA", "HABIT", "COLAVITA", "NONGSHIM", "DAAWAT", "REAL THAI"],
    promoTitle: "PREMIUM PASTA & NOODLES"
  },
  "SAUCES & PASTES": {
    products: ["Barbeque & Mustard", "Chilli Garlic", "Ginger & Garlic Paste", "Mayonaise", "Seasoning Sauce", "Tomato Ketchup", "Hoisin & Plum Sauce", "Chilli in Oil", "HP & XO Sauce", "Pizza & Pasta Sauce", "Soy & Worcestershire", "Vinegar", "Lemon Sauce", "Szechuan & Teriyaki"],
    brands: ["AMERICAN GARDEN", "KIKKOMAN", "REAL THAI", "GOLDEN CROWN", "LEE KUM KEE", "TABASCO", "HEINZ", "MY FAVOURITE", "WOH HUP"],
    promoTitle: "SAUCES FOR ALL MOODS"
  },
  "OILS & GHEE": {
    products: ["Apple Cider & Coconut Vinegar", "Honey", "Mirin & Cooking Sake", "Synthetic Vinegar", "Balsamic & Wine Vinegar", "Keora & Rose Water", "Olive & Almond Oil", "Chinese Cooking Vinegar", "Mustard & Sesame Oil", "Salad & Sunflower Oil"],
    brands: ["ABBIES", "DE NIGRIS", "COLAVITA", "DOUBLE PAGODA", "DABUR", "PIETRO CORICELLI"],
    promoTitle: "PURE OILS & VINEGARS"
  }
};

interface NavItem { label: string; href: string; }
interface Customer {
  firstName: string;
  lastName: string;
  emailAddress: string;
}
interface HeaderProps {
  navItems: NavItem[];
  logoSrc: string;
  isEcommerce?: boolean;
  customer?: Customer | null;
  onLogout?: () => void;
}

// --- 1. SHARED HEADER (FOR OTHER APPS) ---
export function SharedHeader({ navItems, logoSrc }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="h-[70px] bg-white border-b" />;

  return (
    <header className="sh-container">
      <div className="sh-main-content">
        <Link href="/" className="sh-logo-link">
          <Image src={logoSrc} alt="Logo" width={100} height={28} priority className="sh-logo-img" />
        </Link>
        <nav className="sh-desktop-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`sh-nav-link ${pathname === item.href ? "sh-nav-link-active" : ""}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button className="sh-mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? "✕" : "☰"}</button>
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

// --- 2. STALKS N SPICE HEADER ---
export function StalksHeader({ navItems, logoSrc, isEcommerce = true, customer, onLogout }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    setMounted(true); 
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsLocked(false);
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return <div className="w-full h-[180px] bg-white border-b" />;

  const handleToggle = (label: string) => {
    if (activeMenu === label && isLocked) {
      setIsLocked(false);
      setActiveMenu(null);
    } else {
      setActiveMenu(label);
      setIsLocked(true);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 font-sans sticky top-0 z-[100]">
      
      {/* ========================================== */}
      {/* DESKTOP HEADER SECTION    */}
      {/* ========================================== */}
      <div className="hidden lg:block">
        {/* ROW 1: Utility Bar */}
        <div className="bg-white border-b border-gray-50">
          <div className="max-w-[1400px] mx-auto px-16 h-14 flex justify-end items-center space-x-6 text-[13px] font-medium text-gray-900">
            <Link href="/recipes" className="flex items-center hover:text-red-800 transition-colors"><ChefHat size={18} className="mr-1.5 text-gray-400" /> Recipe's</Link>
            <Link href="/contact" className="flex items-center hover:text-red-800 transition-colors"><PhoneCall size={16} className="mr-1.5 text-gray-400" /> Contact Us</Link>
            <Link href="/tracking" className="flex items-center hover:text-red-800 transition-colors"><MapPin size={16} className="mr-1.5 text-gray-400" /> Tracking</Link>
            <Link href="/offers" className="flex items-center hover:text-red-800 transition-colors"><Tag size={16} className="mr-1.5 text-gray-400" /> Offers</Link>
            <Link href="/wishlist" className="flex items-center hover:text-red-800 transition-colors"><Heart size={16} className="mr-1.5 text-gray-400" /> Wishlist</Link>

            {/* Dynamic Auth Links */}
            {customer ? (
              <>
                <span className="flex items-center text-gray-600"><User size={16} className="mr-1.5 text-gray-400" /> Hi, {customer.firstName}</span>
                <Link href="/account" className="flex items-center hover:text-red-800 transition-colors font-bold">Account</Link>
                <button onClick={onLogout} className="flex items-center hover:text-red-800 transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link href="/register" className="flex items-center hover:text-red-800 transition-colors"><User size={16} className="mr-1.5 text-gray-400" /> Register</Link>
                <Link href="/login" className="flex items-center hover:text-red-800 transition-colors"><User size={16} className="mr-1.5 text-gray-400" /> Login</Link>
              </>
            )}
          </div>
        </div>

        {/* ROW 2: Sidebar Toggle, Logo & Search */}
        <div className="max-w-[1400px] mx-auto px-6 h-10 flex items-center justify-between gap-8">
          <div className="flex items-center space-x-6 flex-shrink-0">
            {/* Sidebar button restored for Desktop */}
            <button onClick={() => setIsMenuOpen(true)} className="p-1 hover:bg-gray-100 rounded transition-colors">
              <Menu size={30} />
            </button>
            <Link href="/" className="block -mt-4">
              <Image src={logoSrc} alt="Logo" width={240} height={55} priority className="object-contain" />
            </Link>
          </div>
          <div className="flex-1 max-w-5xl">
            <div className="relative group">
              <input type="text" placeholder="Search products" className="w-full h-10 px-5 pr-12 border border-gray-300 rounded-full focus:outline-none focus:border-red-800 text-sm" />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 " size={20} />
            </div>
          </div>
          {/* <div className="flex items-center space-x-6">
            <Link href="/login" className="text-gray-800 hover:text-red-800 transition-colors"><User size={28} /></Link>
            <Link href="/cart" className="text-gray-800 hover:text-red-800 transition-colors relative">
              <ShoppingCart size={28} />
              <span className="absolute -top-1 -right-1 bg-red-800 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">0</span>
            </Link>
          </div> */}
        </div>

        {/* ROW 3: Categories Navigation */}
        <nav ref={navRef} className="border-t border-gray-50 relative">
          <div className="max-w-[1400px] mx-auto px-6">
            <ul className="flex flex-wrap justify-center items-center gap-x-5 py-2 text-[16px] font-semibold text-gray-800 uppercase tracking-tight">
              {navItems.map((item) => {
                const isCurrentlyActive = activeMenu === item.label;
                const megaMenuKey = item.label.toUpperCase();
                return (
                  <li 
                    key={item.href} 
                    onMouseEnter={() => !isLocked && setActiveMenu(item.label)}
                    onMouseLeave={() => !isLocked && setActiveMenu(null)}
                    className="py-2 cursor-pointer"
                  >
                    <button
                      onClick={() => handleToggle(item.label)}
                      className={`flex items-center font-bold gap-1.5 transition-all py-1 pb-2 border-b-2 ${isCurrentlyActive || pathname === item.href ? "text-red-800 border-red-800" : "border-transparent hover:text-red-800"}`}
                    >
                      {item.label}
                      <ChevronDown size={14} className={`transition-transform duration-300 ${isCurrentlyActive ? 'rotate-180' : 'rotate-0'}`} />
                    </button>

                    {/* MEGA MENU DRAWER CODE REMAINS THE SAME... */}
                    {isCurrentlyActive && MEGA_MENU_DATA[megaMenuKey] && (
                        <div className="absolute left-0 top-full w-full bg-white shadow-[0_35px_90px_-20px_rgba(0,0,0,0.25)] border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200 z-[110]">
                          <div className="max-w-[1400px] mx-auto flex p-5 gap-8">
                            <div className="flex-1 flex flex-col gap-6 ">
                              <div>
                                <h3 className="text-[#8B2323] font-bold text-center uppercase tracking-widest mb-2 border-b border-gray-100 pb-2">Products</h3>
                                <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                                  {MEGA_MENU_DATA[megaMenuKey].products.map((sub) => (
                                    <Link key={sub} href="#" className="text-gray-600 hover:text-[#8B2323] text-[15px] font-medium flex items-center justify-center normal-case">
                                      {sub}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                              <div className="border-t border-gray-100 pt-2 ">
                                <div className="relative mb-4"><h3 className="text-[#8B2323] font-bold text-center uppercase tracking-widest border-b border-gray-100 pb-2">Brands</h3></div>
                                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
                                  {MEGA_MENU_DATA[megaMenuKey].brands.map((brand) => (
                                    <Link key={brand} href="#" className="text-[15px] font-semibold text-black hover:text-[#8B2323] transition-all uppercase ">{brand}</Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="w-[380px]">
                              <div className="bg-[#f9f9f9] rounded-[40px] p-12 h-full flex flex-col items-center justify-center border border-gray-100 text-center shadow-sm">
                                <p className="text-[12px] text-[#8B2323] font-bold uppercase tracking-[0.4em] mb-4">Featured</p>
                                <h4 className="text-gray-900 font-black text-3xl leading-tight mb-8 italic uppercase tracking-tighter">{MEGA_MENU_DATA[megaMenuKey].promoTitle}</h4>
                                <button className="bg-[#8B2323] text-white text-[13px] font-bold uppercase tracking-[0.2em] px-12 py-4 rounded-full hover:bg-black transition-all shadow-md">View All</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>

      {/* ========================================== */}
      {/* MOBILE HEADER VIEW (UPDATED LAYOUT)        */}
      {/* ========================================== */}
      <div className="lg:hidden">
        {/* Mobile Row 1: Menu | Centered Logo | User icon */}
        <div className="px-4 h-16 flex items-center justify-between relative border-b border-gray-50">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2">
            <Menu size={32} strokeWidth={1.5} />
          </button>
          
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/">
              <Image src={logoSrc} alt="Logo" width={160} height={40} priority className="object-contain" />
            </Link>
          </div>

          <Link href={customer ? "/account" : "/login"} className="p-2 -mr-2">
            <User size={28} strokeWidth={1.5} />
          </Link>
        </div>

        {/* Mobile Row 2: Search Bar Row */}
        <div className="px-4 py-3 bg-white">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search products" 
              className="w-full h-11 px-5 pr-12 border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:outline-none focus:border-red-800 text-sm transition-all shadow-sm" 
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      

      {/* MOBILE SIDEBAR (DRAWER) */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsMenuOpen(false)} />
      <aside className={`fixed top-0 left-0 w-[300px] h-full bg-white z-[201] shadow-2xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <span className="font-bold text-lg text-[#8B2323] uppercase tracking-widest">Menu</span>
          <button onClick={() => setIsMenuOpen(false)}><X size={28} className="text-gray-900" /></button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-80px)] p-6 bg-white">
          <ul className="space-y-6">
            {navItems.map((item) => (
              <li key={item.href} className="border-b border-gray-50 pb-4 last:border-0">
                <Link href={item.href} onClick={() => setIsMenuOpen(false)} className="text-[16px] font-bold text-gray-800 uppercase flex justify-between">
                  {item.label}
                  <ChevronRight size={18} className="text-gray-300" />
                </Link>
              </li>
            ))}
            {/* Auth Links */}
            {customer ? (
              <>
                <li className="border-b border-gray-50 pb-4">
                  <div className="text-[14px] font-bold text-gray-600 uppercase flex items-center gap-2">
                    <User size={18} />
                    Hi, {customer.firstName}
                  </div>
                </li>
                <li className="border-b border-gray-50 pb-4">
                  <Link href="/account" onClick={() => setIsMenuOpen(false)} className="text-[16px] font-bold text-[#8B2323] uppercase flex items-center gap-2">
                    <User size={18} />
                    My Account
                  </Link>
                </li>
                <li className="border-b border-gray-50 pb-4">
                  <button onClick={() => { onLogout?.(); setIsMenuOpen(false); }} className="text-[16px] font-bold text-[#8B2323] uppercase flex items-center gap-2 w-full">
                    <User size={18} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="border-b border-gray-50 pb-4">
                  <Link href="/register" onClick={() => setIsMenuOpen(false)} className="text-[16px] font-bold text-[#8B2323] uppercase flex items-center gap-2">
                    <User size={18} />
                    Register
                  </Link>
                </li>
                <li className="border-b border-gray-50 pb-4">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-[16px] font-bold text-[#8B2323] uppercase flex items-center gap-2">
                    <User size={18} />
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </aside>

    </header>
  );
}