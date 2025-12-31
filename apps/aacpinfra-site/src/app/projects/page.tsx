"use client";

import { useState } from "react";
import type { NewsItem } from "@/types/news";
import { newsData } from "@/data/news";
import { ongoingProjects } from "@/data/ongoingProjects";

import OngoingProjects from "@/components/projects/OngoingProjects";
import FeaturedProjects from "@/components/projects/FeaturedProjects";

import { motion } from "framer-motion";

/* ================= MOTION VARIANTS ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function ProjectsPage() {
  /* ================= FEATURED PROJECTS ================= */
  const featuredProjects: NewsItem[] = newsData.filter((item) =>
    item.categories.includes("Project")
  );

  /* ================= YEAR FILTER ================= */
  const years = Array.from(
    new Set(featuredProjects.map((item) => item.date))
  ).sort((a, b) => Number(b) - Number(a));

  const [selectedYear, setSelectedYear] = useState<string>("all");

  const filteredFeaturedProjects = featuredProjects.filter(
    (item) => selectedYear === "all" || item.date === selectedYear
  );

  return (
    <main className="bg-white">
      {/* ================= CURRENT PROJECTS ================= */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl text-black font-semibold mb-8 border-b-2 inline-block"
          >
            Current Projects
          </motion.h1>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <OngoingProjects projects={ongoingProjects} />
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURED PROJECTS ================= */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* HEADING + YEAR FILTER */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center md:justify-between mb-14"
          >
            <h2 className="text-4xl text-black font-semibold border-b-2 inline-block">
              Featured Projects
            </h2>

           <div className="flex items-center gap-3 mt-4 md:mt-0">
  <span className="text-sm font-medium text-gray-700">
    Filter by Year 
  </span>

  <select
    value={selectedYear}
    onChange={(e) => setSelectedYear(e.target.value)}
    className="border border-gray-900 rounded-md px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
  >
    <option value="all">All</option>
    {years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>
</div>

          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <FeaturedProjects projects={filteredFeaturedProjects} />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
