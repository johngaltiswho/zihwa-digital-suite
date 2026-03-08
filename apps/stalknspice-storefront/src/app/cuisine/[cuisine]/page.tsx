import { Metadata } from 'next'
import CuisinePageClient from './CuisinePageClient'

// Cuisine metadata configuration with B2C/B2B dual messaging and local SEO
const CUISINE_META: Record<string, {
  title: string
  description: string
  keywords: string[]
}> = {
  'italian': {
    title: 'Italian Ingredients & Products Bangalore | Restaurant Suppliers',
    description: 'Authentic Italian ingredients, pasta, sauces & specialty products for restaurants & home chefs in Bangalore. Barilla, De Cecco, imported olive oils. Wholesale & retail. Express delivery Karnataka.',
    keywords: [
      'Italian ingredients Bangalore',
      'Italian pasta suppliers',
      'authentic Italian products India',
      'restaurant Italian supplies',
      'wholesale Italian food Karnataka',
      'Barilla pasta Bangalore',
      'De Cecco products HSR Layout',
      'buy Italian ingredients online'
    ]
  },
  'chinese': {
    title: 'Chinese Ingredients & Sauces Bangalore | Asian Food Suppliers',
    description: 'Premium Chinese ingredients, sauces, noodles & condiments for restaurants & home cooking in Bangalore. Lee Kum Kee, authentic imports. Bulk orders available. Fast delivery Karnataka.',
    keywords: [
      'Chinese ingredients Bangalore',
      'Chinese sauces suppliers',
      'Asian food products India',
      'restaurant Chinese supplies',
      'wholesale Chinese ingredients Karnataka',
      'Lee Kum Kee Bangalore',
      'authentic Chinese sauces HSR Layout',
      'buy Chinese products online'
    ]
  },
  'indian': {
    title: 'Indian Specialty Ingredients Bangalore | Restaurant Suppliers',
    description: 'Premium Indian ingredients, spices, chutneys & specialty products for restaurants, cafes & home chefs in Bangalore. Authentic regional flavors. Wholesale pricing available. Express delivery Karnataka.',
    keywords: [
      'Indian ingredients Bangalore',
      'Indian spices suppliers',
      'specialty Indian products',
      'restaurant Indian supplies',
      'wholesale Indian ingredients Karnataka',
      'regional Indian flavors',
      'authentic Indian products HSR Layout',
      'buy Indian ingredients online'
    ]
  },
  'thai': {
    title: 'Thai Ingredients & Curry Pastes Bangalore | Asian Food Suppliers',
    description: 'Authentic Thai ingredients, curry pastes, coconut milk & specialty sauces for restaurants in Bangalore. Blue Elephant, imported brands. Bulk orders available. Express delivery Karnataka.',
    keywords: [
      'Thai ingredients Bangalore',
      'Thai curry pastes suppliers',
      'authentic Thai products India',
      'restaurant Thai supplies',
      'wholesale Thai ingredients Karnataka',
      'Blue Elephant products Bangalore',
      'Thai coconut milk HSR Layout',
      'buy Thai ingredients online'
    ]
  },
  'american': {
    title: 'American Food Products Bangalore | Imported Ingredients',
    description: 'Import American food products, sauces, syrups & ingredients for cafes & restaurants in Bangalore. Hersheys, Kraft, imported brands. Wholesale & retail. Fast delivery Karnataka.',
    keywords: [
      'American food products Bangalore',
      'imported American ingredients',
      'American sauces suppliers India',
      'restaurant American supplies',
      'wholesale American products Karnataka',
      'Hersheys Bangalore',
      'Kraft products HSR Layout',
      'buy American ingredients online'
    ]
  },
  'japanese': {
    title: 'Japanese Ingredients Bangalore | Sushi & Asian Food Suppliers',
    description: 'Premium Japanese ingredients, sauces, noodles & specialty products for restaurants in Bangalore. Sushi ingredients, ramen supplies, authentic imports. Bulk orders available. Fast delivery.',
    keywords: [
      'Japanese ingredients Bangalore',
      'sushi supplies Bangalore',
      'Japanese sauces suppliers',
      'restaurant Japanese supplies',
      'wholesale Japanese ingredients Karnataka',
      'ramen noodles Bangalore',
      'authentic Japanese products HSR Layout',
      'buy Japanese ingredients online'
    ]
  },
  'korean': {
    title: 'Korean Ingredients Bangalore | K-Food Suppliers India',
    description: 'Authentic Korean ingredients, gochujang, kimchi & specialty products for restaurants & home chefs in Bangalore. Imported Korean brands. Wholesale & retail. Fast delivery Karnataka.',
    keywords: [
      'Korean ingredients Bangalore',
      'gochujang suppliers India',
      'Korean food products Bangalore',
      'restaurant Korean supplies',
      'wholesale Korean ingredients Karnataka',
      'kimchi Bangalore',
      'authentic Korean products HSR Layout',
      'buy Korean ingredients online'
    ]
  },
  'european': {
    title: 'European Ingredients Bangalore | Imported Food Suppliers',
    description: 'Premium European ingredients, cheeses, sauces & specialty products for restaurants & cafes in Bangalore. French, Spanish, Italian imports. Wholesale pricing available. Fast delivery Karnataka.',
    keywords: [
      'European ingredients Bangalore',
      'imported European products',
      'European cheeses suppliers India',
      'restaurant European supplies',
      'wholesale European ingredients Karnataka',
      'French products Bangalore',
      'Spanish ingredients HSR Layout',
      'buy European ingredients online'
    ]
  }
}

export async function generateMetadata({ params }: { params: Promise<{ cuisine: string }> }): Promise<Metadata> {
  const { cuisine } = await params
  const meta = CUISINE_META[cuisine] || {
    title: `${cuisine.charAt(0).toUpperCase() + cuisine.slice(1)} Cuisine Ingredients | Stalks N Spice`,
    description: `Shop premium ${cuisine} ingredients and products in Bangalore. Wholesale & retail for restaurants, cafes & home chefs. Express delivery Karnataka.`,
    keywords: [`${cuisine} ingredients`, 'Bangalore', 'wholesale', 'restaurant suppliers']
  }

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      type: 'website',
      url: `https://stalknspice.com/cuisine/${cuisine}`,
      title: meta.title,
      description: meta.description,
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
      title: meta.title,
      description: meta.description,
      images: ['/images/sns-logo.png']
    },
    alternates: {
      canonical: `https://stalknspice.com/cuisine/${cuisine}`
    }
  }
}

export default async function CuisinePage({ params }: { params: Promise<{ cuisine: string }> }) {
  const { cuisine } = await params
  return <CuisinePageClient currentCuisineSlug={cuisine} />
}