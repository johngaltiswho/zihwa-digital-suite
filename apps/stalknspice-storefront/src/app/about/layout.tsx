import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Premium Food Distributor Bangalore Since 1997',
  description: 'Stalks N Spice - pioneering food distributor serving HORECA industry in Bangalore since 1997. Authorized distributors for Dabur, Kellogg. Own brands TOPPS & MY FAVOURITE. HSR Layout headquarters, Karnataka.',
  keywords: [
    'food distributor Bangalore history',
    'HORECA suppliers Karnataka',
    'food wholesaler since 1997',
    'TOPPS brand India',
    'MY FAVOURITE brand',
    'Dabur distributor Bangalore',
    'Kellogg distributor Karnataka',
    'established food supplier Bangalore'
  ],
  openGraph: {
    type: 'website',
    url: 'https://stalknspice.com/about',
    title: 'About Stalks N Spice | Premium Food Distributor Since 1997',
    description: 'Pioneering HORECA food distributor in Bangalore since 1997. Authorized distributors for leading brands.',
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
    title: 'About Stalks N Spice | Food Distributor Since 1997',
    description: 'Pioneering HORECA food distributor in Bangalore since 1997.',
    images: ['/images/sns-logo.png']
  },
  alternates: {
    canonical: 'https://stalknspice.com/about'
  }
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
