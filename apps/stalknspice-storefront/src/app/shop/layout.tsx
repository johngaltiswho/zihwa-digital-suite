import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop Premium Food Ingredients Online Bangalore | 1000+ Products',
  description: 'Browse 1000+ premium food ingredients, sauces, syrups, pasta, specialty items online. Wholesale & retail pricing. Express delivery in Bangalore, Karnataka. Restaurant suppliers & home chef essentials.',
  keywords: [
    'buy food ingredients online Bangalore',
    'wholesale food products',
    'restaurant supplies Bangalore',
    'specialty ingredients online India',
    'bulk food order Karnataka',
    'gourmet ingredients Bangalore',
    'shop food products online',
    'HORECA supplies online'
  ],
  openGraph: {
    type: 'website',
    url: 'https://stalknspice.com/shop',
    title: 'Shop Premium Food Ingredients | Stalks N Spice',
    description: '1000+ premium ingredients for restaurants & home chefs. Express delivery Bangalore.',
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
    title: 'Shop Premium Food Ingredients | Stalks N Spice',
    description: '1000+ premium ingredients for restaurants & home chefs.',
    images: ['/images/sns-logo.png']
  },
  alternates: {
    canonical: 'https://stalknspice.com/shop'
  }
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
