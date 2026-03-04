'use client'

import { useEffect, useState } from 'react'

type Organization = {
  id: string
  name: string
  companyCount?: number
}

type Company = {
  id: string
  name: string
}

export default function OrgCompanySwitcher() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [organizationId, setOrganizationId] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const [scopeRes, orgsRes] = await Promise.all([
          fetch('/api/scope'),
          fetch('/api/orgs'),
        ])

        const scopeJson = await scopeRes.json()
        const orgsJson = await orgsRes.json()

        if (orgsJson.success) {
          setOrganizations(orgsJson.data)
        } else {
          setError(orgsJson.error || 'Failed to load organizations')
        }

        if (scopeJson.success) {
          if (scopeJson.data.organizationId) setOrganizationId(scopeJson.data.organizationId)
          if (scopeJson.data.companyId) setCompanyId(scopeJson.data.companyId)
        } else {
          setError(scopeJson.error || 'Failed to load scope')
        }
      } catch {
        setError('Failed to load organizations')
      }
    }

    run()
  }, [])

  useEffect(() => {
    const run = async () => {
      if (!organizationId) {
        setCompanies([])
        setCompanyId('')
        return
      }

      try {
        const res = await fetch(`/api/orgs/${organizationId}/companies`)
        const json = await res.json()
        if (json.success) {
          setCompanies(json.data)

          if (!companyId && json.data.length === 1) {
            const onlyCompanyId = json.data[0].id
            setCompanyId(onlyCompanyId)
            await setScope({ organizationId, companyId: onlyCompanyId })
          }

          if (companyId && !json.data.some((c: Company) => c.id === companyId)) {
            setCompanyId('')
            await setScope({ organizationId, companyId: '' })
          }
          setError(null)
        } else {
          setError(json.error || 'Failed to load companies')
        }
      } catch {
        setError('Failed to load companies')
      }
    }

    run()
  }, [organizationId, companyId])

  const setScope = async (scope: { organizationId?: string; companyId?: string }) => {
    try {
      await fetch('/api/scope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scope),
      })
      setError(null)
    } catch {
      setError('Failed to save active scope')
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={organizationId}
        onChange={async (event) => {
          const value = event.target.value
          setOrganizationId(value)
          setCompanyId('')
          await setScope({ organizationId: value || '', companyId: '' })
        }}
        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900"
      >
        <option value="">Select org</option>
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>

      <select
        value={companyId}
        onChange={async (event) => {
          const value = event.target.value
          setCompanyId(value)
          await setScope({ organizationId: organizationId || '', companyId: value || '' })
        }}
        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900"
        disabled={!organizationId}
      >
        <option value="">Select company</option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </div>
  )
}
