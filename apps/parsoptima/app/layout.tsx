import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pars Optima Enterprises LLP - Efficient FMCG Distribution Across South India",
  description: "Trusted FMCG distributor serving General Trade, Modern Trade, and HoReCa across Bangalore, Hosur, and Hyderabad. Handling 200+ daily deliveries with 10+ vehicles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}