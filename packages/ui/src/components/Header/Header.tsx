"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";


import { 
  Menu, Search, CircleUser,User, Heart, X,
  ChefHat, PhoneCall, MapPin, Tag, ShoppingCart, 
  ChevronRight, ChevronDown, Headset, Pill, ShoppingBag, 
  ShieldCheck, Handbag, Store, LogOut, CheckCircle, Trash2 
} from "lucide-react";

const SEARCH_SUGGESTIONS = [
  "Pasta & Noodles",
  "Banana",
  "Organic Spices",
  "Frozen Food",
  "oils & ghee",
  "Dry fruits",
  "Tea",
  "gourmet cheese"
];
interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  navItems: NavItem[];
  logoSrc: string;
}

// --- MEGA MENU DATA ---

const MEGA_MENU_DATA: Record<string, { 
  products?: string[], 
  brands?: string[], 
  vegetables?: string[], 
  fruits?: string[], 
  promoTitle: string 
}> = {
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
    vegetables: ["Beans & Brinjals", "Potato, Onion & Tomato", "Cucumber, Capsicum & Okra", "Root Vegetables", "Gourd, Pumpkin & Drumstick", "Herbs & Seasoning"],
    fruits: ["Kiwi, Melon & Citrus Fruit", "Coconut", "Apples & Pomegranate", "Banana, Sapota & Papaya"],
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
  onUserMenuToggle?: (isOpen: boolean) => void; 
  
}
// --- SUB-COMPONENT: AUTH STATUS POPUP (UPDATED DESIGN & LOGIC) ---
function AuthStatusToast({ type, onClose }: { type: string | null, onClose: () => void }) {
  const content: Record<string, any> = {
    login: { title: "Welcome Back!", desc: "You have successfully logged in.", icon: <CircleUser />, color: "bg-[#00a651]" },
    logout: { title: "Logged Out", desc: "You have been securely signed out.", icon: <LogOut />, color: "bg-gray-800" },
    created: { title: "Account Created!", desc: "Welcome to Stalks 'n' Spice!", icon: <CheckCircle />, color: "bg-[#8B2323]" },
    deleted: { title: "Account Deleted", desc: "Your account has been removed.", icon: <Trash2 />, color: "bg-red-600" },
  };

  const DURATION = 3000; // 3 Seconds

  useEffect(() => {
    if (!type) return;
    const timer = setTimeout(onClose, DURATION);
    return () => clearTimeout(timer);
  }, [type, onClose]);

  if (!type || !content[type]) return null;
  const current = content[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: "-50%" }}
      animate={{ opacity: 1, y: 110, x: "-50%" }} // Adjusted to float over header nicely
      exit={{ opacity: 0, y: -20, x: "-50%" }}
      className="fixed top-0 left-1/2 z-[1000] w-[90%] max-w-md bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center p-5 gap-5 overflow-hidden"
    >
      <div className={`${current.color} text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
        {React.cloneElement(current.icon as React.ReactElement, { size: 24, strokeWidth: 1.5 })}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 text-lg leading-tight">{current.title}</h4>
        <p className="text-sm text-gray-400 mt-0.5">{current.desc}</p>
      </div>
      <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors p-1">
        <X size={20} />
      </button>
      
      {/* Progress Bar Loader */}
      <motion.div 
        initial={{ width: "100%" }} 
        animate={{ width: "0%" }} 
        transition={{ duration: DURATION / 1000, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-1 ${current.color} opacity-40`}
      />
    </motion.div>
  );
}

