"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function FooterTop() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    emailjs
      .sendForm(
        "service_z5rd14m",        // ✅ YOUR SERVICE ID
        "template_leoojjk",    // ✅ YOUR TEMPLATE ID
        formRef.current!,
        "cvKw9esznnmzIfSPC"         // ✅ YOUR PUBLIC KEY
      )
      .then(
        () => {
          setSuccess("Message sent successfully!");
          formRef.current?.reset();
        },
        (error) => {
          console.error(error);
          alert("Failed to send message. Please try again.");
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <section className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ================= AACP + HEAD OFFICE ================= */}
        <div>
          <div className="flex items-start gap-3 mb-2">
            <Image
              src="/aacp-logo.jpg"
              alt="AACP Logo"
              width={90}
              height={40}
              className="object-contain -mt-3"
            />
            <h3 className="text-m font-bold leading-snug">
              AACP Infrastructure <br />
              Systems Pvt. Ltd.
            </h3>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            Engineering excellence in civil construction and infrastructure
            development since 1998. Building tomorrow’s infrastructure today.
          </p>

          <div className="text-m text-gray-700 space-y-1">
            <p className="font-semibold mb-1 inline-block border-b-2 border-black pb-1">
              Head Office
            </p>
            <p>#403, 3rd Floor, 22nd Cross</p>
            <p>H.S.R Layout, Sector 6</p>
            <p>Bangalore – 560102</p>
          </div>
        </div>

        {/* ================= COMPANY + INQUIRIES ================= */}
        <div>
          <h4 className="text-lg font-semibold mb-3 inline-block border-b-2 border-black pb-2">
            Company
          </h4>
          <ul className="space-y-2 text-sm text-gray-700 mb-5">
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/news">News & Updates</Link></li>
            <li><Link href="/#clients">Clients & Partners</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>

          <h4 className="text-lg font-semibold mb-3 inline-block border-b-2 border-black pb-2">
            Inquiries
          </h4>
          <p className="text-sm text-gray-700 mb-3">
            For any inquiries, questions or commendations:
          </p>

          <p className="text-sm">
  ✉️{" "}
  <a
    href="mailto:info@aacpinfra.com"
    className="hover:underline text-gray-800"
  >
    info@aacpinfra.com
  </a>
</p>

<p className="text-sm">
  📞{" "}
  <a
    href="tel:+919403890723"
    className="hover:underline text-gray-800"
  >
    +91 94038 90723
  </a>
</p>
        </div>

        {/* ================= CONTACT FORM ================= */}
        <div>
          <h4 className="text-lg font-semibold mb-4">
            Connect With Us
          </h4>

          <form ref={formRef} onSubmit={sendEmail} className="space-y-3">
            <input
              type="text"
              name="from_name"
              placeholder="Name *"
              required
              className="w-full bg-gray-100 px-4 py-2 text-sm outline-none"
            />

            <input
              type="email"
              name="from_email"
              placeholder="Email *"
              required
              className="w-full bg-gray-100 px-4 py-2 text-sm outline-none"
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="w-full bg-gray-100 px-4 py-2 text-sm outline-none"
            />

            <textarea
              name="message"
              placeholder="Message"
              rows={4}
              required
              className="w-full bg-gray-100 px-4 py-2 text-sm outline-none resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white text-sm px-6 py-2 hover:bg-gray-800 transition disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send"}
            </button>

            {success && (
              <p className="text-sm text-green-600 mt-2">{success}</p>
            )}
          </form>
        </div>

      </div>
    </section>
  );
}
