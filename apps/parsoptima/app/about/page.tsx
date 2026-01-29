"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Pill, ShieldCheck, Microscope, Building2, Globe, MapPin, Scale } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* 1. HERO SECTION - Corporate Identity */}
      <section className="relative py-10 lg:py-12 bg-[#f8fafc] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-[#00a651] text-[10px] font-black uppercase tracking-[0.2em]">
              Established 2020  , BANGALORE, KARNATAKA
            </div>
            <h1 className="text-5xl lg:text-8xl font-black text-[#1a3a5a] tracking-tighter leading-[0.85] uppercase">
              Pars Optima <br /> 
              <span className="text-gray-400">Enterprises.</span>
            </h1>
            <p className="text-slate-600 text-lg max-w-xl leading-relaxed mx-auto lg:mx-0">
              Pars Optima Enterprises LLP is a premier wholesale distributor specializing in high-standard pharmaceutical products and premium dermatological cosmetics.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/shop" className="bg-black text-white px-10 py-5 font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
                Explore Wholesale Range
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <Image 
                src="https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=2000" 
                alt="Corporate Distribution" 
                width={1000}   // Next.js Image requires width/height
                height={550}
                className="rounded-sm shadow-2xl relative z-10 w-full h-[550px] object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                priority      // Use priority for images above the fold (Hero section)
  />
</div>
        </div>
      </section>

      {/* 2. CORPORATE SNAPSHOT */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-4 gap-12">
                <div>
                    <h3 className="text-[#00a651] font-bold uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                        <Scale size={14}/> Entity Type
                    </h3>
                    <p className="text-[#1a3a5a] text-xl font-bold uppercase tracking-tighter">Limited Liability Partnership</p>
                </div>
                <div>
                    <h3 className="text-[#00a651] font-bold uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                        <Building2 size={14}/> Registration
                    </h3>
                    <p className="text-[#1a3a5a] text-xl font-bold uppercase tracking-tighter">BENGULURU (KARNATAKA)</p>
                </div>
                <div>
                    <h3 className="text-[#00a651] font-bold uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                        <MapPin size={14}/> Base
                    </h3>
                    <p className="text-[#1a3a5a] text-xl font-bold uppercase tracking-tighter">JP NAGAR ,7 TH PHASE, BENGALURU</p>
                </div>
                <div>
                    <h3 className="text-[#00a651] font-bold uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                        <Globe size={14}/> Global Status
                    </h3>
                    <p className="text-[#1a3a5a] text-xl font-bold uppercase tracking-tighter">Active Compliance</p>
                </div>
            </div>
        </div>
      </section>

      {/* 3. CORE WHOLESALE PILLARS */}
      <section className="py-12 max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-[#1a3a5a] tracking-tighter uppercase leading-none">Our Primary <br/><span className="text-[#00a651]">Verticals.</span></h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Registered Activity: Wholesale Medical & Household Goods</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <div className="space-y-6 p-12 bg-black text-white rounded-sm flex flex-col justify-center border-b-8 border-[#00a651]">
                <Pill size={48} className="text-[#00a651]" />
                <h2 className="text-3xl font-bold uppercase tracking-tight">Wholesale Pharmaceuticals</h2>
                <p className="text-slate-400 leading-relaxed text-lg">
                    we facilitate the wholesale of pharmaceutical and medical goods. We ensure a high-integrity supply chain for essential medicines, sourced only from licensed manufacturers.
                </p>
            </div>

            <div className="space-y-6 p-12 bg-[#f8fafc] text-[#1a3a5a] rounded-sm flex flex-col justify-center border-b-8 border-black">
                <Sparkles size={48} className="text-[#00a651]" />
                <h2 className="text-3xl font-bold uppercase tracking-tight">Premium Cosmetics</h2>
                <p className="text-slate-500 leading-relaxed text-lg">
                        we manage the wholesale of household goods including soaps, cosmetics, and beauty essentials. We bridge the gap between global dermatological brands and the domestic market.
                </p>
            </div>
        </div>
      </section>

      {/* 4. OPERATIONAL PHILOSOPHY */}
      <section className="py-24 max-w-[1440px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-black text-[#1a3a5a] tracking-tight uppercase">Corporate Integrity</h2>
          <p className="text-slate-600 leading-relaxed italic border-l-4 border-[#00a651] pl-6 py-2 text-xl font-medium">
            &quot; We operate with the active transparency required of a modern Indian enterprise, ensuring compliance and quality at every step.&quot;
          </p>
          <p className="text-slate-600 leading-relaxed">
            Incorporated in 2020, Pars Optima Enterprises LLP was founded to streamline the distribution of critical medical and cosmetic supplies. Our operations serve as a hub for quality assurance and efficient logistics across the region.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="p-4 bg-slate-50 border border-slate-100">
                <ShieldCheck size={20} className="text-[#00a651] mb-2"/>
                <p className="text-xs font-black uppercase tracking-widest">Active Status</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100">
                <Microscope size={20} className="text-[#1a3a5a] mb-2"/>
                <p className="text-xs font-black uppercase tracking-widest">Verified QC</p>
            </div>
          </div>
        </div>
        <div className="relative h-[450px] w-full">
       <Image 
        src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2000" 
        alt="Medical Distribution Center" 
        fill
        className="rounded-sm shadow-2xl object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        />
</div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-24 bg-black text-white text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight">Professional Distribution. <br/><span className="text-[#00a651]">Active Reliability.</span></h2>
          <p className="text-lg opacity-80 font-medium">Join the network of pharmacies and retailers who trust Pars Optima Enterprises LLP.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/contact" className="bg-[#00a651] text-white px-12 py-5 font-bold uppercase text-xs tracking-widest hover:bg-[#008e45] transition-all hover:scale-105">
              Contact Logistics Team
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}