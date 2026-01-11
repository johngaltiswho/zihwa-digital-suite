"use client";

import Image from "next/image";
import Link from "next/link";

const heroItems = [
  { id: "01", label: "AACP IN BRIEF", href: "#about" },
  { id: "02", label: "SERVICES", href: "/services" },
  { id: "03", label: "STRATEGY", href: "/strategy" },
  { id: "04", label: "SAFETY", href: "/safety" },
  { id: "05", label: "INNOVATION", href: "/innovation" },
];

export default function AboutHero() {
  return (
    <section className="relative h-[90vh] w-full text-white">
      {/* Background Image */}
      <Image
        src="/images/about-hero.jpg"
        alt="AACP Infrastructure operations"
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-16 py-20">
        
        {/* Top Text */}
        <div className="max-w-5xl">
          <h1 className="text-5xl md:text-6xl tracking-widest mb-6">
            ABOUT
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-gray-200">
            Here you can learn more about AACP – one of the leading general
            contracting and construction groups – and our purpose of building
            a better society. We are at an exciting growth stage and continue
            to expand our portfolio of projects and services.
          </p>
        </div>

        {/* Bottom Overlay Boxes */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-16">
          {heroItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group bg-white/10 backdrop-blur-sm border border-white/20 p-6 text-center hover:bg-white/20 transition"
            >
              <p className="text-5xl font-light mb-2">{item.id}</p>
              <p className="text-sm tracking-widest uppercase">
                {item.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
