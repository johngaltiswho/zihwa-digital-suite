import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - Ordering, Delivery, Wholesale | Stalks N Spice Bangalore',
  description: 'Frequently asked questions about ordering, delivery, wholesale pricing, bulk orders, payment methods & product availability at Stalks N Spice Bangalore. Get answers to common questions about restaurant supplies.',
  keywords: [
    'Stalks N Spice FAQ',
    'delivery questions Bangalore',
    'wholesale pricing FAQ',
    'bulk order questions',
    'food distributor FAQ',
    'restaurant supplies questions',
    'HORECA suppliers FAQ Karnataka'
  ],
  openGraph: {
    type: 'website',
    url: 'https://stalknspice.com/faq',
    title: 'Frequently Asked Questions | Stalks N Spice',
    description: 'Get answers to common questions about ordering, delivery & wholesale pricing.',
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
    title: 'FAQ | Stalks N Spice',
    description: 'Get answers to common questions about ordering & delivery.',
    images: ['/images/sns-logo.png']
  },
  alternates: {
    canonical: 'https://stalknspice.com/faq'
  }
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children
}
