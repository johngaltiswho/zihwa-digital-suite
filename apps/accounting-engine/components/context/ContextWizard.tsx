'use client'

import { useEffect, useMemo, useState } from 'react'

type ContextVersion = {
  id: string
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  context: Record<string, unknown>
  createdAt: string
}

type WizardContext = {
  baseCurrency?: string
  timezone?: string
  posting?: {
    allowAutoPost?: boolean
    autoPostConfidence?: number
    manualReviewConfidence?: number
    roundingPolicy?: string
    attachmentPolicy?: string
    autoVendorCreate?: boolean
  }
  allocation?: {
    useProjects?: boolean
    rules?: unknown[]
  }
  gst?: {
    registered?: boolean
    requireGstin?: boolean
    defaultTreatment?: string
    exemptVendorIds?: string[]
    manualRateVendors?: string[]
  }
  risk?: {
    tolerancePercent?: number
    duplicateDetectionPolicy?: string
    blockedVendors?: string[]
    holdKeywords?: string[]
  }
  vendorRules?: unknown[]
  ledgerRules?: unknown[]
  [key: string]: unknown
}

type ApiResponse = {
  success: boolean
  data?: {
    active: ContextVersion | null
    versions: ContextVersion[]
  }
  error?: string
}

const defaultContext = {
  version: 1,
  baseCurrency: 'INR',
  timezone: 'Asia/Kolkata',
  posting: {
    allowAutoPost: false,
    autoPostConfidence: 90,
    manualReviewConfidence: 70,
    roundingPolicy: 'NONE',
    attachmentPolicy: 'OPTIONAL',
    autoVendorCreate: false,
  },
  vendorRules: [],
  ledgerRules: [],
  allocation: {
    useProjects: false,
    rules: [],
  },
  gst: {
    registered: true,
    requireGstin: true,
    defaultTreatment: 'INTRA',
    exemptVendorIds: [],
    manualRateVendors: [],
  },
  risk: {
    tolerancePercent: 1,
    duplicateDetectionPolicy: 'STRICT',
    blockedVendors: [],
    holdKeywords: [],
  },
}

