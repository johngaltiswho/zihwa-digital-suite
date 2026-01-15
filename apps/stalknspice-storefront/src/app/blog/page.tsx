"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import NewsLetter from "../../components/NewsLetter";

// Mock Data representing the 'blogs' variable from your Pug logic
const blogs = [
  {
    name: "Real Healthy Juices in India You Should Try",
    image: "https://s3.ap-south-1.amazonaws.com/stalksnspice.com/landing-page/monin.jpg", // Placeholder
    url: "/real-healthy-juices",
  },
  {
    name: "List of Best Vinegars For Cooking Everything Delicious",
    image: "https://s3.ap-south-1.amazonaws.com/stalksnspice.com/landing-page/monin.jpg", // Placeholder
    url: "/vinegars",
  },
  {
    name: "Authentic Japanese Ingredients",
    image: "https://s3.ap-south-1.amazonaws.com/stalksnspice.com/landing-page/monin.jpg", // Placeholder
    url: "/ingredients",
  },
];

export default function BlogPage() {
  return (
    <main className="bg-white min-h-screen font-sans">
      {/* Main Content Container */}
      <section className="max-w-[1200px] mx-auto px-6 py-12 md:py-8">
        
        {/* HEADER - Centered Title & Line */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 uppercase tracking-tighter leading-none">
            Gourmet <span className="text-[#8B2323]">Insights</span>
          </h1>
          <p className="text-[#8B2323] font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs">Stories, Tips & Culinary Secrets</p>
          <div className="w-24 h-1 bg-[#8B2323] mx-auto mt-8 rounded-full" />
        </div>

        {/* BLOG GRID - Replaces the .flex-row logic from Pug */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {blogs.map((blog, idx) => (
            <Link 
              href={blog.url} 
              key={idx} 
              className="group flex flex-col bg-white rounded-[45px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image 
                  src={blog.image}
                  alt={blog.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Visual Overlay on Hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="bg-white p-4 rounded-full text-[#8B2323] shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <ArrowUpRight size={24} />
                   </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-tight mb-6 line-clamp-2">
                  {blog.name}
                </h3>
                
                <div className="mt-auto flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B2323]">Read Article</span>
                   <div className="w-8 h-[1px] bg-gray-200 group-hover:w-16 group-hover:bg-[#8B2323] transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* EMPTY STATE - Logic from Pug 'if blogs' */}
        {blogs.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[50px] border border-dashed border-gray-200">
             <p className="text-gray-400 font-bold uppercase tracking-widest">New insights are brewing. Check back soon.</p>
          </div>
        )}

        {/* RETURN HOME BUTTON */}
        <div className="mt-10 pt-10 border-t border-gray-100 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 bg-[#8B2323] hover:bg-black text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all shadow-lg active:scale-95"
          >
            <ArrowLeft size={18} /> Return Home
          </Link>
        </div>

      </section>

      <div className="pb-20">
        <NewsLetter />
      </div>
    </main>
  );
}