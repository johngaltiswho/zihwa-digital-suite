"use client";

import Image from "next/image";
import { motion,type Variants } from "framer-motion";

/* ---------------- ANIMATION ---------------- */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function StrategyPage() {
  return (
    <main className="bg-white text-gray-800">

      {/* ================= HERO ================= */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/strategy/hero.jpg"
          alt="AACP Strategy"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative text-white text-5xl md:text-6xl tracking-[0.35em] font-light"
        >
          STRATEGY
        </motion.h1>
      </section>

      {/* ================= STRATEGY ================= */}
      <section className="-mt-18 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white shadow-xl rounded-lg grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x"
          >
            {[
              { title: "Planning", value: "Disciplined & Data Driven" },
              { title: "Execution", value: "Controlled & Scalable" },
              { title: "Safety", value: "Zero Harm Focus" },
              { title: "Growth", value: "Sustainable & Regional" },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 text-center hover:bg-gray-50 transition"
              >
                <h4 className="text-xs font-bold tracking-widest text-gray-500 mb-3">
                  {item.title.toUpperCase()}
                </h4>
                <p className="text-lg font-semibold text-gray-900">
                  {item.value}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-6xl mx-auto px-6 pt-18 pb-24 space-y-18">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-5xl"
        >
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Our Strategic Philosophy
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            At AACP Infrastructure, strategy is not a static document. It is a
            continuous decision-making framework that guides how we plan,
            execute, manage risk, and grow responsibly within India’s evolving
            infrastructure landscape. Our business plan 2017-2022, Rapid Expansion, outlines the strategic direction that will take AACP to the next level. 
            After, 5-6 years of organic growth, our aim is to seek rapid growth by aggressively seeking new clientele, venturing into new territories, 
            seeking and hiring the best talent and expanding our portfolio of services and projects.
          </p>
        </motion.div>
        {/* EXECUTION FLOW */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold text-gray-900  mb-14">
            Our Execution Approach
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 text-center">
            {[
              "Opportunity Assessment",
              "Detailed Planning",
              "Resource Mobilization",
              "Controlled Execution",
              "Quality Delivery",
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl font-light text-gray-300 mb-4">
                  {`0${i + 1}`}
                </div>
                <p className="text-gray-900 font-medium">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* DEEP CONTENT */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-18 max-w-5xl"
        >
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Services</h3>
            <p className="text-gray-700 leading-relaxed">
              AACP continues to strengthen its end-to-end project capabilities
              through Design–Bid–Build, Joint Ventures, and Turnkey delivery
              models. Parallel investments in construction products and material
              manufacturing support quality consistency and supply-chain
              reliability. By venturing into Design Bid Build (DBB) projects, Joint Ventures (JV) for commercial development, 
              Turnkey Projects and most importantly our long-standing goal of construction products (spun pipes, cold ready mix asphalt, etc.),
              we will be able to leverage the infrastructure boom in India to achieve our strategic vision.   

​
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Talent</h3>
            <p className="text-gray-700 leading-relaxed">
              Our people-centric strategy focuses on building a skilled,
              accountable, and collaborative workforce supported by leadership
              development and continuous learning. To reach our goals we plan to offer a place to work with dedicated colleagues in an open and high-performance culture with sound values,
              a company that fosters collaboration and development, and an organisation where every employee has a strong passion 
              to deliver results and contribute to our vision. Thus, in order to be more prepared than our competitors and capitalise quickly on new opportunities, 
              we are continuously seeking the best of the best, to add on to our highly talented candidate pool. 
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Safety, Sustainability & Geography
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Safety and sustainability are embedded into all strategic
              decisions. Based out of and with most of our projects clustered around Bangalore, 
              we plan to expand and establish a strong foothold in south India states such as Kerala, Tamil Nadu, Andhra Pradesh, etc.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ================= STRATEGIC OUTLOOK ================= */}
      <section className="bg-gray-900 text-white py-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-5xl mx-auto px-6 text-center"
        >
          <h2 className="text-3xl font-semibold mb-6">
            Building Infrastructure with Long-Term Vision
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Through disciplined planning, structured execution, and responsible
            growth, AACP Infrastructure continues to deliver infrastructure
            solutions that create lasting value for clients, communities, and
            stakeholders.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
