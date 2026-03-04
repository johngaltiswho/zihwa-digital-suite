'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Draft = {
  id: string
  status: string
  payload: {
    type?: string
    vendorName?: string
    merchant?: string
    amount?: number
    currency?: string
    date?: string
  }
  createdAt: string
}

export default function ApprovalsPage() {
  const params = useParams()
  const companyId = (Array.isArray(params.companyId) ? params.companyId[0] : params.companyId) ?? ''

  const [drafts, setDrafts] = useState<Draft[]>([])
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = async () => {
    const res = await fetch(`/api/companies/${companyId}/approvals`)
    const json = await res.json()
    if (!json.success) {
      setError(json.error || 'Failed to load approvals')
      return
    }
    setDrafts(json.data)
  }

  useEffect(() => {
    if (companyId) load()
  }, [companyId])

  const approve = async (draftId: string) => {
    setBusyId(draftId)
    const res = await fetch(`/api/companies/${companyId}/drafts/${draftId}/approve`, { method: 'POST' })
    const json = await res.json()
    setBusyId(null)

    if (!json.success) {
      setError(json.error || 'Approve failed')
      return
    }

    await load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Approval queue</h1>
        <p className="text-sm text-slate-600">Drafts waiting for approver confirmation and Zoho posting.</p>
      </div>

      {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

      <div className="space-y-3">
        {drafts.length === 0 && <p className="text-sm text-slate-500">No drafts pending approval.</p>}
        {drafts.map((draft) => (
          <div key={draft.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{draft.payload?.vendorName || draft.payload?.merchant || 'Unnamed party'}</p>
                <p className="text-xs text-slate-500">
                  {draft.payload?.currency || 'INR'} {draft.payload?.amount?.toLocaleString?.() || '—'} · {draft.payload?.date || '—'}
                </p>
              </div>
              <button
                onClick={() => approve(draft.id)}
                disabled={busyId === draft.id}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busyId === draft.id ? 'Posting…' : 'Approve & post'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
