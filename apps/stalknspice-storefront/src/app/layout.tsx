import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StalksHeader, StalknSpiceFooter  } from "@repo/ui"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stalks N Spice | Premium Food Store",
  description: "Bringing Gourmet Food & Products to your doorstep",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const stalkNavItems = [
    { label: "Bakery, Snacks & Dry Fruits", href: "/category/bakery" },
    { label: "Breakfast, Dairy & Frozen Food", href: "/category/dairy" },
    { label: "Canned Foods", href: "/category/canned" },
    { label: "Fruits & Vegetables", href: "/category/produce" },
    { label: "Health Store", href: "/category/health" },
    { label: "Herbs, Spices & Provisions", href: "/category/spices" },
    { label: "Beverages", href: "/category/beverages" },
    { label: "Rice, Pasta & Noodles", href: "/category/rices" },
    { label: "Sauces & Pastes", href: "/category/sauces" },
    { label: "Oils & Ghee", href: "/category/oils" },
  ];

  return (
    <html lang="en">
      <body className={inter.className}>
        <StalksHeader 
          navItems={stalkNavItems} 
          logoSrc="/images/sns-logo.png" 
          isEcommerce={true} 
        />
        
        <main className="min-h-screen"> 
          {children}
        </main>
        <StalknSpiceFooter />
      </body>
    </html>
  );
}