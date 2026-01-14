"use client";
import Image from "next/image";
import Link from "next/link"; 
import { recipes } from "../app/recipes/data/recipesData"; 

export default function RecipeGrid() {
  return (
    <section className="py-6 max-w-7xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-black mb-8 text-center text-gray-900 uppercase underline tracking-[0.2em]">
        Featured Recipes
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {recipes.map((recipe) => (
      
          <Link href={`/recipes/${recipe.id}`} key={recipe.id} >
            <div className="bg-white rounded-[45px] shadow-sm hover:shadow-2xl transition-all duration-500 p-6 flex flex-col cursor-pointer border border-gray-100 h-full transform hover:-translate-y-2">
              
              {/* Image Container */}
              <div className="relative w-full aspect-[4/3] rounded-[35px] overflow-hidden mb-5">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-[10px] font-black text-red-800 uppercase tracking-widest shadow-sm">
                  {recipe.category || "Recipe"}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl md:text-3xl font-black text-gray-800 mb-4 px-2 leading-[1.1] group-hover:text-red-800 transition-colors">
                {recipe.title}
              </h3>

              {/* Card Footer */}
              <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center px-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🕒</span>
                  <span>{recipe.time}</span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] block text-gray-300 mb-0.5">Cooked By</span>
                  <span className="text-gray-600 font-black">{recipe.author}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View More Button */}
      <div className="text-center mt-16">
        <button className="border-2 border-red-800 text-red-800 px-12 py-4 rounded-full font-black uppercase tracking-[0.3em] text-sm hover:bg-red-800 hover:text-white transition-all duration-300 shadow-xl hover:shadow-red-100 active:scale-95">
          View More Recipes
        </button>
      </div>
    </section>
  );
}