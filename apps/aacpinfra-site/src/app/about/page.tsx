"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ---------------- ANIMATION ---------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

type HeroNavItem =
  | {
      id: string;
      label: string;
      type: "scroll";
      target: string;
    }
  | {
      id: string;
      label: string;
      type: "link";
      target: string;
    }
  | {
      id: string;
      label: string;
      type: "services";
    };

/* ---------------- HERO NAV CONFIG ---------------- */
const heroNav:HeroNavItem[] = [
  { id: "01", label: "AACP IN BRIEF", type: "scroll", target: "who-we-are" },
  { id: "02", label: "SERVICES", type: "services" },
  { id: "03", label: "STRATEGY", type: "link", target: "/strategy" },
  { id: "04", label: "SAFETY", type: "link", target: "/safety" },
  { id: "05", label: "INNOVATION", type: "link", target: "/innovation" },
];

export default function AboutPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("who-we-are");

  /* -------- SCROLL WITHIN ABOUT -------- */
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* -------- SERVICES → HOME → EXPERTISE -------- */
  const goToServices = () => {
    router.push("/#services");

    setTimeout(() => {
      const el = document.getElementById("services");
      if (!el) return;

      el.scrollIntoView({ behavior: "smooth", block: "start" });

      // temporary highlight
      el.classList.add("ring-2", "ring-black-500", "ring-offset-4");

      setTimeout(() => {
        el.classList.remove("ring-2", "ring-black-500", "ring-offset-4");
      }, 1800);
    }, 350);
  };

  /* -------- ACTIVE SECTION TRACKING -------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.55 }
    );

    ["who-we-are", "vision-mission"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative min-h-[95vh] md:h-[80vh] w-full flex flex-col bg-black">
        <Image
          src="/images/about-hero.jpg"
          alt="About AACP Infrastructure"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-10 md:pt-20 md:pb-0 h-full flex flex-col justify-center md:justify-start">
          <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-6 text-white">
            ABOUT AACP INFRASTRUCTURE
          </h1>

          <p className="max-w-4xl text-m md:text-m text-gray-200 leading-relaxed">
            Here you can learn more about AACP - one of the leading general contracting and construction groups - and our purpose of building a better society. We are at the exciting growth stage of the business cycle and look forward to entering new markets and expanding our portfolio of projects and services. You can also find information about our strategy, services and business model in this section.
          </p>

          {/* ================= HERO NAV ================= */}
          <div className="mt-4 md:mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 md:gap-10">
            {heroNav.map((item) => {
              {/* Reduced padding from 6 to 3 for mobile */}
const baseClasses = `h-24 md:h-32 flex flex-col items-center justify-center p-2 md:p-2 text-center border backdrop-blur-sm transition
                ${
                  item.type === "scroll" && activeSection === item.target
                    ? "bg-white/30 border-white"
                    : "bg-white/10 border-white/40 hover:bg-white/20"
                }`;

              if (item.type === "services") {
                return (
                  <button
                    key={item.id}
                    onClick={goToServices}
                    className={baseClasses}
                  >
                   <p className="text-2xl md:text-5xl font-light text-white mb-1">
                      {item.id}
                    </p>
                    <span className="text-sm tracking-widest uppercase text-white">
                      {item.label}
                    </span>
                  </button>
                );
              }

              if (item.type === "link") {
                return (
                  <Link key={item.id} href={item.target} className={baseClasses}>
                    <p className="text-2xl md:text-5xl font-light text-white mb-2">
                      {item.id}
                    </p>
                    <span className="text-sm tracking-widest uppercase text-white">
                      {item.label}
                    </span>
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.target)}
                  className={baseClasses}
                >
                  <p className="text-2xl md:text-5xl font-light text-white mb-1">
                    {item.id}
                  </p>
                  <span className="text-sm tracking-widest uppercase text-white">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= WHO WE ARE ================= */}
      <section id="who-we-are" className="py-10 bg-white">
        <div className="max-w-6xl mx-auto px-2 grid grid-cols-1 md:grid-cols-2 gap-18 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
            <h2 className="text-4xl font-bold mb-4 text-black bg-gray-50 text-slate-900">
              Who We Are
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              AACP Infrastructure is a forward-thinking infrastructure development
              company delivering high-quality construction, precast, and engineering
              solutions across diverse sectors.
            </p>
            <p className="text-gray-700 leading-relaxed">
              With a strong emphasis on safety, strategic planning, and execution,
              we transform complex challenges into reliable infrastructure that
              stands the test of time.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            className="relative h-[300px] rounded-xl overflow-hidden shadow-lg"
          >
            <Image
              src="/careers/land-surveyor.jpg"
              alt="AACP Team"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* ================= VISION / MISSION ================= */}
      <section id="vision-mission" className="py-12 text-black bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Our Vision",
              desc: "To shape future-ready infrastructure through innovation and responsibility.",
            },
            {
              title: "Our Mission",
              desc: "To deliver safe, efficient, and sustainable infrastructure solutions.",
            },
            {
              title: "Our Values",
              desc: "Safety, integrity, excellence, teamwork, sustainability.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              className="bg-white p-8 rounded-xl shadow"
            >
              <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
              <p className="text-gray-700">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* ================= OUR JOURNEY ================= */}
