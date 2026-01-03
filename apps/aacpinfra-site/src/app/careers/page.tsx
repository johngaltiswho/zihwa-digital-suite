"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

/* ================= ANIMATION ================= */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ================= JOB LIST (VERIFIED) ================= */
const jobs = [
  {
    title: "Civil Site Engineer",
    slug: "civil-site-engineer",
    qualification: "BE / Diploma in Civil Engineering",
    experience: "2 – 5 Years",
    shortDescription:
      "Responsible for on-site execution, supervision, and quality control of civil works.",
  },
  {
    title: "Structural Designer",
    slug: "structural-designer",
    qualification: "BE / M.Tech (Structures)",
    experience: "3+ Years",
    shortDescription:
      "Designs and analyzes RCC and steel structures ensuring safety and code compliance.",
  },
  {
    title: "Business Development Associate",
    slug: "business-development-associate",
    qualification: "MBA / Any Graduate",
    experience: "5+ Years",
    shortDescription:
      "Identifies business opportunities, prepares proposals, and supports client acquisition.",
  },
  {
    title: "Project Control Engineer",
    slug: "project-control-engineer",
    qualification: "BE / B.Tech (Civil or relevant discipline)",
    experience: "3 – 6 Years",
    shortDescription:
      "Manages planning, scheduling, cost tracking, and project reporting.",
  },
  {
    title: "Project Accounts",
    slug: "project-accounts",
    qualification:
      "Bachelor’s Degree in Accounting / Business or related field",
    experience: "3 – 5 Years",
    shortDescription:
      "Handles project billing, budgeting, and financial reconciliation.",
  },
  {
    title: "Quality Control Engineer",
    slug: "quality-control-engineer",
    qualification: "BE / Diploma in Civil Engineering",
    experience: "3 – 5 Years",
    shortDescription:
      "Ensures construction quality through inspections, testing, and compliance checks.",
  },
  {
    title: "Land Surveyor",
    slug: "land-surveyor",
    qualification: "Diploma / Degree in Civil Engineering or related field",
    experience: "2 – 5 Years",
    shortDescription:
      "Conducts land surveys, measurements, and layout marking for project execution.",
  },
  {
    title: "Project Manager",
    slug: "project-manager",
    qualification: "BE / B.Tech in Civil Engineering",
    experience: "5+ Years",
    shortDescription:
      "Leads end-to-end project execution including cost, quality, and timelines.",
  },
  {
    title: "Project Engineer",
    slug: "project-engineer",
    qualification: "BE / B.Tech in Civil Engineering",
    experience: "5+ Years",
    shortDescription:
      "Supports planning, execution, and coordination of site activities.",
  },
  {
    title: "Quantity Surveyor",
    slug: "quantity-surveyor",
    qualification: "BE / Diploma in Civil Engineering",
    experience: "3 – 6 Years",
    shortDescription:
      "Manages Site Assessments, estimation, cost control, and contract measurements.",
  },
];

export default function CareersPage() {
  return (
    <main className="bg-white text-gray-900">

      {/* ================= INTRO ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-6 text-center">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-6xl font-semibold tracking-widest"
        >
          CAREERS
        </motion.h1>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-1 text-xl md:text-2xl font-medium tracking-wide text-gray-700"
        >
          {/* at AACP Infrastructure */}
        </motion.h2>

        <div className="w-16 h-[2px] bg-gray-300 mx-auto mt-4 mb-4" />

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto text-base md:text-lg text-gray-600 leading-relaxed"
        >
          Join AACP Infrastructure Systems Pvt. Ltd. and be part of projects
          that shape India’s growing infrastructure. We value expertise,
          integrity, and commitment to excellence.
        </motion.p>
      </section>

      {/* ================= JOB TABLE ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border border-gray-200 rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="hidden md:grid grid-cols-5 bg-gray-100 px-8 py-4 text-sm font-semibold text-gray-700 tracking-wide">
            <div>Position</div>
            <div>Role Summary</div>
            <div>Qualification</div>
            <div>Experience</div>
            <div className="text-center">Apply</div>
          </div>

          {/* Rows */}
          {jobs.map((job) => (
            <div
              key={job.slug}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 px-8 py-5 border-t hover:bg-gray-50 transition"
            >
              <div className="font-medium text-lg">
                <Link href={`/careers/${job.slug}`} className="hover:underline">
                  {job.title}
                </Link>
              </div>

              <div className="text-gray-700">
                {job.shortDescription}
              </div>

              <div className="text-gray-700">
                {job.qualification}
              </div>

              <div className="text-gray-700">
                {job.experience}
              </div>

              {/* ✅ COMPACT APPLY BUTTON */}
              <div className="flex items-center md:justify-center">
                <Link
                  href={`/careers/${job.slug}`}
                  className="inline-flex items-center justify-center border border-gray-900 px-3 py-1 text-[16px] font-semibold tracking-wider whitespace-nowrap hover:bg-gray-900 hover:text-white transition"
                >
                  View & Apply
                </Link>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ================= APPLY CTA ================= */}
      <section className="bg-gray-900 text-white py-12 text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-semibold mb-2"
        >
          Ready to Apply?
        </motion.h2>

        <p className="mb-5 tracking-wide text-sm md:text-base">
          Email your resume with the job title in the subject line.
        </p>

        <a
          href={`https://docs.google.com/forms/d/e/1FAIpQLSe2rGd_xvuvp_kHC6DY00BpHgCOrozCh2Xm_j7N8HTZpuWz4Q/viewform`}
          target="_blank"
          rel="noopener noreferrer"
          className="
    inline-flex items-center justify-center
    bg-white text-gray-900
    px-10 py-3
    rounded-full
    text-sm font-semibold tracking-widest
    hover:bg-gray-200
    transition
  "
        >
          Apply Now
        </a>

      </section>

    </main>
  );
}
