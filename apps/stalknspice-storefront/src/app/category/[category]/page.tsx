import { Metadata } from 'next'
import CategoryPageClient from './CategoryPageClient'

// Category metadata configuration with B2C/B2B dual messaging and local SEO
const CATEGORY_META: Record<string, {
  title: string
  description: string
  keywords: string[]
}> = {
  'crushes': {
    title: 'Premium Fruit Crushes & Concentrates Online Bangalore',
    description: 'Buy premium fruit crushes, concentrates & pulps in Bangalore. Monin, Torani & artisanal brands for cafes, restaurants & home use. Bulk & retail orders. Express delivery HSR Layout, Karnataka.',
    keywords: [
      'fruit crushes Bangalore',
      'fruit concentrates India',
      'cafe crushes suppliers',
      'bulk fruit pulp Karnataka',
      'Monin crushes Bangalore',
      'restaurant fruit concentrates',
      'wholesale crushes HSR Layout',
      'buy crushes online Bangalore'
    ]
  },
  'syrups': {
    title: 'Coffee Syrups & Flavoring Syrups Bangalore | Wholesale & Retail',
    description: 'Premium coffee syrups, flavoring syrups & sweeteners for cafes, restaurants & bars in Bangalore. Monin, Torani, DaVinci brands. Bulk pricing available. 45-min delivery HSR Layout.',
    keywords: [
      'coffee syrups Bangalore',
      'flavoring syrups India',
      'Monin syrups Bangalore',
      'cafe syrups wholesale',
      'restaurant syrups suppliers Karnataka',
      'bulk coffee syrups',
      'buy syrups online Bangalore',
      'Torani syrups HSR Layout'
    ]
  },
  'sauces': {
    title: 'Specialty Sauces & Condiments Bangalore | Restaurant Suppliers',
    description: 'Import & domestic specialty sauces, condiments & pastes for restaurants, cafes & home chefs in Bangalore. Italian, Asian, European sauces. Wholesale & retail. Fast delivery Karnataka.',
    keywords: [
      'specialty sauces Bangalore',
      'restaurant sauces suppliers',
      'import sauces India',
      'wholesale condiments Karnataka',
      'Asian sauces Bangalore',
      'Italian sauces suppliers',
      'buy sauces online Bangalore',
      'bulk sauces HSR Layout'
    ]
  },
  'pastas-noodles': {
    title: 'Premium Pasta & Noodles Bangalore | Restaurant & Retail',
    description: 'Italian pasta, Asian noodles & specialty grains for restaurants & home chefs in Bangalore. Barilla, De Cecco, artisanal brands. Bulk orders available. Express delivery HSR Layout, Karnataka.',
    keywords: [
      'premium pasta Bangalore',
      'Italian pasta suppliers',
      'Asian noodles Bangalore',
      'restaurant pasta wholesale',
      'bulk pasta Karnataka',
      'specialty noodles India',
      'buy pasta online Bangalore',
      'Barilla pasta HSR Layout'
    ]
  },
  'milk-cream': {
    title: 'Specialty Milk & Cream Products Bangalore | Cafe Suppliers',
    description: 'Plant-based milk, specialty cream & dairy alternatives for cafes, restaurants & bakeries in Bangalore. Almond milk, oat milk, coconut cream. Bulk & retail. Fast delivery Karnataka.',
    keywords: [
      'plant milk Bangalore',
      'almond milk suppliers',
      'specialty cream Bangalore',
      'cafe milk alternatives',
      'bulk dairy products Karnataka',
      'oat milk India',
      'buy milk products online Bangalore',
      'coconut cream HSR Layout'
    ]
  },
  'fruits-vegetables': {
    title: 'Premium Fruits & Vegetables Bangalore | Fresh Produce Suppliers',
    description: 'Fresh & preserved fruits, vegetables & produce for restaurants & home chefs in Bangalore. Seasonal specialties, exotic varieties. Wholesale pricing available. Express delivery Karnataka.',
    keywords: [
      'fresh produce Bangalore',
      'restaurant vegetables suppliers',
      'exotic fruits Bangalore',
      'wholesale vegetables Karnataka',
      'specialty produce India',
      'buy fruits online Bangalore',
      'bulk vegetables HSR Layout',
      'premium produce Bangalore'
    ]
  }
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const meta = CATEGORY_META[category] || {
    title: `${category.replace(/-/g, ' ')} | Stalks N Spice`,
    description: `Shop premium ${category.replace(/-/g, ' ')} in Bangalore. Wholesale & retail for restaurants, cafes & home chefs. Express delivery.`,
    keywords: [category, 'Bangalore', 'wholesale', 'restaurant suppliers', 'Karnataka']
  }

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      type: 'website',
      url: `https://stalknspice.com/category/${category}`,
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
      canonical: `https://stalknspice.com/category/${category}`
    }
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  return <CategoryPageClient currentCategorySlug={category} />
}