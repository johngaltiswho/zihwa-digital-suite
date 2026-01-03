import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { jobs } from "@/data/jobs";
// import JobComments from "@/components/JobComments";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const job = jobs.find((j) => j.slug === slug);

  if (!job) notFound();

  return (
    <main className="bg-white text-gray-900 scroll-smooth">
      {/* ================= HERO ================= */}
      <header className="relative h-[60vh] flex items-center">
        <Image
          src={job.image}
          alt={job.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative max-w-6xl mx-auto px-6 text-white">
          <span className="block text-sm tracking-widest mb-4">
            CAREERS
          </span>

          <h1 className="text-5xl md:text-6xl font-light tracking-wide">
            {job.title}
          </h1>

          <div className="mt-8">
            <Link
              href="/careers/apply"
              className="inline-block border border-white px-8 py-3 text-sm tracking-widest
                        hover:bg-white hover:text-black transition"
            >
              APPLY FOR THIS POSITION
            </Link>
          </div>
        </div>
      </header>

      <article>
        {/* ================= INTRO ================= */}
        <section className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-lg leading-relaxed text-gray-700">
            {job.intro}
          </p>
        </section>

        {/* ================= RESPONSIBILITIES ================= */}
        <section className="max-w-4xl mx-auto px-6 py-2">
          <h2 className="text-3xl font-semibold mb-4">
            Job Responsibilities
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            {job.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* ================= QUALIFICATIONS ================= */}
        <section className="max-w-4xl mx-auto px-6 py-6">
          <h2 className="text-3xl font-semibold mb-4">
            Job Qualifications
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            {job.qualifications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* ================= WHY JOIN ================= */}
        <section className="max-w-4xl mx-auto px-6 py-6">
          <h2 className="text-3xl font-semibold mb-4">
            Why Join AACP Infrastructure?
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            {job.whyJoin.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* ================= READY TO APPLY ================= */}
        <section className="max-w-4xl mx-auto px-6 py-12 text-center ">
          <h2 className="text-3xl font-semibold mb-4">
            Ready to Apply?
          </h2>

          <p className="text-gray-700 mb-10">
            Click the button below to apply for this position.
            You will be redirected to our application form.
          </p>

          <Link
            href="/careers/apply"
            className="inline-block border border-black px-10 py-3 text-sm tracking-widest
                      hover:bg-black hover:text-white transition"
          >
            APPLY NOW
          </Link>

          <div className="mt-10">
            <Link
              href="/careers"
              className="text-lg font-bold tracking-widest underline hover:text-gray-600"
            >
              ← BACK TO CAREERS
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
