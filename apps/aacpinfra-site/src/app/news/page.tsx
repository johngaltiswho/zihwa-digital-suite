import NewsList from "@/components/news/NewsList";
import Pagination from "@/components/news/Pagination";
import NewsLayout from "@/components/news/NewsLayout";
import { getNewsByPage, getTotalPages } from "@/lib/newsData";

export default function NewsPage() {
  const currentPage = 1;
  const items = getNewsByPage(currentPage);
  const totalPages = getTotalPages();

  return (
    <NewsLayout>
      <NewsList items={items} />

      <div className="mt-20 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </NewsLayout>
  );
}
