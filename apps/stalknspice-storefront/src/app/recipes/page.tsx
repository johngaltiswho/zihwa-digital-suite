import RecipeGrid from "@/components/RecipeGrid";
import Newsletter from "@/components/NewsLetter";

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