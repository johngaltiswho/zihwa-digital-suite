"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import JobComments from "@/components/JobComments";

/* ================= ANIMATION ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

/* ================= JOB DATA ================= */
const jobs = [
  { title: "Civil Site Engineer", slug: "civil-site-engineer", image: "/careers/civil-site-engineer.jpg" },
  { title: "Structural Designer", slug: "structural-designer", image: "/careers/structural-designer.jpg" },
  { title: "Business Development Associate", slug: "business-development-associate", image: "/careers/business-development.jpg" },
  { title: "Project Control Engineer", slug: "project-control-engineer", image: "/careers/project-control.jpg" },
  { title: "Project Accounts", slug: "project-accounts", image: "/careers/project-accounts.jpg" },
  { title: "Quality Control Engineer", slug: "quality-control-engineer", image: "/careers/quality-control.jpg" },
  { title: "Land Surveyor", slug: "land-surveyor", image: "/careers/land-surveyor.jpg" },
  { title: "Project Manager", slug: "project-manager", image: "/careers/project-manager.jpg" },
  { title: "Project Engineer", slug: "project-engineer", image: "/careers/project-engineer.jpg" },
  { title: "Quantity Surveyor", slug: "quantity-surveyor", image: "/careers/quantity-surveyor.jpg" },
];

export default function CareersPage() {
  return (
    <main className="bg-white text-gray-900">

      {/* ================= HERO ================= */}
      <section className="relative h-[70vh] flex items-center">
        <Image
          src="/careers/herocareers.jpg"
          alt="Careers at AACP Infrastructure"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative max-w-6xl mx-auto px-6 text-white"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-widest">
            CAREERS
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-200">
            Build your future with AACP Infrastructure and contribute
            to projects that shape India’s growth.
          </p>
        </motion.div>
      </section>

      {/* ================= NOTICE ================= */}
      <section className="max-w-5xl mx-auto px-6 pt-8 pb-4">
        <p className="text-sm text-gray-600 leading-relaxed italic">
          <span className="font-semibold not-italic">
            NOTICE TO THIRD PARTY AGENCIES:
          </span>{" "}
          Please note that AACP does not accept unsolicited resumes from recruiters
          or employment agencies. In the absence of a signed Recruitment Fee
          Agreement, AACP will not consider or agree to payment of any referral
          compensation or recruiter fee. In the event a recruiter or agency submits
          a resume or candidate without a previously agreed arrangement, AACP
          explicitly reserves the right to pursue and hire those candidate(s)
          without any financial obligation to the recruiter or agency.
        </p>
      </section>

      {/* ================= JOB OPENINGS ================= */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-36">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-4xl font-semibold text-center mb-14 underline underline-offset-6"
        >
          Job Openings
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-24"
        >
          {jobs.map((job, index) => (
            <motion.div
              key={job.slug}
              variants={fadeUp}
              className="grid grid-cols-1 md:grid-cols-2 gap-28 items-center"
            >
              {/* Image (CLICKABLE) */}
              <Link
                href={`/careers/${job.slug}`}
                className={`rounded-lg overflow-hidden mx-auto block cursor-pointer ${
                  index % 2 !== 0 ? "md:order-2" : ""
                }`}
                style={{ maxWidth: "380px" }}
              >
                <Image
                  src={job.image}
                  alt={job.title}
                  width={420}
                  height={280}
                  className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                />
              </Link>

              {/* Content */}
              <div className={index % 2 !== 0 ? "md:order-1" : ""}>
                <h3 className="text-4xl font-semibold mb-4 hover:text-gray-600 transition">
                  <Link href={`/careers/${job.slug}`}>
                    {job.title}
                  </Link>
                </h3>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  Join AACP Infrastructure and work on large-scale
                  infrastructure projects across India.
                </p>

                <Link
                  href={`/careers/${job.slug}`}
                  aria-label={`Apply for ${job.title}`}
                  className="inline-flex items-center border border-black px-8 py-2 text-sm tracking-widest hover:bg-black hover:text-white transition"
                >
                  APPLY NOW →
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= READY TO APPLY ================= */}
      <section className="bg-gray-900 text-white py-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold mb-4">
            Ready to Apply?
          </h2>

          <p className="mb-10 tracking-wide">
            Email your resume with the job title in the subject line.
          </p>

          <a
            href="mailto:careers@aacpinfra.com"
            className="inline-block border border-white px-12 py-3 text-sm tracking-widest hover:bg-white hover:text-black transition"
          >
            APPLY NOW
          </a>
        </motion.div>
      </section>

      {/* ================= COMMENTS ================= */}
      <section className="mt-24">
        <JobComments slug="careers" />
      </section>

    </main>
  );
}
