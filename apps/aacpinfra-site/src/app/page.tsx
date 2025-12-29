// apps/aacpinfra-site/src/app/page.tsx;
"use client";
import Link from "next/link";

import { homepageData } from "@/data/homepage";
import { servicesData } from "@/data/services";
import { projectsData } from "@/data/projects";
import { teamData } from "@/data/team";

import AboutOverview from "@/components/AboutOverview";
import CtaSection from "@/components/CtaSection";
import BoardSection from "@/components/BoardSection";
import FooterTop from "@/components/footer/FooterTop";

import { HeroSlider } from "@repo/ui";
export default function HomePage() {
  console.log(
    "SITE URL from env:",
    process.env.NEXT_PUBLIC_SITE_URL
  );

  const home = homepageData;
  

  /* ================= HERO SLIDES (9 SLIDES) ================= */
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
      cta: { label: "Explore Services", href: "/services" },
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
      cta: { label: "Our Expertise", href: "/services" },
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

      {/* ================= SERVICES ================= */}
      <section 
            id="services"
            className="py-10 bg-gray-100 text-center scroll-mt-[120px]">
        <h2 className="text-3xl font-bold mb-12 inline-block border-b-2 border-black pb-1">
          {home.servicesOverviewTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
          {servicesData.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition"
            >
              {service.icon_url && (
                <img
                  src={service.icon_url}
                  alt={service.title}
                  className="w-12 mb-4 mx-auto"
                />
              )}
              <h3 className="text-xl font-semibold mb-3">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600">
                {service.short_description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= PROJECTS ================= */}
      <section className="py-10 bg-white text-center">
        <h2 className="text-3xl font-bold mb-12">
          {home.recentWorksTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {projectsData.slice(0, 3).map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="bg-gray-100 p-6 rounded-lg hover:shadow"
            >
              <h3 className="font-semibold">{project.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= BOARD ================= */}
      <BoardSection />

      {/* ================= TEAM =================
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-12">
          {home.teamSectionTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {teamData.slice(0, 3).map((member) => (
            <div
              key={member.id}
              className="bg-white p-6 rounded-lg shadow"
            >
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-blue-600">{member.position}</p>
            </div>
          ))}
        </div>
      </section> */}

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