<section id="journey" className="py-8 bg-gray-50">
  <div className="max-w-5xl mx-auto px-6">
    {/* Title */}
    <h2 className="text-5xl font-bold text-black text-center mb-14 tracking-wide">
      Our Journey
    </h2>

    <div className="relative">
      {/* Vertical line (thinner) */}
      <div className="absolute left-1/2 top-0 h-full w-[1px] bg-gray-300 -translate-x-1/2" />

      {[
        {
          year: "1991",
          text:
            "Founded to execute external development works for private manufacturing facilities and real estate developers.",
        },
        {
          year: "1996",
          text:
            "Began working with Toyota Kirloskar Motor Pvt. Ltd. for manufacturing unit development at Bidadi.",
        },
        {
          year: "2006",
          text:
            "Executed deep excavation works for Mantri’s landmark Mantri Mall project.",
        },
        {
          year: "2011",
          text:
            "Completed 200 acres of land reclamation and nala rerouting for BOSCH at Bidadi.",
        },
        {
          year: "2016",
          text: "Converted into AACP Infrastructure Systems Pvt. Ltd.",
        },
        {
          year: "2021",
          text: "Launched dedicated Precast Manufacturing Unit.",
        },
        {
          year: "2023",
          text:
            "Ventured into construction of concrete and structural buildings.",
        },
        {
          year: "2024",
          text:
            "Expanded expertise into Pre-Engineered Building (PEB) structures.",
        },
      ].map((item, index) => (
        <motion.div
          key={item.year}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.04 }}
          className={`relative mb-6 flex ${
            index % 2 === 0 ? "justify-start" : "justify-end"
          }`}
        >
          {/* Dot (smaller) */}
          <span className="absolute left-1/2 top-5 w-2.5 h-2.5 bg-gray-900 rounded-full -translate-x-1/2 z-10" />

          {/* Card (smaller) */}
          <div
            className={`w-[calc(50%-32px)] bg-white px-5 py-3 rounded-lg shadow-sm ${
              index % 2 === 0 ? "mr-auto" : "ml-auto"
            }`}
          >
            <p className="text-sm font-bold tracking-widest text-gray-900 mb-1">
              {item.year}
            </p>
            <p className="text-xs text-gray-700 leading-relaxed">
              {item.text}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-gray-900 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Let’s Build the Future Together
        </h2>
        <Link
  href="/contact"
  className="
    inline-flex items-center justify-center
    bg-white text-gray-900
    px-10 py-4
    rounded-lg
    font-medium tracking-wide
    transition-all duration-300
    hover:bg-gray-200
    hover:scale-[1.03]
    focus:outline-none focus:ring-2 focus:ring-white/60
  "
>
  CONTACT US
</Link>

      </section>
    </>
  );
}
