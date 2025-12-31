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

type Props = {
  params: {
    category: string;
    pageNumber: string;
  };
};

export default function CategoryNewsPageNumber({ params }: Props) {
  const currentPage = Number(params.pageNumber);
  const category = normalizeCategory(params.category);
  const totalPages = getTotalPagesByCategory(category);

  if (
    Number.isNaN(currentPage) ||
    currentPage < 1 ||
    currentPage > totalPages
  ) {
    notFound();
  }

  const items = getNewsByCategory(category, currentPage);
  if (!items.length) notFound();

  return (
    <main className="max-w-7xl mx-auto px-6 pt-10 pb-20">
     
      <h1 className="text-4xl text-black font-serif font-bold mb-6 capitalize">
        {category}
      </h1>
       {/* CATEGORY TABS */}
      <NewsCategories />


      <NewsList items={items} />

      {totalPages > 1 && (
        <div className="mt-16 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/news/category/${params.category}`}
          />
        </div>
      )}
    </main>
  );
}
