import Link from 'next/link'

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Onboarding</h1>
        <p className="text-slate-600">Set up your organization and first company to start posting entries.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/orgs/new" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300">
          <h2 className="text-lg font-semibold text-slate-900">Create Organization</h2>
          <p className="mt-1 text-sm text-slate-600">Start a new finance workspace.</p>
        </Link>

        <Link href="/settings" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300">
          <h2 className="text-lg font-semibold text-slate-900">Manage Existing Setup</h2>
          <p className="mt-1 text-sm text-slate-600">Assign roles, create companies, and configure policies.</p>
        </Link>
      </div>
    </div>
  )
}
