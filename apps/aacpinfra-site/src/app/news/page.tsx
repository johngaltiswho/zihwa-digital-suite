import NewsList from "@/components/news/NewsList";
import Pagination from "@/components/news/Pagination";
import NewsCategories from "@/components/news/NewsCategories";
import { getNewsByPage, getTotalPages } from "@/lib/newsData";

export default function NewsPage() {
  const currentPage = 1;
  const items = getNewsByPage(currentPage);
  const totalPages = getTotalPages();

  return (
    <main className="max-w-7xl mx-auto px-6 pt-10 pb-20">
      <header className="mb-8">
        <h1 className="text-5xl text-black font-serif font-bold mb-4">
          News & Insights
        </h1>

        <p className="max-w-3xl text-gray-600 mb-8">
          Latest updates, project highlights, and industry insights from AACP Infrastructure.
        </p>

        <NewsCategories />
      </header>

      <NewsList items={items} />

      <div className="mt-20 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </main>
  );
}
