'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Connection = {
  id: string
  status: 'PENDING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR'
  externalOrgId?: string | null
  updatedAt: string
  error?: string | null
}

export default function ZohoIntegrationPage() {
  const params = useParams()
  const companyId = (Array.isArray(params.companyId) ? params.companyId[0] : params.companyId) ?? ''
  const [connection, setConnection] = useState<Connection | null>(null)
  const [orgId, setOrgId] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const normalizedOrgId = orgId.trim()

  const load = async () => {
    const res = await fetch(`/api/companies/${companyId}/integrations/zoho`)
    const json = await res.json()
    if (json.success) {
      setConnection(json.data)
      setOrgId(json.data?.externalOrgId ?? '')
    }
  }

  useEffect(() => {
    if (companyId) load()
  }, [companyId])

  const connect = async () => {
    setLoading(true)
    setMessage('')
    const res = await fetch(`/api/companies/${companyId}/integrations/zoho`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'connect', externalOrgId: orgId }),
    })
    const json = await res.json()
    setLoading(false)

    if (!json.success) {
      setMessage(json.error || 'Failed to connect')
      return
    }
    setMessage('Zoho connected for this company.')
    await load()
  }

  const disconnect = async () => {
    setLoading(true)
    setMessage('')
    const res = await fetch(`/api/companies/${companyId}/integrations/zoho`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'disconnect' }),
    })
    const json = await res.json()
    setLoading(false)

    if (!json.success) {
      setMessage(json.error || 'Failed to disconnect')
      return
    }
    setMessage('Zoho disconnected.')
    await load()
  }

  const authorize = () => {
    if (!normalizedOrgId) {
      setMessage('Enter Zoho organization ID first, then run OAuth authorize.')
      return
    }
    const returnTo = window.location.pathname
    const query = new URLSearchParams({
      orgId: normalizedOrgId,
      returnTo,
    })
    window.location.href = `/api/zoho/authorize?${query.toString()}`
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Zoho Books integration</h1>
        <p className="text-sm text-slate-600">Manage company-level connection and posting target org.</p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="grid gap-1 text-sm text-slate-700">
          <p>Status: <span className="font-semibold">{connection?.status ?? 'NOT_CONNECTED'}</span></p>
          <p>External org: <span className="font-semibold">{connection?.externalOrgId ?? '—'}</span></p>
          {connection?.updatedAt && <p>Updated: {new Date(connection.updatedAt).toLocaleString()}</p>}
        </div>

        <label className="block text-sm">
          <span className="text-slate-700">Zoho organization ID</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            placeholder="123456789"
          />
        </label>

        <div className="flex gap-3">
          <button onClick={connect} disabled={loading || !normalizedOrgId} className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {loading ? 'Saving…' : 'Connect'}
          </button>
          <button onClick={disconnect} disabled={loading} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">
            Disconnect
          </button>
          <button
            onClick={authorize}
            disabled={loading}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            OAuth authorize
          </button>
        </div>

        {message && <p className="text-sm text-slate-700">{message}</p>}
      </section>
    </div>
  )
}
