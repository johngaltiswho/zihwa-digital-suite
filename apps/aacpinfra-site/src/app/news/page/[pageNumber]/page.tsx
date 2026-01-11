import { notFound } from "next/navigation";
import NewsList from "@/components/news/NewsList";
import Pagination from "@/components/news/Pagination";
import NewsCategories from "@/components/news/NewsCategories";
import { getNewsByPage, getTotalPages } from "@/lib/newsData";

export default async function NewsPageNumber({
  params,
}: {
    params: Promise<{ pageNumber: string }>;

}) {
  const { pageNumber } =await params;

  const currentPage = Number(pageNumber);
  const totalPages = getTotalPages();


  if (
    Number.isNaN(currentPage) ||
    currentPage < 1 ||
    currentPage > totalPages
  ) {
    notFound();
  }

  const items = getNewsByPage(currentPage);
  if (!items.length) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-6 pt-1 pb-20">
      <h1 className="text-5xl font-serif text-black font-bold mb-4">
        News & Insights
      </h1>

      <p className="text-gray-600 mb-4 max-w-3xl">
        Latest updates, project highlights, and industry insights from AACP Infrastructure.
      </p>

      {/* CATEGORY TABS */}
      <NewsCategories />

      <NewsList items={items} />

      {totalPages > 1 && (
        <div className="mt-16 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </main>
  );
}
