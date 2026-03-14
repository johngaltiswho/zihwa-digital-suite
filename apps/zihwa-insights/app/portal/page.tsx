import { redirect } from 'next/navigation'
import { getServerAuth } from '@/lib/auth'
import Link from 'next/link'

const LEDGER_URL = process.env.NEXT_PUBLIC_LEDGER_URL!

export default async function PortalPage() {
  const { dbUser } = await getServerAuth()

  if (!dbUser) redirect('/sign-in')

  const role = dbUser.role

  const canAccessHR =
    role === 'ADMIN' ||
    role === 'HR' ||
    role === 'CONSULTANT' ||
    role === 'ACCOUNTANT'

  const canAccessLedger = role === 'ADMIN' || role === 'ACCOUNTANT'

  if (!canAccessHR && !canAccessLedger) redirect('/dashboard')

  const displayName = dbUser.name ?? dbUser.email ?? 'there'
  // ✅ Use actual first name, not initials
  const firstName = displayName.includes('@')
    ? displayName.split('@')[0]
    : displayName.split(' ')[0]

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #d0f3ec 0%, #e0f9f5 40%, #ffffff 100%)' }}>

      {/* ── Navbar ── */}
      <header className="flex items-center justify-between px-6 py-2.5 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            ZI
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-gray-900">Zihwa</span>
            <span className="text-sm font-bold text-gray-900">Insights</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end leading-tight">
            <span className="text-sm font-semibold text-gray-900">{initials}</span>
            <span className="text-xs text-gray-500">{dbUser.email}</span>
          </div>
          <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Sign out
          </Link>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 px-8 pt-6 pb-8 max-w-5xl w-full mx-auto">

        {/* ── Greeting ── */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 mb-1">
            Your Workspace
          </p>
          <h1 className="text-4xl font-black text-gray-900 leading-tight tracking-tight">
            Welcome back, {firstName} 
          </h1>
          <p className="text-medium text-gray-500 mt-1">
            Select an app below to get started.
          </p>
        </div>

        {/* ── App Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">

          {canAccessHR && (
            <Link href="/dashboard">
              <div className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-md hover:border-teal-200 transition-all duration-200 h-full">
                <p className="text-[10px] font-semibold text-teal-600 tracking-widest uppercase mb-1">
                  Subdomain App
                </p>
                <h2 className="text-lg font-bold text-gray-900 mb-3">HR Operations</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-7">
                  Candidate tracking, employee records, document collection,
                  and deadline visibility for fast hiring and cleaner HR operations.
                </p>
                <span className="inline-block px-4 py-2 bg-teal-700 group-hover:bg-teal-800 text-white text-sm font-semibold rounded-lg transition-colors duration-200">
                  Open HR App →
                </span>
              </div>
            </Link>
          )}

          {canAccessLedger && (
            <a href={LEDGER_URL}>
              <div className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-md hover:border-teal-200 transition-all duration-200 h-full">
                <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-widest mb-1">
                  Subdomain App
                </p>
                <h2 className="text-lg font-bold text-gray-900 mb-3">AI Accounting Engine</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-7">
                  AI-assisted accounting workflows to process documents,
                  improve data quality, and generate actionable financial insights.
                </p>
                <span className="inline-block px-4 py-2 bg-teal-700 group-hover:bg-teal-800 text-white text-sm font-semibold rounded-lg transition-colors duration-200">
                  Open Accounting App →
                </span>
              </div>
            </a>
          )}

        </div>

       {/* ── Bottom info strip ── */}
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-base">🔐</div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Secure workspace</p>
              <p className="text-xs text-gray-500">Your session is protected. All actions are logged with a full audit trail.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-base">🏢</div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Need more access?</p>
              <p className="text-xs text-gray-500">Contact your admin to request additional app permissions.</p>
            </div>
          </div>
        </div>
        {/* Divider + What We Do section — matches landing page */}
        <div className="pt-4 mt-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">What We Do</h2>
          <p className="text-sm text-gray-600">
            Zihwa Insights delivers practical software for business teams. Instead of one bloated platform, we build purpose-fit applications connected by shared standards and secure access.
          </p>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="px-8 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Signed in as <span className="font-medium text-gray-600">{dbUser.email}</span>
            {' · '}Role: <span className="font-medium text-gray-600">{role}</span>
          </p>
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Zihwa Insights. All rights reserved.
          </p>
          <div className="w-[200px]" />
        </div>
      </footer>

    </div>
  )
}