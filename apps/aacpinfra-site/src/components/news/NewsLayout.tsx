import NewsCategories from "@/components/news/NewsCategories";

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT CONTENT */}
        <section className="lg:col-span-8">
          {children}
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="lg:col-span-4">
          <NewsCategories />
        </aside>
      </div>
    </main>
  );
}
