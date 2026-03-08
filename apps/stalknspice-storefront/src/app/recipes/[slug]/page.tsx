import { Metadata } from 'next'
import Image from "next/image"
import { notFound } from "next/navigation"
import { recipes } from "../data/recipesData"
import Newsletter from "@/components/NewsLetter"

export async function generateStaticParams() {
  return recipes.map((recipe) => ({
    slug: recipe.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const recipe = recipes.find((r) => r.id === slug)

  if (!recipe) {
    return { title: 'Recipe Not Found | Stalks N Spice' }
  }

  const description = `${recipe.description} Ready in ${recipe.time}. Perfect for ${recipe.category.toLowerCase()}. Step-by-step recipe with ingredients: ${recipe.ingredients.slice(0, 3).join(', ')}${recipe.ingredients.length > 3 ? ' and more' : ''}.`

  return {
    title: `${recipe.title} Recipe | ${recipe.time}`,
    description,
    keywords: [
      recipe.title,
      `${recipe.title} recipe`,
      recipe.category,
      `${recipe.category} recipes`,
      `quick ${recipe.category.toLowerCase()} recipes`,
      ...recipe.ingredients.slice(0, 3),
      'easy recipes',
      'home cooking',
      'Bangalore recipes',
      'Stalks N Spice recipes'
    ],
    authors: [{ name: recipe.author }],
    openGraph: {
      type: 'article',
      url: `https://stalknspice.com/recipes/${slug}`,
      title: `${recipe.title} Recipe | ${recipe.time}`,
      description,
      images: [{
        url: recipe.image,
        width: 1200,
        height: 630,
        alt: recipe.title
      }],
      siteName: 'Stalks N Spice',
      publishedTime: new Date().toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${recipe.title} Recipe`,
      description,
      images: [recipe.image],
    },
    alternates: {
      canonical: `https://stalknspice.com/recipes/${slug}`
    }
  }
}

// Recipe Schema structured data for rich results
function RecipeStructuredData({ recipe }: { recipe: typeof recipes[0] }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    image: recipe.image,
    description: recipe.description,
    author: {
      '@type': 'Person',
      name: recipe.author
    },
    prepTime: `PT${recipe.time.replace(' min', 'M')}`,
    totalTime: `PT${recipe.time.replace(' min', 'M')}`,
    recipeCategory: recipe.category,
    recipeCuisine: recipe.category.includes('Thai') ? 'Thai' : recipe.category.includes('Italian') ? 'Italian' : 'International',
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: step
    })),
    keywords: `${recipe.title}, ${recipe.category}, quick recipes, easy cooking, home chef recipes`,
    recipeYield: '2-4 servings',
    nutrition: {
      '@type': 'NutritionInformation'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Stalks N Spice',
      url: 'https://stalknspice.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://stalknspice.com/images/sns-logo.png'
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const recipe = recipes.find((r) => r.id === slug)

  if (!recipe) return notFound()

  return (
    <>
      <RecipeStructuredData recipe={recipe} />
      <div className="bg-white min-h-screen">
      {/* --- Recipe Header Section --- */}
      <div className="max-w-7xl mx-auto pt-6 px-6 text-center">
        <span className="text-red-700 font-bold uppercase tracking-widest text-sm mb-2 block">
          {recipe.category}
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 max-w-4xl mx-auto leading-[1.1]">
          {recipe.title}
        </h1>
        
        <div className="flex flex-wrap justify-center items-center gap-4 py-6 border-t border-b border-gray-100 mb-12">
          <div className="text-center">
            <p className="text-gray-400 text-[10px] uppercase font-bold mb-1 tracking-widest">Author</p>
            <p className="text-gray-900 font-bold">{recipe.author}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-[10px] uppercase font-bold mb-1 tracking-widest">Prep Time</p>
            <p className="text-gray-900 font-bold">{recipe.time}</p>
          </div>
        </div>
      </div>

      {/* --- Main Recipe Image --- */}
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <div className="relative w-full aspect-[16/9] rounded-[20px] md:rounded-[20px] overflow-hidden shadow-xl border border-gray-50">
          <Image src={recipe.image} alt={recipe.title} fill className="object-cover" priority />
        </div>
      </div>

      {/* --- Ingredients and Instructions --- */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-22 border-b border-gray-100">
        
        {/* Left: Ingredients */}
        <div className="lg:col-span-4">
          <h2 className="text-3xl font-black mb-8 text-gray-900 uppercase italic">Ingredients</h2>
          <ul className="space-y-6">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center gap-4 text-lg text-black border-b border-gray-50 pb-4">
                <span className="w-2 h-2 rounded-full bg-red-700 flex-shrink-0"></span>
                {ing}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Method */}
        <div className="lg:col-span-8">
          <h2 className="text-3xl font-black mb-8 text-gray-900 uppercase italic">Method</h2>
          <div className="space-y-12">
            {recipe.instructions.map((step, i) => (
              <div key={i} className="group flex gap-8">
                <span className="text-3xl font-black text-gray-700 group-hover:text-red-100 transition-colors duration-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-xl text-gray-700 leading-relaxed pt-2">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- 2. Newsletter Block --- */}
      <div className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto">
           <Newsletter />
        </div>
      </div>

      </div>
    </>
  )
}