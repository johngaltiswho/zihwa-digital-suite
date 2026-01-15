"use client";
import React from "react";

interface InfoLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function InfoLayout({ title, subtitle, children }: InfoLayoutProps) {
  return (
    <section className="bg-white min-h-screen py-20 font-sans">
      <div className="max-w-[900px] mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 uppercase tracking-tighter">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[#8B2323] font-bold uppercase tracking-[0.3em] text-sm">
              {subtitle}
            </p>
          )}
          <div className="w-20 h-1 bg-gray-100 mx-auto mt-8 rounded-full" />
        </div>

        {/* Content Section */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed 
          prose-headings:text-gray-900 prose-headings:font-black prose-headings:uppercase 
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
          prose-p:mb-6 prose-li:mb-2 prose-strong:text-gray-900">
          {children}
        </div>
      </div>
    </section>
  );
}