export default function ContextWizard({ companyId }: { companyId: string }) {
  const [context, setContext] = useState<WizardContext>(defaultContext)
  const [versions, setVersions] = useState<ContextVersion[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [vendorRulesInput, setVendorRulesInput] = useState('')
  const [ledgerRulesInput, setLedgerRulesInput] = useState('')

  const fetchContext = async () => {
    setLoading(true)
    const res = await fetch(`/api/companies/${companyId}/context`)
    const json = (await res.json()) as ApiResponse
    setLoading(false)

    if (!json.success || !json.data) {
      setMessage(json.error || 'Failed to load context')
      return
    }

    setVersions(json.data.versions)
    setActiveId(json.data.active?.id ?? null)

    const seed = json.data.active?.context ?? json.data.versions[0]?.context ?? defaultContext
    setContext(seed)
    setVendorRulesInput(JSON.stringify(seed.vendorRules ?? [], null, 2))
    setLedgerRulesInput(JSON.stringify(seed.ledgerRules ?? [], null, 2))
  }

  useEffect(() => {
    fetchContext()
  }, [companyId])

  const completeness = useMemo(() => {
    const baseCurrencyReady = typeof context?.baseCurrency === 'string' && context.baseCurrency.length === 3
    const timezoneReady = typeof context?.timezone === 'string' && context.timezone.length > 1
    return {
      complete: baseCurrencyReady && timezoneReady,
      missing: [
        !baseCurrencyReady ? 'Base currency' : null,
        !timezoneReady ? 'Timezone' : null,
      ].filter(Boolean),
    }
  }, [context])

  const save = async (activate = false) => {
    setSaving(true)
    setMessage('')

    try {
      const parsedVendorRules = JSON.parse(vendorRulesInput || '[]')
      const parsedLedgerRules = JSON.parse(ledgerRulesInput || '[]')

      const payload = {
        ...context,
        vendorRules: parsedVendorRules,
        ledgerRules: parsedLedgerRules,
      }

      const res = await fetch(`/api/companies/${companyId}/context`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: payload, activate }),
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to save context')
      }

      setMessage(
        json.data?.completeness?.complete
          ? activate
            ? 'Context saved and activated.'
            : 'Context draft saved.'
          : `Saved with gaps: ${(json.data?.completeness?.errors ?? []).join(', ')}`
      )

      await fetchContext()
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Failed to save context')
    } finally {
      setSaving(false)
    }
  }

  const activateVersion = async (contextId: string) => {
    const res = await fetch(`/api/companies/${companyId}/context/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contextId }),
    })
    const json = await res.json()
    if (!res.ok || !json.success) {
      setMessage(json.error || 'Failed to activate context version')
      return
    }
    setMessage('Context version activated.')
    await fetchContext()
  }

  if (loading) {
    return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading context…</div>
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Context completeness</h2>
            <p className="text-sm text-slate-600">Posting is blocked until required fields are set.</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              completeness.complete ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}
          >
            {completeness.complete ? 'Complete' : 'Incomplete'}
          </span>
        </div>
        {!completeness.complete && (
          <p className="mt-2 text-sm text-amber-700">Missing: {completeness.missing.join(', ')}</p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="font-semibold text-slate-900">Posting preferences</h3>
          <label className="block text-sm">
            <span className="text-slate-700">Base currency</span>
            <input
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              value={context.baseCurrency ?? ''}
              onChange={(e) => setContext((prev) => ({ ...prev, baseCurrency: e.target.value.toUpperCase() }))}
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-700">Timezone</span>
            <input
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              value={context.timezone ?? ''}
              onChange={(e) => setContext((prev) => ({ ...prev, timezone: e.target.value }))}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="text-slate-700">Rounding</span>
              <select
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
                value={context.posting?.roundingPolicy ?? 'NONE'}
                onChange={(e) =>
                  setContext((prev) => ({
                    ...prev,
                    posting: { ...(prev.posting ?? {}), roundingPolicy: e.target.value },
                  }))
                }
              >
                <option value="NONE">None</option>
                <option value="NEAREST_RUPEE">Nearest rupee</option>
                <option value="NEAREST_TEN">Nearest ten</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-slate-700">Attachment policy</span>
              <select
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
                value={context.posting?.attachmentPolicy ?? 'OPTIONAL'}
                onChange={(e) =>
                  setContext((prev) => ({
                    ...prev,
                    posting: { ...(prev.posting ?? {}), attachmentPolicy: e.target.value },
                  }))
                }
              >
                <option value="OPTIONAL">Optional</option>
                <option value="REQUIRED">Required</option>
              </select>
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={Boolean(context.posting?.autoVendorCreate)}
              onChange={(e) =>
                setContext((prev) => ({
                  ...prev,
                  posting: { ...(prev.posting ?? {}), autoVendorCreate: e.target.checked },
                }))
              }
            />
            Auto-create vendors when no match found
          </label>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h3 className="font-semibold text-slate-900">GST & risk</h3>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={Boolean(context.gst?.requireGstin)}
              onChange={(e) => setContext((prev) => ({ ...prev, gst: { ...(prev.gst ?? {}), requireGstin: e.target.checked } }))}
            />
            GSTIN required
          </label>
          <label className="block text-sm">
            <span className="text-slate-700">Duplicate policy</span>
            <select
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              value={context.risk?.duplicateDetectionPolicy ?? 'STRICT'}
              onChange={(e) =>
                setContext((prev) => ({
                  ...prev,
                  risk: { ...(prev.risk ?? {}), duplicateDetectionPolicy: e.target.value },
                }))
              }
            >
              <option value="STRICT">Strict</option>
              <option value="RELAXED">Relaxed</option>
              <option value="DISABLED">Disabled</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-slate-700">Tolerance percent</span>
            <input
              type="number"
              min={0}
              max={100}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              value={context.risk?.tolerancePercent ?? 0}
              onChange={(e) =>
                setContext((prev) => ({
                  ...prev,
                  risk: { ...(prev.risk ?? {}), tolerancePercent: Number(e.target.value) },
                }))
              }
            />
          </label>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
        <h3 className="font-semibold text-slate-900">Vendor to ledger rules (JSON)</h3>
        <textarea
          className="h-44 w-full rounded-md border border-slate-200 p-3 font-mono text-xs"
          value={vendorRulesInput}
          onChange={(e) => setVendorRulesInput(e.target.value)}
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
        <h3 className="font-semibold text-slate-900">Keyword ledger rules (JSON)</h3>
        <textarea
          className="h-44 w-full rounded-md border border-slate-200 p-3 font-mono text-xs"
          value={ledgerRulesInput}
          onChange={(e) => setLedgerRulesInput(e.target.value)}
        />
      </section>

      {message && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{message}</div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => save(false)}
          disabled={saving}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Draft Context'}
        </button>
        <button
          onClick={() => save(true)}
          disabled={saving}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
        >
          Save + Activate
        </button>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold text-slate-900">Version history</h3>
        <div className="mt-3 space-y-2">
          {versions.length === 0 && <p className="text-sm text-slate-500">No context versions yet.</p>}
          {versions.map((v) => (
            <div key={v.id} className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2">
              <div className="text-sm text-slate-700">
                <span className="font-medium">{v.id.slice(0, 8)}</span> · {v.status} · {new Date(v.createdAt).toLocaleString()}
              </div>
              <button
                disabled={v.id === activeId}
                onClick={() => activateVersion(v.id)}
                className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 disabled:opacity-40"
              >
                {v.id === activeId ? 'Active' : 'Activate'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
