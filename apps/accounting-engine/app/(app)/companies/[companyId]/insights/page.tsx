'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Insights = {
  autoAcceptedRate: number
  needsReviewRate: number
  manualRate: number
  topVendors: Array<{ vendor: string; count: number }>
  topCorrections: Array<{ eventType: string; count: number }>
}

export default function InsightsPage() {
  const params = useParams()
  const companyId = (Array.isArray(params.companyId) ? params.companyId[0] : params.companyId) ?? ''
  const [insights, setInsights] = useState<Insights | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/companies/${companyId}/insights`)
      const json = await res.json()
      if (!json.success) {
        setError(json.error || 'Failed to load insights')
        return
      }
      setInsights(json.data)
    }
    if (companyId) load()
  }, [companyId])

  if (error) {
    return <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
  }

  if (!insights) {
    return <div className="text-sm text-slate-500">Loading insights…</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Learning insights</h1>
        <p className="text-sm text-slate-600">Track correction patterns and auto-accept quality.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Auto-accepted</p>
          <p className="text-2xl font-semibold text-emerald-700">{insights.autoAcceptedRate.toFixed(1)}%</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Needs review</p>
          <p className="text-2xl font-semibold text-amber-700">{insights.needsReviewRate.toFixed(1)}%</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Manual edits</p>
          <p className="text-2xl font-semibold text-slate-900">{insights.manualRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="font-semibold text-slate-900">Top vendors</h2>
          <div className="mt-2 space-y-2 text-sm">
            {insights.topVendors.length === 0 && <p className="text-slate-500">No vendor data yet.</p>}
            {insights.topVendors.map((item) => (
              <div key={item.vendor} className="flex items-center justify-between">
                <span>{item.vendor}</span>
                <span className="text-slate-500">{item.count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="font-semibold text-slate-900">Correction types</h2>
          <div className="mt-2 space-y-2 text-sm">
            {insights.topCorrections.length === 0 && <p className="text-slate-500">No correction data yet.</p>}
            {insights.topCorrections.map((item) => (
              <div key={item.eventType} className="flex items-center justify-between">
                <span>{item.eventType}</span>
                <span className="text-slate-500">{item.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
