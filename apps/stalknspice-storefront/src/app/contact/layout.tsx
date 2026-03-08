import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Stalks N Spice Bangalore | HSR Layout',
  description: 'Contact Stalks N Spice for bulk orders, wholesale pricing & specialty ingredients in Bangalore. Located in HSR Layout, Karnataka. Phone, email & visit us. Serving restaurants, cafes & home chefs since 1997.',
  keywords: [
    'contact Stalks N Spice',
    'food suppliers Bangalore contact',
    'HSR Layout food distributors',
    'wholesale food inquiry',
    'bulk order contact',
    'restaurant suppliers Bangalore phone',
    'HORECA suppliers contact Karnataka'
  ],
  openGraph: {
    type: 'website',
    url: 'https://stalknspice.com/contact',
    title: 'Contact Us | Stalks N Spice Bangalore',
    description: 'Contact us for bulk orders & specialty ingredients in Bangalore. HSR Layout, Karnataka.',
    siteName: 'Stalks N Spice',
    images: [{
      url: '/images/sns-logo.png',
      width: 1200,
      height: 630,
      alt: 'Stalks N Spice'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Stalks N Spice',
    description: 'Contact us for bulk orders & specialty ingredients in Bangalore.',
    images: ['/images/sns-logo.png']
  },
  alternates: {
    canonical: 'https://stalknspice.com/contact'
  }
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
