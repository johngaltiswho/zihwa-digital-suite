import NewsList from "@/components/news/NewsList";
import Pagination from "@/components/news/Pagination";
import NewsLayout from "@/components/news/NewsLayout";
import {
  getNewsByCategory,
  getTotalPagesByCategory,
} from "@/lib/newsData";

export default function CategoryNewsPage({
  params,
}: {
  params: { category: string };
}) {
  const category = decodeURIComponent(params.category);
  const currentPage = 1;

  const items = getNewsByCategory(category, currentPage);
  const totalPages = getTotalPagesByCategory(category);

  return (
    <NewsLayout>
      <h1 className="text-2xl font-semibold text-black mb-8">
        {category}
      </h1>

      <NewsList items={items} />

      <div className="mt-20 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/news/category/${params.category}`}
        />
      </div>
    </NewsLayout>
  );
}
