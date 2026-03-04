'use client'

import { FormEvent, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function CreateCompanyPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = (Array.isArray(params.orgId) ? params.orgId[0] : params.orgId) ?? ''

  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const res = await fetch(`/api/orgs/${orgId}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, industry, baseCurrency: 'INR', timezone: 'Asia/Kolkata' }),
    })
    const json = await res.json()
    setLoading(false)

    if (!json.success) {
      setMessage(json.error || 'Failed to create company')
      return
    }

    await fetch('/api/scope', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId: orgId, companyId: json.data.id }),
    })

    router.push(`/companies/${json.data.id}/context`)
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Create company</h1>
        <p className="text-sm text-slate-600">Add your legal entity and continue to accounting context setup.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block text-sm">
          <span className="text-slate-700">Company name</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="block text-sm">
          <span className="text-slate-700">Industry (optional)</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Distribution, Contracting, Manufacturing"
          />
        </label>

        {message && <p className="text-sm text-rose-600">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? 'Creating…' : 'Create company'}
        </button>
      </form>
    </div>
  )
}
