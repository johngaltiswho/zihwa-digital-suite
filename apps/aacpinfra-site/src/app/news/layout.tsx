export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white min-h-screen">
      {children}
    </section>
  );
}
