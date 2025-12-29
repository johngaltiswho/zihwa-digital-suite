export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-7xl mx-auto px-3 pt-4 pb-10 bg-white">
      {children}
    </main>
  );
}
