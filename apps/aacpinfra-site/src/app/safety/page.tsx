"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/* ---------------- HERO SLIDES ---------------- */
const slides = [
  {
    title: "Safety First",
    subtitle: "A Core Value at AACP Infrastructure",
    image: "/safety/safety-1.jpg",
  },
  {
    title: "Zero Harm Culture",
    subtitle: "Every Life Matters",
    image: "/safety/safety-2.jpg",
  },
  {
    title: "Injury Free Environment",
    subtitle: "Proactive, Planned, Protected",
    image: "/safety/safety-3.jpg",
  },
  {
    title: "On-Site Safety",
    subtitle: "PPE, Training & Compliance",
    image: "/safety/safety-4.jpg",
  },
  {
    title: "Building Safe Futures",
    subtitle: "Together, Every Day",
    image: "/safety/safety-5.jpg",
  },
];

/* ---------------- ANIMATION ---------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function SafetyPage() {
  const [active, setActive] = useState(0);

  /* ---------------- AUTO SLIDE ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- ARROW HANDLERS ---------------- */
  const prevSlide = () => {
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % slides.length);
  };

  return (
    <main className="bg-white text-black">
      {/* ================= HERO SLIDER ================= */}
      <section className="relative h-[85vh] overflow-hidden">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === active ? 1 : 0 }}
            transition={{ duration: 1 }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl px-6">
                <h1 className="text-4xl md:text-5xl font-light tracking-widest">
                  {slide.title}
                </h1>
                <p className="mt-6 text-lg text-gray-200">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* ================= LEFT CHEVRON (NEW) ================= */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20
                     text-white text-5xl font-light
                     opacity-70 hover:opacity-100 transition"
        >
          ‹
        </button>

        {/* ================= RIGHT CHEVRON (NEW) ================= */}
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20
                     text-white text-5xl font-light
                     opacity-70 hover:opacity-100 transition"
        >
          ›
        </button>

        {/* ================= SLIDE INDICATORS (UNCHANGED) ================= */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === active ? "bg-white w-6" : "bg-white/50 w-2"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ================= SAFETY AT AACP ================= */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6 py-12"
      >
        <h2 className="text-2xl font-medium mb-4">
          Safety at AACP Infrastructure
        </h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          At AACP Infrastructure, safety is a fundamental value that guides every
          aspect of our operations. It is integrated into project planning,
          engineering design, construction execution, and site supervision to ensure
          that all activities are carried out in a safe and controlled manner.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          Our safety culture is built on strong leadership commitment, clearly
          defined responsibilities, and active involvement from employees,
          contractors, and partners. Continuous training and awareness programs
          ensure all personnel are competent and prepared to perform safely.
        </p>

        <p className="text-gray-700 leading-relaxed">
          We encourage open communication and reporting of unsafe conditions,
          near-misses, and incidents. By learning from observations, AACP
          Infrastructure continuously improves its safety systems.
        </p>
      </motion.section>

      {/* ================= EHS ================= */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6 py-4"
      >
        <h3 className="text-2xl font-medium mb-4">
          Environmental Health and Safety
        </h3>

        <p className="text-gray-700 leading-relaxed mb-4">
          Environmental Health and Safety (EHS) is integral to our risk management
          approach. We focus on protecting people, communities, and the environment
          while minimizing the impact of construction activities.
        </p>

        <p className="text-gray-700 leading-relaxed">
          Our teams follow strict environmental controls, conduct regular audits,
          and implement corrective actions to enhance EHS performance across all
          project sites.
        </p>
      </motion.section>

      {/* ================= IFE ================= */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6 py-6"
      >
        <h3 className="text-3xl font-light mb-6">
          IFE (Injury Free Environment)
        </h3>

        <p className="text-gray-700 leading-relaxed mb-8">
          The I.F.E. approach aims to eliminate worksite incidents through
          pre-planning, safety engagement, inspections, and continuous training.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            "Injuries are preventable",
            "Perform a job only if it is safe",
            "Working safely is a condition of employment",
            "Practice and expect safe behavior every day",
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="p-6 border rounded-lg bg-white shadow-sm"
            >
              {item}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= ON-SITE SAFETY ================= */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6 py-6"
      >
        <h3 className="text-2xl font-medium mb-4">
          On-Site Safety Practices
        </h3>
        <p className="text-gray-700 leading-relaxed mb-3">
          Mandatory PPE usage, equipment inspections, and clear site signage form
          the foundation of our on-site safety practices.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Regular audits and corrective actions ensure compliance and incident
          prevention.
        </p>
      </motion.section>

      {/* ================= TOOLBOX MEETINGS ================= */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6 py-6"
      >
        <h3 className="text-2xl font-medium mb-4">
          Safety Tool Box Meetings
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Toolbox meetings are conducted regularly to discuss hazards, reinforce
          safe practices, and encourage team participation.
        </p>
      </motion.section>

      {/* ================= CLOSING CTA ================= */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-black text-white py-24 text-center"
      >
        <h2 className="text-4xl font-light mb-6">
          Safety Is Everyone’s Responsibility
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Safe practices build strong teams, successful projects, and a sustainable
          future.
        </p>
      </motion.section>
    </main>
  );
}
