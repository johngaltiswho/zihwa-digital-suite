import { Metadata } from 'next'
import { Inter } from "next/font/google"
import "./globals.css"
import ClientProviders from './ClientProviders'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://stalknspice.com'),
  title: {
    default: 'Stalks N Spice - Premium Food Ingredients Bangalore | B2B & Retail',
    template: '%s | Stalks N Spice'
  },
  description: 'Premium food distributor in Bangalore since 1997. Sauces, syrups, crushes & specialty ingredients for restaurants, cafes & home chefs. Wholesale & retail. Express delivery HSR Layout, Karnataka.',
  keywords: [
    'food ingredients Bangalore',
    'restaurant suppliers Bangalore',
    'wholesale food distributors',
    'specialty ingredients Bangalore',
    'sauces syrups Bangalore',
    'HORECA suppliers Karnataka',
    'bulk food orders Bangalore',
    'cafe suppliers HSR Layout',
    'gourmet ingredients India',
    'food distributor Karnataka'
  ],
  authors: [{ name: 'Stalks N Spice' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://stalknspice.com',
    siteName: 'Stalks N Spice',
    title: 'Stalks N Spice - Premium Food Ingredients Bangalore | B2B & Retail',
    description: 'Premium food distributor in Bangalore since 1997. Serving restaurants, cafes & home chefs with specialty ingredients, sauces & syrups.',
    images: [{
      url: '/images/sns-logo.png',
      width: 1200,
      height: 630,
      alt: 'Stalks N Spice Logo'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stalks N Spice - Premium Food Ingredients Bangalore',
    description: 'Premium food distributor in Bangalore since 1997. Serving restaurants & home chefs.',
    images: ['/images/sns-logo.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://stalknspice.com'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}