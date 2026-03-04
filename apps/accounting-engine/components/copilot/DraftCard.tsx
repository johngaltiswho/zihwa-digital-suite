'use client'

type DraftCardProps = {
  draft: {
    id: string
    status?: string
    payload?: {
      type?: string
      vendorName?: string
      merchant?: string
      amount?: number
      currency?: string
      date?: string
      billNumber?: string
    }
  }
}

export default function DraftCard({ draft }: DraftCardProps) {
  const payload = draft.payload ?? {}
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">Draft {draft.id.slice(0, 8)}</p>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
          {draft.status ?? 'DRAFT'}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <p>Type: {payload.type ?? 'expense'}</p>
        <p>Party: {payload.vendorName ?? payload.merchant ?? '—'}</p>
        <p>
          Amount: {payload.currency ?? 'INR'} {payload.amount?.toLocaleString?.() ?? '—'}
        </p>
        <p>Date: {payload.date ?? '—'}</p>
        <p className="col-span-2">Bill: {payload.billNumber ?? '—'}</p>
      </div>
    </div>
  )
}
