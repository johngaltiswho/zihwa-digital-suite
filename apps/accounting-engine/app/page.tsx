import Link from 'next/link'

const benefits = [
  {
    title: 'Capture everything once',
    body: 'Drop scanned bills, WhatsApp photos, or PDFs and the AI accountant drafts the entry automatically.',
  },
  {
    title: 'Company-aware decisions',
    body: 'Ledger, GST, and allocation suggestions follow your Accounting Context—not generic templates.',
  },
  {
    title: 'Always human-approved',
    body: 'High-confidence items can auto-post, but you stay in control with a single review queue.',
  },
]

export default function MarketingHome() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-20">
        <section className="space-y-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
            Zihwa Ledger · AI accountant’s assistant
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
            Finish today’s accounting with calm confidence.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Zihwa Ledger drafts purchase bills, receipts, and expenses using your own accounting context,
            then waits for your nod before posting to Zoho Books.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Sign in / Create account
            </Link>
            <Link
              href="/login?view=sign_up"
              className="inline-flex items-center rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-white"
            >
              See it in action
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">{benefit.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{benefit.body}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-sky-700">How it works</p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Upload → AI suggestion → Review → Post to Zoho
              </h2>
              <p className="text-slate-600">
                Your data stays inside Supabase. Every step logs an audit trail so the GST auditor and your
                CFO know what changed and why.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="rounded-lg bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
              >
                Go to the workspace
              </Link>
              <Link
                href="/login"
                className="text-center text-sm font-semibold text-slate-700 hover:underline"
              >
                Already onboarded? Sign in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
