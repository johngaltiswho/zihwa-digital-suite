'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import OrgCompanySwitcher from './OrgCompanySwitcher'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [scope, setScope] = useState<{ organizationId?: string | null; companyId?: string | null }>({})
  const [scopeError, setScopeError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/scope')
        const json = await res.json()
        if (json.success) {
          setScope(json.data)
          setScopeError(null)
        } else {
          setScopeError(json.error || 'Failed to load scope')
        }
      } catch {
        setScopeError('Failed to load scope')
      }
    }
    run()
  }, [])

  const companyId = scope.companyId

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/upload" className="text-sm font-semibold text-slate-900">
              Zihwa Ledger
            </Link>
            <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <Link href="/onboarding" className="hover:text-slate-900">Onboarding</Link>
              <Link href="/upload" className="hover:text-slate-900">Upload</Link>
              <Link href="/documents" className="hover:text-slate-900">Review</Link>
              <Link href="/settings" className="hover:text-slate-900">Settings</Link>
              {companyId && (
                <>
                  <Link href={`/companies/${companyId}/context`} className="hover:text-slate-900">Context</Link>
                  <Link href={`/companies/${companyId}/integrations/zoho`} className="hover:text-slate-900">Zoho</Link>
                  <Link href={`/companies/${companyId}/copilot`} className="hover:text-slate-900">Copilot</Link>
                  <Link href={`/companies/${companyId}/approvals`} className="hover:text-slate-900">Approvals</Link>
                  <Link href={`/companies/${companyId}/insights`} className="hover:text-slate-900">Insights</Link>
                </>
              )}
            </nav>
          </div>
          <OrgCompanySwitcher />
        </div>
      </header>
      {scopeError && (
        <div className="mx-auto mt-3 max-w-7xl px-4">
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            {scopeError}
          </div>
        </div>
      )}
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  )
}
