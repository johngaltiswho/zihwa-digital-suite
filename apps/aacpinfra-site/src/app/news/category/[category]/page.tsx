import { notFound } from "next/navigation";
import NewsList from "@/components/news/NewsList";
import Pagination from "@/components/news/Pagination";
import NewsCategories from "@/components/news/NewsCategories";
import {
  getNewsByCategory,
  getTotalPagesByCategory,
} from "@/lib/newsData";

function normalizeCategory(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function CategoryNewsPage({
  params,
}: {
  params: { category: string };
}) {
  const category = normalizeCategory(params.category);
  const items = getNewsByCategory(category, 1);
  const totalPages = getTotalPagesByCategory(category);

  if (!items.length) notFound();

  return (
    <main className="max-w-7xl mx-auto px-6 pt-10 pb-20">
{/* CATEGORY TITLE */}
<h1 className="text-4xl font-bold text-black capitalize mb-6">
  {category}
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
            basePath={`/news/category/${params.category}`}
          />
        </div>
      )}
    </main>
  );
}
