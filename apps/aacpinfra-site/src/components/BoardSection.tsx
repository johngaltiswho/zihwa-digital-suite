"use client";

import Image from "next/image";
import Link from "next/link";
import { boardData } from "@/data/board";
import { testimonials } from "@/data/testimonials";
import { FaLinkedinIn } from "react-icons/fa";

/* ================= CLIENT LOGOS ================= */
const CLIENT_LOGOS = [
  "/clients/client1.png",
  "/clients/client2.jpg",
  "/clients/client3.png",
  "/clients/client4.png",
  "/clients/client5.jpg",
  "/clients/client6.jpg",
  "/clients/client7.jpg",
  "/clients/client8.png",
  "/clients/client9.png",
  "/clients/client10.png",
  "/clients/client11.png",
  "/clients/client12.jpg",
  "/clients/client13.jpg",
  "/clients/client14.jpg",
];

export default function BoardSection() {
  return (
    <section className="py-18 bg-white text-center">

      {/* ================= CLIENTS ================= */}
      <section
        id="clients"
        className="mb-20 scroll-mt-32"
      >
        <h2 className="text-4xl font-bold tracking-wide mb-10 border-b-2 inline-block pb-2">
          Our Clients
        </h2>

        <div className="overflow-hidden w-full">
          <div className="flex w-max animate-[clientsMarquee_30s_linear_infinite]">
            {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, index) => (
              <div
                key={index}
                className="mx-10 flex items-center opacity-90 hover:opacity-100 transition"
              >
                <img
                  src={logo}
                  alt="Client Logo"
                  className="h-[140px] max-w-[240px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BOARD ================= */}
      <h2 className="text-4xl font-bold tracking-wide mb-14 border-b-2 inline-block pb-2">
        BOARD
      </h2>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
        {boardData.map((member) => (
          <div key={member.id} className="flex flex-col items-center">
            <div
              className="relative w-72 h-52 overflow-hidden mb-8"
              style={{ borderRadius: "50% / 50%" }}
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <p className="text-xl font-bold mb-1">{member.name}</p>
            <p className="text-gray-600 mb-4">{member.role}</p>

            <Link
              href={member.linkedin}
              target="_blank"
              aria-label="LinkedIn"
              className="mt-2 text-gray-400 hover:text-[#0A66C2] transition"
            >
              <FaLinkedinIn size={28} />
            </Link>
          </div>
        ))}
      </div>

     {/* ================= TESTIMONIALS ================= */}
<div>
  <h2 className="text-4xl font-bold tracking-wide mb-8 border-b-2 inline-block pb-2">
    TESTIMONIALS
  </h2>

  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-x-[120px] gap-y-[80px] px-30 justify-items-center">
    {testimonials.map((item) => (
      <div
        key={item.id}
        className="relative text-gray-900 px-18 py-10 min-h-[420px] w-[360px] flex flex-col overflow-hidden"
        style={{
          backgroundImage: `url(${item.bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/15" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* NAME */}
          <div className="min-h-[56px] flex items-center justify-center">
            <h3 className="text-lg font-semibold text-center leading-snug tracking-wide">
              {item.name}, {item.company}
            </h3>
          </div>

          {/* TEXT */}
          <p className="italic text-sm leading-relaxed text-center mt-8 mb-10">
            {item.text}
          </p>

          {/* QUOTE */}
          <div className="text-6xl text-center text-black opacity-80 mt-auto">
            &rdquo;
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

    </section>
  );
}
