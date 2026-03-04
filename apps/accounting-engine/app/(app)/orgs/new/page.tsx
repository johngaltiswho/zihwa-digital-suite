'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function CreateOrgPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/orgs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })

    const json = await res.json()
    setLoading(false)

    if (!json.success) {
      setMessage(json.error || 'Failed to create organization')
      return
    }

    await fetch('/api/scope', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId: json.data.id, companyId: '' }),
    })

    router.push(`/orgs/${json.data.id}/companies/new`)
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Create organization</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Organization name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400"
            placeholder="Acme Finance Ops"
            required
          />
        </div>

        {message && <p className="text-sm text-rose-600">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create organization'}
        </button>
      </form>
    </div>
  )
}
