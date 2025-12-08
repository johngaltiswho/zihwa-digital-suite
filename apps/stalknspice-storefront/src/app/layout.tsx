import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stalks N Spice - Premium International Ingredients",
  description: "Your one-stop destination for premium international spices, ingredients, and gourmet food products. Delivery within 45 minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}