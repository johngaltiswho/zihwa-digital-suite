'use client'

import { useEffect, useMemo, useRef,useState } from 'react'
import { RefreshCw, Plus, Search, Users, Mail, Building2, MoreHorizontal, Trash2, ArrowRightLeft, X } from 'lucide-react'
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

const userRoles: UserRole[] = ['ADMIN', 'CONSULTANT', 'ACCOUNTANT', 'HR']
const companyRoles: CompanyRole[] = ['ADMIN', 'EDITOR', 'ACCOUNTANT','HR', 'VIEWER']

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithAccess[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  // NEW: Tab State for the Combined Action Card
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedCompanyRole, setSelectedCompanyRole] = useState<CompanyRole>('VIEWER')
  const [updatingRole, setUpdatingRole] = useState<string | null>(null)
  const [deletingUser, setDeletingUser] = useState<string | null>(null)
  const [inviting, setInviting] = useState(false)
  const [inviteForm, setInviteForm] = useState({ 
  email: '', 
  name: '', 
  role: 'ACCOUNTANT' as UserRole,
  companyId: '',
  companyRole: 'ACCOUNTANT' as CompanyRole,
})
  const [syncing, setSyncing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)

  // 3-dot menu
  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  // Change company modal
  const [changeCompanyModal, setChangeCompanyModal] = useState<{
    userId: string
    userName: string
    newCompanyId: string
    newCompanyRole: CompanyRole
  } | null>(null)

  // ✅ Custom delete confirm modal (replaces native confirm())
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    userId: string
    userName: string
    userRole: UserRole
  } | null>(null)
  // ✅ Fetch current logged-in user's role
  useEffect(() => {
    fetch('/api/users/user')
      .then(r => r.json())
      .then(d => { if (d.role) setCurrentUserRole(d.role) })
      .catch(() => {})
  }, [])

  // ✅ Only ADMIN and HR can see the 3-dot menu
  const canManageUsers = currentUserRole === 'ADMIN' || currentUserRole === 'HR'

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuUserId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  const refreshData = async () => {
    setLoading(true)
    try {
      const [usersRes, companiesRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/companies'),
      ])
      const usersData = await usersRes.json()
      
      if (usersData.success) setUsers(usersData.data)
      const companiesData = await companiesRes.json()
const companiesList = Array.isArray(companiesData)
  ? companiesData
  : Array.isArray(companiesData?.data)
    ? companiesData.data
    : []
setCompanies(
  companiesList
    .filter((c: Company) => typeof c.id === 'string' && typeof c.name === 'string')
    .map((c: Company) => ({ id: c.id, name: c.name }))
)
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
  // ✅ ADMIN can delete anyone except other ADMINs
  // ✅ HR can only delete CONSULTANT and ACCOUNTANT
  const handleDeleteUser = (userId: string, userName: string, userRole: UserRole) => {
    setOpenMenuUserId(null)
    if (userRole === 'ADMIN') return // nobody can delete ADMIN
    if (currentUserRole === 'HR' && userRole !== 'CONSULTANT' && userRole !== 'ACCOUNTANT') return
    setDeleteConfirmModal({ userId, userName, userRole })
  }

  // ✅ Confirmed delete
  const confirmDeleteUser = async () => {
    if (!deleteConfirmModal) return
    setDeletingUser(deleteConfirmModal.userId)
    setDeleteConfirmModal(null)
    try {
      const res = await fetch(`/api/users?id=${deleteConfirmModal.userId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteConfirmModal.userId))
      } else {
        alert(data.error || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Failed to delete user', error)
      alert('Failed to delete user')
    } finally {
      setDeletingUser(null)
    }
  }
  // ✅ Open change company modal
  const handleOpenChangeCompany = (user: UserWithAccess) => {
    setOpenMenuUserId(null)
    setChangeCompanyModal({
      userId: user.id,
      userName: user.name || user.email,
      newCompanyId: '',
      newCompanyRole: 'VIEWER',
    })
  }

  // ✅ Submit change company
  const handleChangeCompany = async () => {
    if (!changeCompanyModal?.newCompanyId) {
      alert('Please select a company')
      return
    }
    setAssigning(true)
    try {
      const res = await fetch('/api/company-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: changeCompanyModal.userId,
          companyId: changeCompanyModal.newCompanyId,
          role: changeCompanyModal.newCompanyRole,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === changeCompanyModal.userId
              ? {
                  ...u,
                  companyAccesses: [
                    ...u.companyAccesses.filter((ca) => ca.company.id !== changeCompanyModal.newCompanyId),
                    { id: data.data.id, role: data.data.role, company: data.data.company },
                  ],
                }
              : u
          )
        )
        setChangeCompanyModal(null)
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
        // Reset after successful assignment
        setSelectedUser('')
        setSelectedCompany('')
        alert('Access assigned successfully')
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
        setInviteForm({ email: '', name: '', role: 'CONSULTANT', companyId: '', companyRole: 'VIEWER' })
        await refreshData()
      }
    } catch (error) {
      console.error('Failed to send invite', error)
      alert('Failed to send invite')
    } finally {
      setInviting(false)
    }
  }
  const filteredUsers = useMemo(
    () =>
      sortedUsers.filter(
        (u) =>
          (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [sortedUsers, searchQuery]
  )

  return (
    <div className="-mt-5 space-y-4">
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
            onClick={() => setInviteForm({ email: '', name: '', role: 'CONSULTANT', companyId: '', companyRole: 'VIEWER' })}
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
            <div className="flex items-center gap-3 flex-wrap">
  <input
    type="email"
    value={inviteForm.email}
    onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
    placeholder="Enter email to invite user"
    className="flex-1 min-w-40 px-0 py-1 text-gray-900 placeholder-gray-400 border-0 border-b border-gray-100 focus:border-gray-300 focus:outline-none focus:ring-0 bg-transparent text-sm"
  />
  <input
    type="text"
    value={inviteForm.name}
    onChange={(e) => setInviteForm((prev) => ({ ...prev, name: e.target.value }))}
    placeholder="Name (optional)"
    className="w-32 px-0 py-1 text-gray-900 placeholder-gray-400 border-0 border-b border-gray-100 focus:border-gray-300 focus:outline-none focus:ring-0 bg-transparent text-sm"
  />
  <select
    value={inviteForm.role}
    onChange={(e) => setInviteForm((prev) => ({ ...prev, role: e.target.value as UserRole }))}
    className="w-28 px-0 py-1 text-gray-900 border-0 border-b border-gray-100 focus:border-gray-300 focus:outline-none focus:ring-0 bg-transparent text-xs"
  >
    {userRoles.map((r) => (
      <option key={r} value={r}>{r}</option>
    ))}
  </select>
  <select
    value={inviteForm.companyId}
    onChange={(e) => setInviteForm((prev) => ({ ...prev, companyId: e.target.value }))}
    className="w-40 px-0 py-1 text-gray-900 border-0 border-b border-gray-100 focus:border-gray-300 focus:outline-none focus:ring-0 bg-transparent text-sm"
  >
    <option value="">No company</option>
    {companies.map((c) => (
      <option key={c.id} value={c.id}>{c.name}</option>
    ))}
  </select>
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
      <div className="space-y-3 text-gray-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Team members</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                        <span className="text-xs text-gray-900">Role:</span>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                          disabled={updatingRole === user.id}
                          className="px-2 py-1 text-xs uppercase text-gray-500 border border-gray-200 rounded focus:outline-none focus:border-gray-300"
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
                                {/* <span className="text-[10px] uppercase text-gray-500">({access.role})</span> */}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* ✅ 3-dot menu — only visible for ADMIN and HR */}
                  {canManageUsers && (
                    <div className="relative ml-4" ref={openMenuUserId === user.id ? menuRef : null}>
                      <button
                        onClick={() => setOpenMenuUserId(openMenuUserId === user.id ? null : user.id)}
                        disabled={deletingUser === user.id}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
                        title="More options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {/* Dropdown */}
                      {openMenuUserId === user.id && (
                        <div className="absolute right-0 top-9 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                          <button
                            onClick={() => handleOpenChangeCompany(user)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <ArrowRightLeft className="w-4 h-4 text-blue-500" />
                            Change company
                          </button>
                          {/* ✅ ADMIN: can delete anyone except other ADMINs
                               ✅ HR: can only delete CONSULTANT and ACCOUNTANT */}
                          {user.role !== 'ADMIN' &&
                            (currentUserRole === 'ADMIN' || (currentUserRole === 'HR' && (user.role === 'CONSULTANT' || user.role === 'ACCOUNTANT'))) && (
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name || user.email, user.role)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete user
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Delete Confirm Modal */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Delete User</h2>
              <button
                onClick={() => setDeleteConfirmModal(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-1">
              Are you sure you want to delete
            </p>
            <p className="text-sm font-semibold text-gray-900 mb-4">&ldquo;{deleteConfirmModal.userName}&rdquo;?</p>
            <p className="text-xs text-rose-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmModal(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                disabled={deletingUser === deleteConfirmModal.userId}
                className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-50 transition-colors"
              >
                {deletingUser ? 'Deleting...' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Change Company Modal */}
      {changeCompanyModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Change Company</h2>
              <button
                onClick={() => setChangeCompanyModal(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Assign <span className="font-medium text-gray-800">{changeCompanyModal.userName}</span> to a company
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Company</label>
                <select
                  value={changeCompanyModal.newCompanyId}
                  onChange={(e) => setChangeCompanyModal((prev) => prev ? { ...prev, newCompanyId: e.target.value } : null)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-gray-400"
                >
                  <option value="">Select a company</option>
                  {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Role</label>
                <select
                  value={changeCompanyModal.newCompanyRole}
                  onChange={(e) => setChangeCompanyModal((prev) => prev ? { ...prev, newCompanyRole: e.target.value as CompanyRole } : null)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-gray-400"
                >
                  {companyRoles.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setChangeCompanyModal(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeCompany}
                disabled={assigning || !changeCompanyModal.newCompanyId}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {assigning ? 'Saving...' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}