import { notFound } from "next/navigation";
import NewsList from "@/components/news/NewsList";
import Pagination from "@/components/news/Pagination";
import NewsCategories from "@/components/news/NewsCategories";
import { resolveNewsCategory } from "@/lib/resolveNewsCategory";
import {
  getNewsByCategory,
  getTotalPagesByCategory,
} from "@/lib/newsData";

function normalizeCategory(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function CategoryNewsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;

  const category = resolveNewsCategory(categorySlug);

  //  Guard invalid categories
  if (!category) {
    notFound();
  }

  const items = getNewsByCategory(category, 1);
  const totalPages = getTotalPagesByCategory(category);

  if (!items.length) notFound();

  return (
    <main className="max-w-7xl mx-auto px-6 pt-1 pb-20">
      {/* CATEGORY TITLE */}
      <h1 className="text-4xl font-bold text-black capitalize mb-6">
        {category === "All"
          ? "All News"
          : normalizeCategory(categorySlug)}
      </h1>

      {/* CATEGORY FILTER */}
      <NewsCategories />

      {/* NEWS GRID */}
      <NewsList items={items} />

      {totalPages > 1 && (
        <div className="mt-16 flex justify-center">
          <Pagination
            currentPage={1}
            totalPages={totalPages}
            basePath={`/news/category/${categorySlug}`}
          />
        </div>
      )}
    </main>
  );
}
