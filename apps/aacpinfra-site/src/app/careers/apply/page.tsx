export default function ApplyJobPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header Section
      <section className="bg-black text-white py-12 text-center">
        <h1 className="text-4xl font-light tracking-wide">
          Apply for This Position
        </h1>
        <p className="mt-4 text-gray-300">
          Please fill out the form below to apply
        </p>
      </section> */}

      {/* Google Form */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSe2rGd_xvuvp_kHC6DY00BpHgCOrozCh2Xm_j7N8HTZpuWz4Q/viewform?embedded=true"
          width="100%"
          height="2000"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          className="w-full border-0 rounded-lg"
        >
          Loading…
        </iframe>
      </section>
    </main>
  );
}
