import Image from "next/image";
import { notFound } from "next/navigation";
import { recipes } from "../data/recipesData";
import Newsletter from "@/components/NewsLetter"; // 1. Import the Newsletter

export async function generateStaticParams() {
  return recipes.map((recipe) => ({
    slug: recipe.id, 
  }));
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = recipes.find((r) => r.id === slug);

  if (!recipe) return notFound();

  return (
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
  );
}