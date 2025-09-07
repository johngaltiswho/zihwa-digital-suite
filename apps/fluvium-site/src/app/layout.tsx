import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fluvium - Find Your Flow",
  description: "Where discipline meets flow and ancient wisdom meets modern life. Discover the warrior mindset that transforms everything you touch.",
  icons: {
    icon: "/logo-default.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}