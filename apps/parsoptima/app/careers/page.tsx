"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, FlaskConical, Sparkles, Send } from "lucide-react";

export default function Careers() {
  return (
    <div className="bg-white min-h-screen font-sans flex flex-col justify-center items-center">
      
      {/* 1. TOP NAVIGATION / BREADCRUMB STYLE */}
      <div className="absolute top-12 text-center w-full">
        <h4 className="text-[#00a651] font-bold tracking-[0.3em] uppercase text-[12px]">Pars Optima Enterprises</h4>
      </div>

      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full text-center py-20">
        
        {/* ICON GROUP */}
        <div className="flex justify-center gap-4 mb-8">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-[#1a3a5a]">
                <FlaskConical size={20} />
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-[#1a3a5a]">
                <Briefcase size={20} />
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-[#1a3a5a]">
                <Sparkles size={20} />
            </div>
        </div>

        {/* MAIN TEXT */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-8xl font-black text-[#1a3a5a] tracking-tighter uppercase leading-none">
            Join the <br /> 
            <span className="text-[#00a651]">Team.</span>
          </h1>
          
          <div className="inline-block bg-black text-white px-6 py-2 rounded-full font-black text-sm tracking-widest uppercase mb-8">
            Coming Soon
          </div>

          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            We are currently refining our recruitment process to find the brightest minds in 
            <span className="font-bold text-[#1a3a5a]"> Pharmaceutical Science</span> and 
            <span className="font-bold text-[#1a3a5a]"> Cosmetic Innovation</span>. 
            Great things are in the works.
          </p>
        </div>

        {/* NEWSLETTER / INTEREST SECTION */}
        <div className="mt-16 max-w-xl mx-auto border-[1.5px] border-black p-8 md:p-12 rounded-sm bg-[#f8fafc]">
            <h3 className="font-bold text-[#1a3a5a] uppercase tracking-widest text-sm mb-4">Want to be the first to know?</h3>
            <p className="text-slate-500 text-sm mb-8 italic">Drop your email below and we will notify you as soon as our career portal opens.</p>
            
            <form className="flex flex-col md:flex-row gap-0 border-black border-[1.5px] overflow-hidden bg-white">
                <input 
                    type="email" 
                    placeholder="YOUR EMAIL ADDRESS" 
                    className="flex-1 p-4 outline-none text-sm font-bold uppercase placeholder:text-slate-300"
                />
                <button className="bg-black text-white px-8 py-4 font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                    Notify Me <Send size={14} />
                </button>
            </form>
        </div>

        {/* OPTIONAL BACK LINK */}
        <div className="mt-12">
            <Link href="/" className="text-[12px] font-black uppercase tracking-widest text-slate-400 hover:text-[#00a651] transition-colors border-b-2 border-transparent hover:border-[#00a651] pb-1">
                Back to Home
            </Link>
        </div>

      </section>

      {/* BACKGROUND DECORATION */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-[#00a651]"></div>
      <div className="fixed top-0 right-0 w-64 h-64 bg-[#00a651]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-[#1a3a5a]/5 rounded-full blur-[120px] -ml-48 -mb-48"></div>

    </div>
  );
}