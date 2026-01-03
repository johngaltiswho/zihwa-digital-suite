// apps/aacpinfra-site/src/app/page.tsx
"use client";

import { useEffect } from "react";
import Image from "next/image";

import { homepageData } from "@/data/homepage";
import { servicesData } from "@/data/services";

import AboutOverview from "@/components/AboutOverview";
import CtaSection from "@/components/CtaSection";
import BoardSection from "@/components/BoardSection";
import FooterTop from "@/components/footer/FooterTop";

import HeroSlider from "@/components/HeroSlider";


export default function HomePage() {
  const home = homepageData;

  /* ================= HARD SCROLL FIX (HERO SLIDER SAFE) ================= */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#services") return;

    let attempts = 0;

    const scrollToServices = () => {
      const el = document.getElementById("services");

      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else if (attempts < 12) {
        attempts += 1;
        setTimeout(scrollToServices, 120);
      }
    };

    scrollToServices();
  }, []);

  /* ================= HERO SLIDES ================= */
  const heroSlides = [
    {
      image: "/hero/slide-1.jpg",
      title: "Establishing Our Forte in Building Construction",
      subtitle: "External Development Works at Molex India Ltd.",
      cta: { label: "Learn More", href: "/projects" },
    },
    {
      image: "/hero/slide-2.jpg",
      title: "Sustainable Development of Manufacturing Units",
      subtitle: "Eco Zone Development Works at Toyota Kirloskar Motors Ltd.",
      cta: { label: "Learn More", href: "/projects" },
    },
    {
      image: "/hero/slide-3.jpg",
      title: "Conserving Lakes & Water Bodies",
      subtitle: "Rejuvenation of Abbanakuppe Lake",
      cta: { label: "Learn More", href: "/projects" },
    },
    {
      image: "/hero/slide-4.jpg",
      title: "Urban Infrastructure Development",
      subtitle: "Integrated Roads, Drainage & Utility Works",
      cta: { label: "Explore Services", href: "/#services" },
    },
    {
      image: "/hero/slide-5.jpg",
      title: "Precast & Industrial Infrastructure",
      subtitle: "High-quality precast and industrial construction solutions",
      cta: { label: "View Capabilities", href: "/precast" },
    },
    {
      image: "/hero/slide-6.jpg",
      title: "Roads, Highways & Connectivity",
      subtitle: "Durable road infrastructure for growing cities",
      cta: { label: "View Projects", href: "/projects" },
    },
    {
      image: "/hero/slide-7.jpg",
      title: "Future-Ready & Sustainable Infrastructure",
      subtitle: "Building resilient infrastructure with innovation and care",
      cta: { label: "About Us", href: "/about" },
    },
    {
      image: "/hero/slide-8.jpg",
      title: "Engineering Excellence Across Sectors",
      subtitle: "Delivering complex infrastructure projects with precision",
      cta: { label: "Our Expertise", href: "/#services" },
    },
    {
      image: "/hero/slide-9.jpg",
      title: "Infrastructure That Shapes Tomorrow",
      subtitle: "Committed to quality, safety, and sustainability",
      cta: { label: "Contact Us", href: "/contact" },
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* ================= HERO ================= */}
      <HeroSlider slides={heroSlides} />

      {/* ================= ABOUT ================= */}
      <AboutOverview />

      {/* ================= SERVICES / EXPERTISE ================= */}
      <section
        id="services"
        className="py-10 bg-gray-100 text-center scroll-mt-[160px]"
      >
        <h2 className="text-3xl font-bold mb-12 inline-block border-b-2 border-black pb-1">
          {home.servicesOverviewTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="
                bg-white p-8 rounded-xl shadow
                transition-all duration-300
                hover:shadow-lg hover:-translate-y-1
                cursor-pointer
              "
            >
              {service.icon_url && (
                <Image
                  src={service.icon_url}
                  alt={service.title}
                  width={48}
                  height={48}
                  className="mb-4 mx-auto"
                />
              )}

              <h3 className="text-xl font-semibold mb-3">
                {service.title}
              </h3>

              <p className="text-sm text-gray-600">
                {service.short_description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BOARD ================= */}
      <BoardSection />

      {/* ================= CTA ================= */}
      <CtaSection
        heading={home.cta.heading}
        buttonText={home.cta.buttonText}
        buttonLink={home.cta.buttonLink}
      />

      {/* ================= FOOTER TOP ================= */}
      <FooterTop />
    </div>
  );
}
