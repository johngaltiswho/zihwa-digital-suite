"use client";

import Link from "next/link";

export default function AboutOverview() {
  return (
    <section className="bg-white py-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* ================= LEFT COLUMN – ABOUT US ================= */}
        <div className="md:col-span-2">
          <h2
            className="font-heading text-4xl font-semibold mb-3 inline-block border-b-2 border-black pb-2"
          >
            ABOUT US
          </h2>

          <p
            className="font-body mt-6 text-gray-800 text-[16px] leading-[2]"
          >
            We at AACP are reinvigorating the traditional practices of
            General Contracting by blending the timeless tools of project
            management with Data Analytics, Building Information Modelling
            (BIM), Lean Construction and Green Construction. With the
            proliferation of technology, we intend to ingrain these tools
            into our arsenal of project management techniques to eliminate
            cost and budget overruns and strive towards eliminating injuries
            and deaths in the workplace.
          </p>

          {/* ABOUT PAGE LINK */}
          <Link
            href="/about"
            className="mt-6 inline-block text-red-600 underline text-lg hover:opacity-80 transition"
          >
            Read More
          </Link>
        </div>

        {/* ================= RIGHT COLUMN – SAFETY & INNOVATION ================= */}
        <div className="space-y-12">

          {/* SAFETY CULTURE */}
          <div>
            <h3
              className="font-heading text-3xl font-semibold inline-block border-b-2 border-black pb-2 mb-4 tracking-wide"
            >
              SAFETY CULTURE
            </h3>

            <p
              className="font-body text-gray-800 leading-relaxed"
            >
              AACP breathes a culture of Injury Free Environment. Every
              employee, from the CEO to the workers on the site, has
              adopted this culture to ensure a safe working atmosphere
              for all who enter our work sites.
            </p>

            <Link
              href="/safety"
              className="mt-3 inline-block text-red-600 underline hover:opacity-80 transition"
            >
              Read More
            </Link>
          </div>

          {/* INNOVATION */}
          <div>
            <h3
              className="font-heading text-3xl font-semibold inline-block border-b-2 border-black pb-2 mb-4 tracking-wide"
            >
              INNOVATION
            </h3>

            <p
              className="font-body text-gray-800 leading-relaxed"
            >
              AACP encourages and motivates its employees to continually
              seek and adopt new techniques and technology to reform the
              construction management process.
            </p>

            <Link
              href="/innovation"
              className="mt-3 inline-block text-red-600 underline hover:opacity-80 transition"
            >
              Read More
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
