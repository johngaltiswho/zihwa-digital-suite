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

/* ---------------- HERO NAV CONFIG ---------------- */
const heroNav = [
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
    router.push("/");

    setTimeout(() => {
      const el = document.getElementById("services");
      if (!el) return;

      el.scrollIntoView({ behavior: "smooth", block: "start" });

      // temporary highlight
      el.classList.add("ring-2", "ring-red-500", "ring-offset-4");

      setTimeout(() => {
        el.classList.remove("ring-2", "ring-red-500", "ring-offset-4");
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
      <section className="relative h-[90vh] w-full">
        <Image
          src="/images/about-hero.jpg"
          alt="About AACP Infrastructure"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-6 text-white">
            ABOUT AACP INFRASTRUCTURE
          </h1>

          <p className="max-w-4xl text-lg md:text-xl text-gray-200 leading-relaxed">
            Building strong, safe, and sustainable infrastructure for the future.
          </p>

          {/* ================= HERO NAV ================= */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-12">
            {heroNav.map((item) => {
              const baseClasses = `p-6 text-center border backdrop-blur-sm transition
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
                    <p className="text-5xl font-light text-white mb-2">
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
                    <p className="text-5xl font-light text-white mb-2">
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
                  <p className="text-5xl font-light text-white mb-2">
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
      <section id="who-we-are" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
            <h2 className="text-4xl font-bold mb-6 text-black bg-gray-50 text-slate-900">
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
            className="relative h-[450px] rounded-xl overflow-hidden shadow-lg"
          >
            <Image
              src="/images/about-team.jpg"
              alt="AACP Team"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* ================= VISION / MISSION ================= */}
      <section id="vision-mission" className="py-16 text-black bg-gray-50">
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

      {/* ================= STRATEGY ================= */}
      <section id="why-different" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <Image
            src="/images/about-quality.jpg"
            alt="Quality & Safety"
            width={600}
            height={450}
            className="rounded-xl shadow-lg"
          />

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
            <h2 className="text-3xl font-bold text-black bg-gray-50 mb-6">
              What Makes Us Different
            </h2>
            <ul className="space-y-3 text-gray-700 font-medium">
              <li>✔ Safety-first execution</li>
              <li>✔ Strategic planning</li>
              <li>✔ Quality-driven standards</li>
              <li>✔ Sustainable practices</li>
              <li>✔ Skilled engineering teams</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ================= SAFETY / JOURNEY ================= */}
      <section id="journey" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-black bg-gray-50 text-center mb-12">
            Our Journey
          </h2>
          {[
            ["2015", "Company founded"],
            ["2018", "Expanded into precast"],
            ["2021", "Safety milestones achieved"],
            ["2024", "Multi-region execution"],
          ].map(([year, text]) => (
            <div key={year} className="flex gap-6 mb-4">
              <span className="font-bold text-black">{year}</span>
              <p className="text-gray-700">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= INNOVATION / STATS ================= */}
      <section id="stats" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["10+", "Years Experience"],
            ["50+", "Projects"],
            ["100%", "Safety Compliance"],
            ["200+", "Professionals"],
          ].map(([val, label]) => (
            <div key={label}>
              <p className="text-4xl font-bold">{val}</p>
              <p className="text-gray-300">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-white text-center">
        <h2 className="text-4xl font-bold text-black bg-gray-50 mb-6">
          Let’s Build the Future Together
        </h2>
        <Link
          href="/contact"
          className="inline-block bg-gray-900 text-white px-8 py-4 rounded-lg"
        >
          Contact Us
        </Link>
      </section>
    </>
  );
}
