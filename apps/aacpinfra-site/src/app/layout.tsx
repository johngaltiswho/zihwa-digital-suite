import "./globals.css";
import { Header, Footer } from "@repo/ui";
import { Cinzel } from "next/font/google";
import type { ReactNode } from "react"; // ✅ FIX

export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function RootLayout({
  children,
}: {
  children: ReactNode; // ✅ use ReactNode directly
}) {
  return (
    <html lang="en">
      <body
        className={cinzel.className}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
  
}
