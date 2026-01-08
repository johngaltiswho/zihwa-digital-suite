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

export default async function CategoryNewsPageNumber({
  params,
}: {
  params: Promise<{
    category: string;
    pageNumber: string;
  }>;
}) {
  const { category: rawCategory, pageNumber } =await params;

  const currentPage = Number(pageNumber);
  const category = resolveNewsCategory(rawCategory);

  if (!category) {
    notFound();
  }

  const totalPages = getTotalPagesByCategory(category);

  
  if (
    Number.isNaN(currentPage) ||
    currentPage < 1 ||
    currentPage > totalPages
  ) {
    notFound();
  }

  const items = getNewsByCategory(category, currentPage);

  if (!items.length) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-6 pt-1 pb-20">
      <h1 className="text-4xl text-black font-serif font-bold mb-6 capitalize">
        {category === "All"
          ? "All News"
          : normalizeCategory(rawCategory)}
      </h1>

      {/* CATEGORY TABS */}
      <NewsCategories />

      <NewsList items={items} />

      {totalPages > 1 && (
        <div className="mt-16 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/news/category/${rawCategory}`}
          />
        </div>
      )}
    </main>
  );
}
