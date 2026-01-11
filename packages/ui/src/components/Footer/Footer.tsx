"use client";

type LinkProps = {
  href: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
};

function AppLink({ href, children, target, rel }: LinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {children}
    </a>
  );
}

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
          <span className="text-gray-600 select-none">INTRANET</span>

          <AppLink href="/privacy-policy">PRIVACY POLICY</AppLink>
          <AppLink href="/terms-of-service">TERMS OF SERVICE</AppLink>
        </div>

        {/* CENTER */}
        <div style={{ textAlign: "center", lineHeight: "1.6" }}>
          <div>
            © 2024 by AACP Infrastructure Systems Pvt. Ltd. All Rights Reserved.
          </div>
          <div>Created by Zihwa Insights</div>
        </div>

        {/* RIGHT SOCIAL */}
        <div style={{ display: "flex", gap: "14px" }}>


          <AppLink
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* SVG */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="black">
              <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5.004 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 17.004 22 12z" />
            </svg>
          </AppLink>
          
          <AppLink
            href="https://www.instagram.com/aacpinfra/"
            target="_blank"
            rel="noopener noreferrer"
          >
          <svg width="30" height="30" viewBox="0 0 24 20" fill="black" aria-label="Instagram" >
              <path d="M7 2C4.238 2 2 4.238 2 7v10c0 2.762 2.238 5 5 5h10c2.762 0 5-2.238 5-5V7c0-2.762-2.238-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3.5A4.5 4.5 0 1 0 16.5 12 4.505 4.505 0 0 0 12 7.5zm0 7.4A2.9 2.9 0 1 1 14.9 12 2.904 2.904 0 0 1 12 14.9zm4.75-8.65a1.05 1.05 0 1 0 1.05 1.05 1.05 1.05 0 0 0-1.05-1.05z" />
          </svg>
          </AppLink>

          <AppLink
            href="https://www.linkedin.com/company/aacpinfra/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="28" height="30" viewBox="0 0 24 24" fill="black">
              <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0zM8 8h4.8v2.2h.07c.67-1.2 2.3-2.47 4.73-2.47 5.06 0 6 3.33 6 7.66V24h-5v-7.98c0-1.9-.03-4.34-2.64-4.34-2.64 0-3.04 2.06-3.04 4.2V24H8z" />
            </svg>
          </AppLink>

        </div>
      </div>
    </footer>
  );
}
