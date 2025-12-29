import { notFound } from "next/navigation";
import NewsList from "@/components/news/NewsList";
import Pagination from "@/components/news/Pagination";
import { getNewsByPage, getTotalPages } from "@/lib/newsData";

type Props = {
  params: {
    pageNumber: string;
  };
};

export default async function NewsPageNumber({ params }: Props) {
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
    <main className="max-w-7xl mx-auto px-6 pt-8 pb-16">
      <h1 className="text-4xl text-black font-serif mb-4">
        News & Insights
      </h1>

      <p className="text-gray-600 mb-10">
        Latest updates, project highlights, and industry insights.
      </p>

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