// --- 1. SHARED HEADER ---
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
              backgroundColor: 'rgba(17, 24, 39, 0.8)', 
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
            background: '#111827', // Using AACP
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
export function StalksHeader({ navItems, logoSrc, customer, onUserMenuToggle, onLogout, }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMenuLocked, setIsMenuLocked] = useState(false);
  // POPUP MANAGEMENT
  const [authPopup, setAuthPopup] = useState<"login" | "logout" | "created" | "deleted" | null>(null);
  const prevCustomerRef = useRef<Customer | null | undefined>(customer);

  // Search Interaction States
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  // Smart Reveal Logic
  const [showRow3, setShowRow3] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSticky, setIsSticky] = useState(false); 
  const lastScrollY = useRef(0);
  const hideCategories = [
    '/login',
    '/register',
    '/cart',
    '/forgot-password'
  ].includes(pathname)
  || pathname.startsWith('/contact')
  || pathname.startsWith('/checkout')
  || pathname.startsWith('/account')
  || pathname.startsWith('/cuisine')
  || pathname.startsWith('/shop')
  || pathname.startsWith('/category')
  || pathname.startsWith('/product');



  const navRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    setMounted(true); 
    
    // Cycle search placeholders every 3 seconds
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_SUGGESTIONS.length);
    }, 3000);

     const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY.current;
      
      // Set sticky mode when scrolled past header
      setIsSticky(currentScrollY > 100);
      setIsScrolled(currentScrollY > 60);
      
      // Debounce state changes - only update if significant scroll
      if (Math.abs(scrollDiff) > 15) {
        if (scrollDiff > 0 && currentScrollY > 250) {
          // Scrolling down - hide categories
          setShowRow3(false);
        } else if (scrollDiff < 0 || currentScrollY < 100) {
          // Scrolling up - show categories
          setShowRow3(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };


    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsLocked(false);
        setActiveMenu(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
        setIsMenuLocked(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(interval);
    };
  }, []);

   // SMART REDIRECT & LOGIN DETECTION
  useEffect(() => {
    
    if (!prevCustomerRef.current && customer) {
      setAuthPopup("login");
      // REDIRECT TO HOME ON LOGIN
      if (pathname === '/login' || pathname === '/register') {
        router.push('/');
      }
    }
    prevCustomerRef.current = customer;
  }, [customer, router, pathname]);

  const handleLogoutAction = () => {
    setAuthPopup("logout");
    onLogout?.();
    setIsUserMenuOpen(false);
    setIsMenuLocked(false);
    router.push('/'); // Also redirect home on logout
  };
// ADD THIS BLOCK around line 410 in the file you just sent
useEffect(() => {
  // This notifies the HeaderWrapper whenever the login menu opens or closes
  if (onUserMenuToggle) {
    onUserMenuToggle(isUserMenuOpen);
  }
}, [isUserMenuOpen, onUserMenuToggle]);

  if (!mounted) return <div className="w-full h-[180px] bg-white border-b" />;
  return (
    <header className="w-full bg-white border-b border-gray-100 font-sans sticky top-0 z-[100]">
       {/* AUTH POPUP RENDERER */}
      <AnimatePresence>
        {authPopup && <AuthStatusToast type={authPopup} onClose={() => setAuthPopup(null)} />}
      </AnimatePresence>
      
      {/* DESKTOP VIEW */}
      <div className="hidden lg:block">
        <div className="relative z-[130] bg-white">
        {/* ROW 1: Utility Bar (Dropdown trigger moved here) */}
        <div className="bg-white border-b border-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 h-12 flex justify-end items-center space-x-5 text-[13px] font-medium text-gray-600">
            <Link href="/shop" className="flex items-center hover:text-red-800 transition-colors"><Store size={18} className="mr-1.5" /> Shop</Link>
            <Link href="/recipes" className="flex items-center hover:text-red-800 transition-colors"><ChefHat size={16} className="mr-1.5" /> Recipe&apos;s</Link>
            <Link href="/offers" className="flex items-center hover:text-red-800 transition-colors"><Tag size={14} className="mr-1.5" /> Offers</Link>
            <Link href="/tracking" className="flex items-center hover:text-red-800 transition-colors"><MapPin size={14} className="mr-1.5" /> Tracking</Link>
            <Link href="/contact" className="flex items-center hover:text-red-800 transition-colors"><PhoneCall size={14} className="mr-1.5" /> Contact Us</Link>
            <Link href="/wishlist" className="flex items-center hover:text-red-800 transition-colors"><Heart size={14} className="mr-1.5" /> Wishlist</Link>

      {/* DYNAMIC AUTH TRIGGER */}
        <div
            className="relative"
            ref={userMenuRef}
            onMouseEnter={() => setIsUserMenuOpen(true)}
            onMouseLeave={() => !isMenuLocked && setIsUserMenuOpen(false)}
        >
              <button 
                onClick={() => {
                  setIsMenuLocked(!isMenuLocked);
                  setIsUserMenuOpen(true);
                }}
                className={`
                  flex items-center gap-2 p-1 pr-3 rounded-full transition-all duration-300 border
                  ${isUserMenuOpen || isMenuLocked 
                    ? "bg-red-50 border-red-100 shadow-sm" 
                    : "bg-gray-100 border-transparent hover:bg-gray-200"
                  }
                `}
              >
        {/* ROUNDED PROFILE ICON */}
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center transition-colors group-hover:bg-red-50 border border-gray-200 group-hover:border-red-100">
            <User 
                size={18} 
                className="text-gray-500 group-hover:text-red-800 transition-colors" 
                strokeWidth={2}
            />
            </div>

    {/* NAME AND ARROW */}
    <div className="flex items-center gap-1">
      <span className="font-bold text-gray-900 text-[14px]">
        {customer ? `Hi, ${customer.firstName}` : "Login / Register"}
      </span>
      <ChevronDown 
        size={14} 
        className={`text-gray-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
      />
    </div>
  </button>

              {/* DROPDOWN MENU CARD (Anchored to Row 1) */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white border border-gray-100 shadow-2xl rounded-2xl z-[200] overflow-hidden animate-in fade-in zoom-in-95 duration-150 normal-case font-normal">
                  {customer ? (
                    <div className="py-2">
                      <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-[10px] font-bold text-red-800 uppercase tracking-widest mb-1">Welcome back</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{customer.firstName} {customer.lastName}</p>
                      </div>
                      <div className="p-2">
                        <Link href="/account" onClick={() => setIsUserMenuOpen(false)} className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-800 rounded-lg transition-colors">
                          <User size={16} className="mr-3 opacity-50" /> My Account
                        </Link>
                        <Link href="/account/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-800 rounded-lg transition-colors">
                          <ShoppingCart size={16} className="mr-3 opacity-50" /> My Orders
                        </Link>
                        <div className="border-t border-gray-50 mt-1 pt-1">
                          <button 
                            onClick={() => { onLogout?.(); setIsUserMenuOpen(false); }}
                            className="flex items-center w-full px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 space-y-3">
                      <p className="text-[13px] text-gray-500 text-center mb-1">Access your account & orders</p>
                      <Link href="/login" onClick={() => setIsUserMenuOpen(false)} className="block w-full text-center py-2.5 bg-red-800 text-white rounded-xl font-bold text-sm hover:bg-black transition-colors">
                        Login
                      </Link>
                      <Link href="/register" onClick={() => setIsUserMenuOpen(false)} className="block w-full text-center py-2.5 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ROW 2: Logo & Search */}
        <div className="max-w-[1400px] mx-auto px-6 h-12 flex items-center justify-between gap-8 mt-0 mb-1">
          <div className="flex items-center space-x-6 flex-shrink-0">
          <div className="p-1 text-gray-800">
          <Menu size={30} />
          </div>
            <Link href="/" className="block -mt-5">
              <Image src={logoSrc} alt="Logo" width={250} height={50} priority className="object-contain" />
            </Link>
          </div>

          {/* --- UPDATED ANIMATED SEARCH BOX --- */}
            <div className="flex-1 max-w-3xl mx-auto relative group">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full h-11 px-6 pr-14 border border-gray-300 rounded-full focus:outline-none focus:border-red-800 focus:ring-4 focus:ring-red-50/50 text-sm transition-all bg-white shadow-sm" 
                />
                
                {/* ANIMATED PLACEHOLDER */}
                {!searchValue && !isSearchFocused && (
                  <div className="absolute left-6 pointer-events-none text-gray-400 text-sm flex items-center gap-1.5">
                    <span>Search for</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={SEARCH_SUGGESTIONS[placeholderIndex]}
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="font-medium text-gray-500"
                      >
                        &quot;{SEARCH_SUGGESTIONS[placeholderIndex]}&quot;
                      </motion.span>
                    </AnimatePresence>
                  </div>
                )}

                {/* THEMED ROUNDED SEARCH BUTTON */}
                <button className="absolute right-1 p-2.5 bg-[#8B2323] hover:bg-black text-white rounded-full transition-all duration-300 shadow-md active:scale-95 group-hover:shadow-lg">
                  <Search size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

{/* ============================================================ */}
{/* SMART CATEGORIES ROW (ROW 3)                                 */}
{/* ============================================================ */}
{!hideCategories && (
  <>
    {/* STICKY WRAPPER - Prevents layout shift */}
    <div 
      className={`
        w-full bg-white z-[120]
        ${isSticky ? 'h-0' : 'h-auto'}
      `}
    >
      <nav
        ref={navRef}
        className={`
          hidden lg:block w-full bg-white border-b border-gray-100
          transition-all duration-300 ease-out
          ${isSticky ? 'fixed left-0 right-0 top-[96px] shadow-md' : 'relative'}
          ${showRow3 ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'}
        `}
        style={{
          transform: showRow3 ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)',
          willChange: 'transform, opacity'
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6">
          <ul className="flex flex-wrap justify-center items-center gap-x-4 py-0 text-[16px] font-semibold text-gray-800 tracking-tight uppercase">
            {navItems?.map((item) => {
              const isCurrentlyActive = activeMenu === item.label;
              const megaMenuKey = item.label.toUpperCase();
              const data = MEGA_MENU_DATA[megaMenuKey];

              return (
                <li
                  key={item.href}
                  onMouseEnter={() => !isLocked && setActiveMenu(item.label)}
                  onMouseLeave={() => !isLocked && setActiveMenu(null)}
                  className="py-1 cursor-pointer"
                >
                  <button
                    onClick={() => {
                      setIsLocked(!isLocked);
                      setActiveMenu(isLocked ? null : item.label);
                    }}
                    className={`flex items-center font-bold gap-1.5 transition-all py-1 pb-2 border-b-2 ${
                      isCurrentlyActive || pathname === item.href 
                        ? "text-red-800 border-red-800" 
                        : "border-transparent hover:text-red-800"
                    }`}
                  >
                    {item.label}
                    <ChevronDown 
                      size={14} 
                      className={`transition-transform duration-300 ${isCurrentlyActive ? 'rotate-180' : 'rotate-0'}`}
                    />
                  </button>

                  {/* MEGA MENU DRAWER */}
                  {isCurrentlyActive && data && (
                    <div className="absolute left-0 w-full bg-white shadow-2xl border-t border-gray-100 z-[100] animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="max-w-[1400px] mx-auto flex p-6 gap-6 text-left normal-case">
                        
                        {/* LEFT CONTENT: Products Grid */}
                        <div className="flex-1 flex flex-col gap-8">
                          {megaMenuKey === "FRUITS & VEGETABLES" ? (
                            <>
                              <div>
                                <h3 className="text-[#8B2323] font-bold text-center uppercase tracking-widest mb-4 border-b pb-2">Vegetables</h3>
                                <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                                  {data.vegetables?.map((v) => (
                                    <Link key={v} href="#" className="text-gray-600 hover:text-red-800 text-[15px] font-medium transition-colors">{v}</Link>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h3 className="text-[#8B2323] font-bold text-center uppercase tracking-widest mb-4 border-b pb-2">Fruits</h3>
                                <div className="grid grid-cols-6 gap-x-8 gap-y-2">
                                  {data.fruits?.map((f) => (
                                    <Link key={f} href="#" className="text-gray-600 hover:text-red-800 text-[15px] font-medium transition-colors">{f}</Link>
                                  ))}
                                </div>
                              </div>
                            </>
                          ) : (
                            <div>
                              <h3 className="text-[#8B2323] font-bold text-center uppercase tracking-widest mb-4 border-b pb-2">Products</h3>
                              <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                                {data.products?.map((p) => (
                                  <Link key={p} href="#" className="text-gray-600 hover:text-red-800 text-[15px] font-medium transition-colors">{p}</Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* BRANDS SECTION */}
                          {megaMenuKey !== "FRUITS & VEGETABLES" && data.brands && data.brands.length > 0 && (
                            <div className="border-t border-gray-100 pt-4">
                              <h3 className="text-[#8B2323] font-bold text-center uppercase tracking-widest text-[16px] mb-4">Brands</h3>
                              <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-2">
                                {data.brands.map((brand) => (
                                  <Link key={brand} href="#" className="text-[15px] font-semibold text-black hover:text-red-800 uppercase tracking-tighter">{brand}</Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* RIGHT PROMO SECTION */}
                        <div className="w-[320px]">
                          <div className="bg-[#f9f9f9] rounded-[40px] p-12 h-full flex flex-col items-center justify-center border border-gray-100 text-center shadow-sm">
                            <p className="text-[11px] text-[#8B2323] font-bold uppercase tracking-[0.4em] mb-4">Featured</p>
                            <h4 className="text-gray-900 font-black text-2xl leading-tight mb-8 italic uppercase tracking-tighter">{data.promoTitle}</h4>
                            <button className="bg-[#8B2323] text-white text-[12px] font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:bg-black transition-all shadow-md">View All</button>
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
    
    
  </>
)}
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
              <Image src={logoSrc} alt="Logo" width={200} height={50} priority className="object-contain" />
            </Link>
          </div>

          <Link href={customer ? "/account" : "/login"} className="p-3 mt-2 -mr-2">
            <CircleUser size={34} strokeWidth={1.5} />
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
export function ParsOptimaHeader({ logoSrc, navItems }: { logoSrc: string; navItems: {label: string, href: string}[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="w-full h-[120px] bg-white border-b" />;

  return (
    <>
      <header className="w-full bg-white font-sans sticky top-0 z-[100] shadow-sm">
        
        {/* ROW 1: TOP UTILITY BAR */}
        <div className="bg-white hidden md:block border-b border-slate-50">
          <div className="max-w-[1440px] mx-auto px-12 h-12 flex justify-end items-center space-x-6 text-[12px] text-gray-500 font-medium">
            <Link href="/beauty" className="flex items-center gap-1.5 hover:text-[#00a651] transition-colors"><Handbag size={16}/> Cosmetics</Link>
            <Link href="/medicines" className="flex items-center gap-1.5 hover:text-[#00a651] transition-colors"><Pill size={16}/> Medicine&apos;s</Link>
            <Link href="/contact" className="flex items-center gap-1.5 hover:text-[#00a651] transition-colors"><Headset size={16}/> Contact Us</Link>
            <Link href="/track" className="flex items-center gap-1.5 hover:text-[#00a651] transition-colors"><MapPin size={16}/> Tracking</Link>
            <Link href="/offers" className="flex items-center gap-1.5 hover:text-[#00a651] transition-colors"><Tag size={16}/> Offers</Link>
            {/* <Link href="/wishlist" className="flex items-center gap-1.5 hover:text-[#00a651] transition-colors"><Heart size={18}/> Wishlist</Link> */}
            <Link href="/login" className="flex items-center gap-1.5 hover:text-[#00a651] transition-colors"><User size={16}/> Login</Link>
          </div>
        </div>

        {/* ROW 2: MAIN HEADER */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-2 h-14 flex items-center justify-between gap-2">
          
          {/* Left: Logo & Menu */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={() => setIsMenuOpen(true)} 
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center"
            >
              <Menu size={32} className="text-gray-800" strokeWidth={1.5} />
            </button>
          <Link href="/" className="flex items-center h-full">
  {/* We limit the height to 10 (40px) so it fits perfectly in the h-12 header */}
  <div className="relative w-[150px] h-[180px] overflow-hidden">
    <Image 
      src={logoSrc} 
      alt="Pars Optima" 
      fill 
      priority 
      className="object-contain object-left brightness-110 contrast-125" 
      // The filters above will help "wash out" the light gray squares into white
    />
  </div>
</Link>
          </div>

          {/* Center: Centered Rounded Search (SNS Style) */}
        <div className="flex-1 max-w-5xl hidden md:block">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full h-9 px-12  border border-gray-200 rounded-full bg-[#f8f9fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a651]/10 transition-all text-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

         {/* Right: Wishlist and Cart Icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* WISHLIST HEART ICON */}
            <Link 
              href="/wishlist" 
              className="p-3 text-gray-800 hover:text-red-500 transition-colors"
              title="Wishlist"
            >
              <Heart size={28} strokeWidth={1.3} />
            </Link>

            {/* CART TRIGGER */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="relative p-3 text-gray-800 hover:text-[#00a651] transition-colors"
            >
              <ShoppingCart size={28} strokeWidth={1.3} />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">0</span>
            </button>
          </div>
        </div>
        {/* MOBILE MENU DRAWER */}
        <div 
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] transition-opacity ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
          onClick={() => setIsMenuOpen(false)} 
        />
        <aside className={`fixed top-0 left-0 w-[300px] h-full bg-white z-[201] transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="p-5 border-b flex justify-between items-center bg-[#1a3a5a] text-white">
            <span className="font-bold uppercase tracking-widest text-xs">Navigation</span>
            <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
          </div>
          <nav className="p-6">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.href} className="border-b border-gray-50 pb-4">
                  <Link href={item.href} className="flex justify-between items-center text-gray-800 font-bold uppercase text-[12px]" onClick={() => setIsMenuOpen(false)}>
                    {item.label} <ChevronRight size={14} className="text-gray-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </header>

      {/* --- CART SIDEBAR (RIGHT SIDE) --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300]"
            />

            {/* Panel */}
            <motion.aside 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full md:w-[380px] h-full bg-white z-[301] shadow-xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-600 flex justify-between items-center bg-[#1a3a5a] text-white">
                <div className="flex items-center gap-2">
                   <ShoppingBag size={28} className="text-green-400" />
                   <h2 className="text-xl font-black uppercase tracking-tighter">Your Cart</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={20} /></button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-200">
                  <ShoppingBag size={48} strokeWidth={1} />
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest"> Arriving Soon</div>
                  <h3 className="text-2xl font-bold text-[#1a3a5a] uppercase">Cart is Arriving</h3>
                  <p className="text-slate-400 font-sm text-sm leading-relaxed">We are building a seamless checkout experience for your health and beauty needs.</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="w-full bg-[#1a3a5a] text-white h-14 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl">Continue Shopping</button>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-4">
                 <ShieldCheck className="text-green-600" size={20} />
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">100% Secure & Certified Healthcare</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}