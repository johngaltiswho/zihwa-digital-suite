export default function LocalBusinessSchema() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://stalknspice.com/#organization',
    name: 'Stalks N Spice',
    alternateName: 'STALKS \'n\' SPICE',
    description: 'Premium food distributor in Bangalore since 1997. Serving restaurants, cafes, institutions and home chefs with specialty ingredients, sauces, syrups, and gourmet products.',
    url: 'https://stalknspice.com',
    telephone: '+91-80-XXXX-XXXX', // Replace with actual phone number
    email: 'info@stalknspice.com', // Replace with actual email
    logo: 'https://stalknspice.com/images/sns-logo.png',
    image: 'https://stalknspice.com/images/sns-logo.png',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'HSR Layout', // Add full street address
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      postalCode: '560102', // Replace with actual postal code
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 12.9121, // Replace with actual coordinates for HSR Layout
      longitude: 77.6446
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Bangalore',
        '@id': 'https://en.wikipedia.org/wiki/Bangalore'
      },
      {
        '@type': 'State',
        name: 'Karnataka'
      },
      {
        '@type': 'City',
        name: 'Mysore'
      },
      {
        '@type': 'City',
        name: 'Hyderabad'
      }
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00'
      }
    ],
    paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, Net Banking',
    currenciesAccepted: 'INR',
    foundingDate: '1997',
    slogan: 'Premium Food Service Distributor Since 1997',
    servesCuisine: [
      'Italian',
      'Chinese',
      'Thai',
      'Indian',
      'Japanese',
      'Korean',
      'American',
      'European'
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Food Products',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Specialty Sauces & Condiments'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Coffee Syrups & Crushes'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Premium Pasta & Noodles'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Specialty Ingredients'
          }
        }
      ]
    },
    sameAs: [
      // Add social media URLs when available
      // 'https://www.facebook.com/stalknspice',
      // 'https://www.instagram.com/stalknspice',
      // 'https://www.linkedin.com/company/stalknspice'
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
