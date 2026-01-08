import NewsList from "@/components/news/NewsList";
import Pagination from "@/components/news/Pagination";
import NewsCategories from "@/components/news/NewsCategories";
import { getNewsByPage, getTotalPages } from "@/lib/newsData";

export default function NewsPage() {
  const currentPage = 1;
  const items = getNewsByPage(currentPage);
  const totalPages = getTotalPages();

  return (
    <main className="max-w-7xl mx-auto px-4 pt-0 pb-10">
      <h1 className="text-5xl text-black font-serif font-semibold mb-3">
        News & Insights
      </h1>

      <p className="text-gray-600 mb-3 max-w-3xl">
        Latest updates, project highlights, and industry insights from AACP Infrastructure.
      </p>

      {/* CATEGORY TABS */}
      <NewsCategories />

      <NewsList items={items} />

      {totalPages > 1 && (
        <div className="mt-16 flex justify-center">
          <Pagination currentPage={1} totalPages={totalPages} />
        </div>
      )}
    </main>
  );
}
