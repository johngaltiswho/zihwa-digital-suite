"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          fontSize: "13px",
          color: "#4b5563",
        }}
      >
        {/* LEFT LINKS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {/* <Link href="/intranet">INTRANET</Link> */}
          <span
  className="text-gray-600 select-none"
 >
  INTRANET
</span>

          <Link href="/privacy-policy">PRIVACY POLICY</Link>
          <Link href="/terms-of-service">
              TERMS OF SERVICE
          </Link>

        </div>

        {/* CENTER TEXT */}
        <div style={{ textAlign: "center", lineHeight: "1.6" }}>
          <div>
            © 2024 by AACP Infrastructure Systems Pvt. Ltd. All Rights Reserved.
          </div>
          <div>Created by Zihwa Insights</div>
        </div>

        {/* RIGHT SOCIAL ICONS */}
        <div style={{ display: "flex", gap: "14px" }}>
          {/* Facebook */}
          <Link
            href="https://www.facebook.com/"
            target="_blank"
            aria-label="Facebook"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="black"
            >
              <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5.004 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 17.004 22 12z" />
            </svg>
          </Link>

          {/* LinkedIn */}
          <Link
            href="https://www.linkedin.com/"
            target="_blank"
            aria-label="LinkedIn"
          >
            <svg
              width="28"
              height="30"
              viewBox="0 0 24 24"
              fill="black"
            >
              <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0zM8 8h4.8v2.2h.07c.67-1.2 2.3-2.47 4.73-2.47 5.06 0 6 3.33 6 7.66V24h-5v-7.98c0-1.9-.03-4.34-2.64-4.34-2.64 0-3.04 2.06-3.04 4.2V24H8z" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
