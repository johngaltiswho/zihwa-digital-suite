"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Sparkles, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300]"
          />

          {/* Right Sidebar Panel */}
          <motion.aside 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-white z-[301] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#1a3a5a] text-white">
              <div className="flex items-center gap-3">
                 <ShoppingBag size={24} className="text-green-400" />
                 <h2 className="text-xl font-black uppercase tracking-tighter">Your Bag</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Coming Soon Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8">
              <div className="relative">
                 <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-200">
                    <ShoppingBag size={48} strokeWidth={1} />
                 </div>
                 <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-2 -right-2 text-green-500"
                 >
                    <Sparkles size={24} />
                 </motion.div>
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Clock size={14} /> Feature Arriving Soon
                </div>
                <h3 className="text-2xl font-black text-[#1a3a5a] uppercase tracking-tighter">Shopping Made Seamless</h3>
                <p className="text-slate-400 font-medium text-sm leading-relaxed">
                  We are building a secure, hyper-fast checkout experience for your medicines and beauty essentials. Stay tuned for the launch!
                </p>
              </div>

              <div className="w-full pt-8 space-y-4">
                 <button 
                  onClick={onClose}
                  className="w-full bg-[#1a3a5a] hover:bg-black text-white h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-slate-200"
                 >
                   Continue Shopping
                 </button>
                 <Link 
                   href="/offers" 
                   onClick={onClose}
                   className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00a651] hover:underline"
                 >
                   Check Current Offers <ArrowRight size={14} />
                 </Link>
              </div>
            </div>

            {/* Trust Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-4">
               <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600 border border-white">
                  <Sparkles size={18} />
               </div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">
                  Authentic Medicines & <br /> Certified Cosmetics Only.
               </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}