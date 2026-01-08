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

// import HeroSlider from "@/components/HeroSlider";
import { HeroSlider } from "@repo/ui"; // IMPORT FROM SHARED


export default function HomePage() {
  const home = homepageData;

  /* =================  (HERO SLIDER) ================= */
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
      cta: { label: "Learn More", href: "news/External-Development-at-Molex" },
    },
    {
      image: "/hero/slide-2.jpg",
      title: "Sustainable Development of Manufacturing Units",
      subtitle: "Eco Zone Development Works at Toyota Kirloskar Motors Ltd.",
      cta: { label: "Learn More", href: "news/eco-zone-development" },
    },
    {
      image: "/hero/slide-3.jpg",
      title: "Conserving Lakes & Water Bodies",
      subtitle: "Rejuvenation of Abbanakuppe Lake",
      cta: { label: "Learn More", href: "news/abbankuppe-lake" },
    },
    {
      image: "/hero/slide-4.jpg",
      title: "Sustaining Water",
      subtitle: "Rain Water Harvesting Pond at Toyota Kirloskar Auto Parts(TKAP)",
      cta: { label: "Learn More", href: "news/pond-modification" },
    },
    {
      image: "/hero/slide-5.jpg",
      title: "Infrastructure Support For Real Estate",
      subtitle: "External Development Works at Brigade Orchards,Devanahali",
      cta: { label: "Learn More", href: "news/road-external-development" },
    },
    {
      image: "/hero/slide-6.jpg",
      title: "Solar Solutions for Manufacturing Units",
      subtitle: "Earthwork,Roadworks & Civil Works for Solar Projects at BOSCH ",
      cta: { label: "Learn More", href: "news/solar-plant-bosch" },
    },
    {
      image: "/hero/slide-7.jpg",
      title: "Infrastructure Support for Manufacturing Units",
      subtitle: "Road Rectification Works at Toyota Kirloskar Motors Ltd.",
      cta: { label: "Learn More", href: "news/plant-1-shuttle-yard" },
    },
    {
      image: "/hero/slide-8.jpg",
      title: "New Technologies",
      subtitle: "Cold Ready Mix Asphalt Laying at Toyota Kirloskar Motors(TKM)",
      cta: { label: "Learn More", href: "news/new-project-fixing" },
    },
    {
      image: "/hero/slide-9.jpg",
      title: "Solidifying Our Forte in External Development Works",
      subtitle: "External Development Works at Kennmental Industries",
      cta: { label: "Learn More", href: "/news/industrial-site-development" },
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
