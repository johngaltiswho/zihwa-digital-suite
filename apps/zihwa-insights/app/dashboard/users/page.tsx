'use client'

import { useEffect, useMemo, useState } from 'react'
import { RefreshCw, Plus, Search, Users, Mail, Building2 } from 'lucide-react'
import type { CompanyRole, UserRole } from '@prisma/client'

type UserWithAccess = {
  id: string
  name: string | null
  email: string
  role: UserRole
  companyAccesses: {
    id: string
    role: CompanyRole
    company: { id: string; name: string }
  }[]
}

type Company = { id: string; name: string }
type CompaniesResponse = Company[]

const userRoles: UserRole[] = ['ADMIN', 'CONSULTANT', 'ACCOUNTANT']
const companyRoles: CompanyRole[] = ['ADMIN', 'EDITOR', 'VIEWER']

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithAccess[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedCompanyRole, setSelectedCompanyRole] = useState<CompanyRole>('VIEWER')
  const [updatingRole, setUpdatingRole] = useState<string | null>(null)
  const [inviting, setInviting] = useState(false)
  const [inviteForm, setInviteForm] = useState({ email: '', name: '' })
  const [syncing, setSyncing] = useState(false)

  const refreshData = async () => {
    setLoading(true)
    try {
      const [usersRes, companiesRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/companies'),
      ])
      const usersData = await usersRes.json()
      const companiesData = (await companiesRes.json()) as CompaniesResponse
      if (usersData.success) setUsers(usersData.data)
      if (Array.isArray(companiesData)) {
        setCompanies(
          companiesData
            .filter((company): company is Company => typeof company.id === 'string' && typeof company.name === 'string')
            .map((company) => ({ id: company.id, name: company.name }))
        )
      }
    } catch (error) {
      console.error('Failed to load users/companies', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  const handleRoleChange = async (userId: string, role: UserRole) => {
    setUpdatingRole(userId)
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role }),
      })
      const data = await res.json()
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role } : u))
        )
      } else {
        alert(data.error || 'Failed to update role')
      }
    } catch (error) {
      console.error('Failed to update role', error)
      alert('Failed to update role')
    } finally {
      setUpdatingRole(null)
    }
  }

  const handleAssign = async () => {
    if (!selectedUser || !selectedCompany) {
      alert('Select a user and company')
      return
    }
    setAssigning(true)
    try {
      const res = await fetch('/api/company-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser,
          companyId: selectedCompany,
          role: selectedCompanyRole,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser
              ? {
                  ...u,
                  companyAccesses: [
                    // Replace if same company exists
                    ...u.companyAccesses.filter((ca) => ca.company.id !== selectedCompany),
                    {
                      id: data.data.id,
                      role: data.data.role,
                      company: data.data.company,
                    },
                  ],
                }
              : u
          )
        )
      } else {
        alert(data.error || 'Failed to assign company')
      }
    } catch (error) {
      console.error('Failed to assign company', error)
      alert('Failed to assign company')
    } finally {
      setAssigning(false)
    }
  }

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email)),
    [users]
  )

  const handleInvite = async () => {
    if (!inviteForm.email) {
      alert('Email is required')
      return
    }
    setInviting(true)
    try {
      const res = await fetch('/api/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteForm),
      })
      const data = await res.json()
      if (!data.success) {
        alert(data.error || 'Failed to send invite')
      } else {
        alert('Invitation sent')
        setInviteForm({ email: '', name: '' })
      }
    } catch (error) {
      console.error('Failed to send invite', error)
      alert('Failed to send invite')
    } finally {
      setInviting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Team</h1>
          <p className="text-gray-500 text-sm">Manage users and their access to companies</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              setSyncing(true)
              try {
                await fetch('/api/users/sync', { method: 'POST' })
                await refreshData()
              } catch (e) {
                console.error('Sync failed', e)
                alert('Failed to sync users from Supabase')
              } finally {
                setSyncing(false)
              }
            }}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            disabled={syncing}
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync'}
          </button>
          <button
            onClick={() => setInviteForm({ email: '', name: '' })}
            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Invite user
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all group">
          <div className="p-2 rounded-md bg-blue-50 group-hover:bg-blue-100 transition-colors">
            <Mail className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <input
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email to invite user"
                className="flex-1 px-0 py-1 text-gray-900 placeholder-gray-400 border-0 border-b border-gray-100 focus:border-gray-300 focus:outline-none focus:ring-0 bg-transparent text-sm"
              />
              <input
                type="text"
                value={inviteForm.name}
                onChange={(e) => setInviteForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Name (optional)"
                className="w-32 px-0 py-1 text-gray-900 placeholder-gray-400 border-0 border-b border-gray-100 focus:border-gray-300 focus:outline-none focus:ring-0 bg-transparent text-sm"
              />
              <button
                onClick={handleInvite}
                disabled={inviting || !inviteForm.email}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {inviting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all group">
          <div className="p-2 rounded-md bg-green-50 group-hover:bg-green-100 transition-colors">
            <Building2 className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="flex-1 px-0 py-1 text-gray-900 border-0 border-b border-gray-100 focus:border-gray-300 focus:outline-none focus:ring-0 bg-transparent text-sm"
              >
                <option value="">Select user</option>
                {sortedUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name || u.email}
                  </option>
                ))}
              </select>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-40 px-0 py-1 text-gray-900 border-0 border-b border-gray-100 focus:border-gray-300 focus:outline-none focus:ring-0 bg-transparent text-sm"
              >
                <option value="">Select company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedCompanyRole}
                onChange={(e) => setSelectedCompanyRole(e.target.value as CompanyRole)}
                className="w-24 px-0 py-1 text-gray-900 border-0 border-b border-gray-100 focus:border-gray-300 focus:outline-none focus:ring-0 bg-transparent text-sm"
              >
                {companyRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssign}
                disabled={assigning || !selectedUser || !selectedCompany}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {assigning ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Team members</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <Users className="w-8 h-8 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : sortedUsers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-8 h-8 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
            <p className="text-gray-500 mb-6 text-sm">Invite users to join your workspace</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedUsers.map((user) => (
              <div 
                key={user.id}
                className="group p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {user.name || 'Unnamed User'}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 ml-13">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Role:</span>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                          disabled={updatingRole === user.id}
                          className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-gray-300"
                        >
                          {userRoles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs text-gray-500">Companies:</span>
                        {user.companyAccesses.length === 0 ? (
                          <span className="text-xs text-gray-400">None assigned</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {user.companyAccesses.map((access) => (
                              <span
                                key={access.company.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700"
                              >
                                {access.company.name}
                                <span className="text-[10px] uppercase text-gray-500">({access.role})</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
