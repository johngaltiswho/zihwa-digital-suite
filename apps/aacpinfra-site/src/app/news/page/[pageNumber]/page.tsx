import { notFound } from "next/navigation";
import NewsList from "@/components/news/NewsList";
import NewsCategories from "@/components/news/NewsCategories";
import Pagination from "@/components/news/Pagination";
import { getNewsByPage, getTotalPages } from "@/lib/newsData";

type Props = {
  params: { pageNumber?: string };
};

export default function NewsPageNumber({ params }: Props) {
  // ⚠️ Guard against HMR / undefined params
  if (!params?.pageNumber) {
    return null; // allow hot reload to settle
  }

  const currentPage = Number(params.pageNumber);
  const totalPages = getTotalPages();

  if (
    Number.isNaN(currentPage) ||
    currentPage < 1 ||
    currentPage > totalPages
  ) {
    notFound();
  }

  const items = getNewsByPage(currentPage);

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 bg-white grid grid-cols-1 lg:grid-cols-3 gap-12">
      <section className="lg:col-span-2">
        <NewsList items={items} />

        <div className="mt-20 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </section>

      <aside>
        <NewsCategories />
      </aside>
    </main>
  );
}
