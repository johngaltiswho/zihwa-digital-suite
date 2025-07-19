import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Invero - Financial Intelligence Platform",
  description: "Modern financial intelligence and analytics platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}