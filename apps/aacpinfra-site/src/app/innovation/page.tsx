"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/* ---------------- ANIMATION ---------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function InnovationPage() {
  return (
    <main className="bg-white text-black">

      {/* ================= HERO ================= */}
      <section className="relative h-[75vh] w-full">
        <Image
          src="/innovation/innovation-hero.jpg"
          alt="Innovation at AACP Infrastructure"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-widest text-white mb-6">
            INNOVATION
          </h1>
          <p className="max-w-3xl text-lg md:text-xl text-gray-200 leading-relaxed">
            Leveraging technology, systems, and sustainable practices to
            transform construction delivery.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-5xl mx-auto px-6 py-20 space-y-14">

        {/* ================= BIM ================= */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold mb-6">
            Building Information Modelling (BIM)
          </h2>

          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              Building Information Modelling commonly known as BIM is an
              intelligent 3D/4D model-based process that equips architecture,
              engineering, and construction professionals with the insight
              and tools to more efficiently plan, design, construct, and
              manage buildings and infrastructure.
            </p>

            <p>
              We at Associated Asphalt use BIM for clash detection, preparing
              cost estimates, scheduling, running safety analysis and
              preparing site logistic plans.
            </p>
          </div>
        </motion.div>

        {/* ================= LEAN CONSTRUCTION ================= */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold mb-6">
            Lean Construction
          </h2>

          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              Lean construction is a “way to design production systems to
              minimize waste of materials, time, and effort in order to
              generate the maximum possible amount of value,” (Koskela et al.
              2002).
            </p>

            <p>
              Lean Construction extends from the objectives of a lean
              production system – maximize value and minimize waste – to
              specific techniques, and applies them in a new project delivery
              process.
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                The facility and its delivery process are designed together
                to better reveal and support customer purposes.
              </li>
              <li>
                Work is structured throughout the process to maximize value
                and to reduce waste at the project delivery level.
              </li>
              <li>
                Efforts to manage and improve performance are aimed at
                improving total project performance rather than individual
                activities.
              </li>
              <li>
                “Control” is redefined from monitoring results to making
                things happen.
              </li>
            </ul>
          </div>
        </motion.div>

        {/* ================= GREEN CONSTRUCTION ================= */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold mb-6">
            Green Construction
          </h2>

          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              Development is inevitable. But at what cost?
            </p>

            <p>
              We at Associated Asphalt believe that Sustainable Development
              is vital to leave future generations with the world that is
              environmentally richer than the one we currently live in right
              now.
            </p>

            <p>
              That is why we have adopted Green Construction and have pledged
              that by 2020 all our projects will be rated LEED Gold or higher.
            </p>
          </div>
        </motion.div>

      </section>
    </main>
  );
}
