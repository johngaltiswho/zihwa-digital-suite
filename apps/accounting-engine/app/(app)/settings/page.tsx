'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'

type Org = { id: string; name: string }
type Member = { id: string; userId: string; role: 'OWNER' | 'ADMIN' | 'ACCOUNTANT' | 'VIEWER' }
type Company = { id: string; name: string; slug: string }

export default function SettingsPage() {
  const [orgs, setOrgs] = useState<Org[]>([])
  const [selectedOrgId, setSelectedOrgId] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [newMemberUserId, setNewMemberUserId] = useState('')
  const [newMemberRole, setNewMemberRole] = useState<'VIEWER' | 'ACCOUNTANT' | 'ADMIN'>('VIEWER')
  const [companyScopeId, setCompanyScopeId] = useState('')
  const [companyRole, setCompanyRole] = useState<'VIEWER' | 'PREPARER' | 'APPROVER' | 'ADMIN'>('VIEWER')
  const [error, setError] = useState('')

  const loadOrgs = async () => {
    const res = await fetch('/api/orgs')
    const json = await res.json()
    if (json.success) {
      setOrgs(json.data)
      if (!selectedOrgId && json.data.length > 0) setSelectedOrgId(json.data[0].id)
    }
  }

  const loadOrgDetails = async (orgId: string) => {
    if (!orgId) return
    const [membersRes, companiesRes] = await Promise.all([
      fetch(`/api/orgs/${orgId}/members`),
      fetch(`/api/orgs/${orgId}/companies`),
    ])
    const membersJson = await membersRes.json()
    const companiesJson = await companiesRes.json()

    if (membersJson.success) setMembers(membersJson.data)
    if (companiesJson.success) setCompanies(companiesJson.data)
  }

  useEffect(() => {
    loadOrgs()
  }, [])

  useEffect(() => {
    loadOrgDetails(selectedOrgId)
  }, [selectedOrgId])

  const addMember = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    const res = await fetch(`/api/orgs/${selectedOrgId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: newMemberUserId,
        role: newMemberRole,
        companyId: companyScopeId || undefined,
        companyRole: companyScopeId ? companyRole : undefined,
      }),
    })
    const json = await res.json()
    if (!json.success) {
      setError(json.error || 'Failed to add member')
      return
    }
    setNewMemberUserId('')
    await loadOrgDetails(selectedOrgId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-600">Manage organization members and company setup.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <label className="block text-sm">
          <span className="text-slate-700">Organization</span>
          <select
            className="mt-1 w-full max-w-md rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900"
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
          >
            <option value="">Select organization</option>
            {orgs.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </label>

        {selectedOrgId && (
          <div className="mt-4 flex gap-3">
            <Link href={`/orgs/${selectedOrgId}/companies/new`} className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
              Add company
            </Link>
            <Link href="/orgs/new" className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">
              New organization
            </Link>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900">Members</h2>
          <form className="mt-3 space-y-3" onSubmit={addMember}>
            <input
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400"
              placeholder="Supabase user ID"
              value={newMemberUserId}
              onChange={(e) => setNewMemberUserId(e.target.value)}
              required
            />
            <select
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value as typeof newMemberRole)}
            >
              <option value="VIEWER">Viewer</option>
              <option value="ACCOUNTANT">Preparer (Accountant)</option>
              <option value="ADMIN">Admin</option>
            </select>
            <select
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              value={companyScopeId}
              onChange={(e) => setCompanyScopeId(e.target.value)}
            >
              <option value="">No company override</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            <select
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              value={companyRole}
              onChange={(e) => setCompanyRole(e.target.value as typeof companyRole)}
              disabled={!companyScopeId}
            >
              <option value="VIEWER">Company Viewer</option>
              <option value="PREPARER">Company Preparer</option>
              <option value="APPROVER">Company Approver</option>
              <option value="ADMIN">Company Admin</option>
            </select>
            <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white" type="submit">
              Add member
            </button>
            {error && <p className="text-sm text-rose-600">{error}</p>}
          </form>
          <div className="mt-4 space-y-2">
            {members.map((member) => (
              <div key={member.id} className="rounded-md border border-slate-100 px-3 py-2 text-sm text-slate-700">
                {member.userId} · {member.role}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900">Companies</h2>
          <div className="mt-3 space-y-2">
            {companies.map((company) => (
              <div key={company.id} className="rounded-md border border-slate-100 px-3 py-2">
                <p className="text-sm font-medium text-slate-900">{company.name}</p>
                <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-600">
                  <span>{company.slug}</span>
                  <Link href={`/companies/${company.id}/context`} className="text-sky-700 hover:underline">Context</Link>
                  <Link href={`/companies/${company.id}/integrations/zoho`} className="text-sky-700 hover:underline">Zoho</Link>
                  <Link href={`/companies/${company.id}/copilot`} className="text-sky-700 hover:underline">Copilot</Link>
                </div>
              </div>
            ))}
            {companies.length === 0 && <p className="text-sm text-slate-500">No companies found in this org.</p>}
          </div>
        </section>
      </div>
    </div>
  )
}
