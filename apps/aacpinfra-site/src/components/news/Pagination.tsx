import Link from "next/link";

interface Props {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath = "/news",
}: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const pageHref = (page: number) =>
    page === 1 ? basePath : `${basePath}/page/${page}`;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-6 text-xl font-medium text-gray-500"
    >
      {/* PREVIOUS */}
      <Link
        href={pageHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`text-3xl font-semibold leading-none ${
          currentPage === 1
            ? "opacity-20 pointer-events-none"
            : "hover:text-black"
        }`}
      >
        «
      </Link>

      {/* PAGE NUMBERS */}
      {pages.map((page) => (
        <Link
          key={page}
          href={pageHref(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`px-2 ${
            page === currentPage
              ? "text-black border-b border-black"
              : "hover:text-black"
          }`}
        >
          {page}
        </Link>
      ))}

      {/* NEXT */}
      <Link
        href={pageHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`text-3xl font-semibold leading-none ${
          currentPage === totalPages
            ? "opacity-20 pointer-events-none"
            : "hover:text-black"
        }`}
      >
        »
      </Link>
    </nav>
  );
}
