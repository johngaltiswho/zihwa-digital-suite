"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "SAFETY", href: "/safety" },
  { label: "STRATEGY", href: "/strategy" },
  { label: "CAREERS", href: "/careers" },
  { label: "NEWS", href: "/news" },
  { label: "PROJECTS", href: "/projects" },
  { label: "PRECAST", href: "/precast" },
  { label: "CONTACT US", href: "/contact", isButton: true },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
      }}
    >
      {/* ================= TOP BAR ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "12px 205px 4px",
          gap: "24px",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        <Link href="/intranet" className="top-link">
          INTRANET
        </Link>

        <Link
          href="/sub-contractor-registration"
          className="top-link"
        >
          SUB CONTRACTOR REGISTRATION
        </Link>
      </div>

      {/* ================= MAIN HEADER ================= */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "6px 160px 8px",
          gap: "18px",
        }}
      >
        {/* LOGO */}
        <Link href="/" style={{ flexShrink: 0 }}>
          <Image
            src="/aacp-logo.jpg"
            alt="AACP Infra"
            width={90}
            height={22}
            priority
            style={{ transform: "translateY(-18px)" }}
          />
        </Link>

        {/* NAVIGATION */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "36px",
            flexGrow: 1,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            if (item.isButton) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="contact-btn"
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${
                  isActive ? "nav-link-active" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
