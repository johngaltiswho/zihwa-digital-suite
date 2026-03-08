import { Metadata } from 'next'
import RecipeGrid from "@/components/RecipeGrid"
import Newsletter from "@/components/NewsLetter"

export const metadata: Metadata = {
  title: 'Quick & Easy Recipes | Gourmet Home Cooking',
  description: 'Discover quick & delicious recipes using premium ingredients from Stalks N Spice. Breakfast, lunch, dinner, desserts & drinks. Step-by-step instructions for home chefs in Bangalore. Easy cooking made simple.',
  keywords: [
    'quick recipes',
    'easy cooking',
    'gourmet recipes',
    'home chef recipes',
    'breakfast recipes',
    'dinner ideas',
    'dessert recipes',
    'Indian recipes',
    'international recipes',
    'step-by-step recipes',
    'Bangalore recipes',
    'cooking at home'
  ],
  openGraph: {
    type: 'website',
    url: 'https://stalknspice.com/recipes',
    title: 'Quick & Easy Recipes | Stalks N Spice',
    description: 'Discover quick & delicious recipes using premium ingredients. Step-by-step instructions for home chefs.',
    siteName: 'Stalks N Spice',
    images: [{
      url: '/images/sns-logo.png',
      width: 1200,
      height: 630,
      alt: 'Stalks N Spice Recipes'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quick & Easy Recipes | Stalks N Spice',
    description: 'Discover quick & delicious recipes using premium ingredients.',
    images: ['/images/sns-logo.png']
  },
  alternates: {
    canonical: 'https://stalknspice.com/recipes'
  }
}

export default function RecipesPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero or Title section  */}
      <div className="pt-3 text-center">
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-widest">Recipes</h1>
      </div>

      {/* The component we just created */}
      <RecipeGrid />
       <Newsletter /> 
    </main>
  );
}