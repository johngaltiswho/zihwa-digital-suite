'use client'

import { useEffect, useMemo, useState } from 'react'
import type { EmployeeStatus } from '@prisma/client'
import {
  Loader2,
  Search,
  UserPlus,
  Users,
  Upload,
  HardHat,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type CompanyOption = { id: string; name: string }

type LabourRow = {
  id: string
  labourId: string
  firstName: string
  lastName: string
  fullName: string
  designation?: string | null
  status: EmployeeStatus
  phone?: string | null
  netSalary?: number | null
  dob?: string | Date | null
  company?: CompanyOption | null
}

type BulkUploadSummary = {
  totalRows: number
  processedRows: number
  created: number
  updated: number
  failed: number
  company: string
}

type BulkFailedRow = {
  rowNumber: number
  errors: string[]
}

const LABOUR_STATUSES: EmployeeStatus[] = ['ACTIVE', 'INACTIVE', 'TERMINATED']

const formatCurrency = (value?: number | null) => {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDate = (value?: string | Date | null) => {
  if (!value) return '—'
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function LaboursPage() {
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/users/user')
      .then((r) => r.json())
      .then((d) => { if (d.role) setUserRole(d.role) })
      .catch(() => {})
  }, [])

  // ✅ ONE LINE CHANGE: added || userRole === 'CONSULTANT'
  const isAccountant = userRole === 'ACCOUNTANT' || userRole === 'CONSULTANT'

  const [loading, setLoading] = useState(true)
  const [labours, setLabours] = useState<LabourRow[]>([])
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | EmployeeStatus>('all')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [savingLabour, setSavingLabour] = useState(false)
  const [editingLabourId, setEditingLabourId] = useState<string | null>(null)
  const [editLabourForm, setEditLabourForm] = useState({
    firstName: '',
    lastName: '',
    designation: '',
    phone: '',
    dob: '',
    netSalary: '',
    status: 'ACTIVE',
  })
  const [savingRow, setSavingRow] = useState(false)
  const [deletingRow, setDeletingRow] = useState<string | null>(null)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [bulkCompanyId, setBulkCompanyId] = useState('')
  const [bulkFile, setBulkFile] = useState<File | null>(null)
  const [bulkUploading, setBulkUploading] = useState(false)
  const [bulkResult, setBulkResult] = useState<{ summary: BulkUploadSummary; failed: BulkFailedRow[] } | null>(null)

  const [newLabour, setNewLabour] = useState({
    companyId: '',
    labourId: '',
    firstName: '',
    lastName: '',
    designation: '',
    phone: '',
    dob: '',
    netSalary: '',
    status: 'ACTIVE' as EmployeeStatus,
  })

  const fetchLabours = async () => {
    try {
      const res = await fetch('/api/labours')
      const data = await res.json()
      if (data.success) {
        setLabours(data.data)
      } else {
        throw new Error(data.error || 'Failed to load labours')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/companies')
      const data = await res.json()
      if (Array.isArray(data)) {
        setCompanies(data.map((c: CompanyOption) => ({ id: c.id, name: c.name })))
      }
    } catch (error) {
      console.error('Failed to load companies', error)
    }
  }

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true)
      await Promise.all([fetchLabours(), fetchCompanies()])
      setLoading(false)
    }
    bootstrap()
  }, [])

  const startEditingLabour = (labour: LabourRow) => {
    setEditingLabourId(labour.id)
    setEditLabourForm({
      firstName: labour.firstName,
      lastName: labour.lastName,
      designation: labour.designation || '',
      phone: labour.phone || '',
      dob: labour.dob ? new Date(labour.dob).toISOString().split('T')[0] : '',
      netSalary: labour.netSalary ? String(labour.netSalary) : '',
      status: labour.status,
    })
  }

  const cancelEditingLabour = () => {
    setEditingLabourId(null)
    setSavingRow(false)
  }

  const saveEditingLabour = async () => {
    if (!editingLabourId) return
    setSavingRow(true)
    try {
      const payload = {
        id: editingLabourId,
        firstName: editLabourForm.firstName,
        lastName: editLabourForm.lastName,
        designation: editLabourForm.designation,
        phone: editLabourForm.phone,
        dob: editLabourForm.dob || undefined,
        netSalary: editLabourForm.netSalary ? Number(editLabourForm.netSalary) : null,
        status: editLabourForm.status,
      }
      const response = await fetch('/api/labours', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update labour')
      }
      await fetchLabours()
      cancelEditingLabour()
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Failed to update labour')
    } finally {
      setSavingRow(false)
    }
  }

  const handleDeleteLabour = async (id: string) => {
    const confirmed = window.confirm('Delete this labour record? This action cannot be undone.')
    if (!confirmed) return
    setDeletingRow(id)
    try {
      const response = await fetch('/api/labours', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete labour')
      }
      setLabours((prev) => prev.filter((l) => l.id !== id))
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Failed to delete labour')
    } finally {
      setDeletingRow(null)
    }
  }

  const handleAddLabour = async () => {
    if (!newLabour.companyId || !newLabour.labourId || !newLabour.firstName || !newLabour.lastName) {
      alert('Company, labour ID, first name and last name are required')
      return
    }
    setSavingLabour(true)
    try {
      const payload = {
        ...newLabour,
        netSalary: newLabour.netSalary ? Number(newLabour.netSalary) : undefined,
        dob: newLabour.dob || undefined,
      }
      const res = await fetch('/api/labours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to create labour')
      }
      await fetchLabours()
      setNewLabour({
        companyId: '', labourId: '', firstName: '', lastName: '',
        designation: '', phone: '', dob: '', netSalary: '', status: 'ACTIVE',
      })
      setShowAddModal(false)
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Failed to add labour')
    } finally {
      setSavingLabour(false)
    }
  }

  const handleBulkUpload = async () => {
    if (!bulkCompanyId) { alert('Select a company for the upload.'); return }
    if (!bulkFile) { alert('Choose a CSV file to upload.'); return }
    setBulkUploading(true)
    try {
      const formData = new FormData()
      formData.append('companyId', bulkCompanyId)
      formData.append('file', bulkFile)
      const response = await fetch('/api/labours/import', { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to import labours')
      }
      setBulkResult({ summary: data.summary, failed: data.failed || [] })
      setBulkFile(null)
      setFileInputKey((key) => key + 1)
      await fetchLabours()
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Failed to upload labours')
    } finally {
      setBulkUploading(false)
    }
  }

  const filteredLabours = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return labours
      .filter((labour) => {
        if (statusFilter !== 'all' && labour.status !== statusFilter) return false
        if (companyFilter !== 'all' && labour.company?.id !== companyFilter) return false
        if (!term) return true
        return [labour.fullName, labour.designation || '', labour.labourId, labour.company?.name || '']
          .some((v) => v.toLowerCase().includes(term))
      })
      .sort((a, b) => a.fullName.localeCompare(b.fullName))
  }, [labours, searchTerm, statusFilter, companyFilter])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading labours...
        </div>
      </div>
    )
  }

  return (
    <div className="-mt-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <HardHat className="h-4 w-4 text-gray-400" />
            Labour Management
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">Labours</h1>
          <p className="text-gray-500 mt-1">Manage daily wage workers and contract staff.</p>
        </div>
        <div className="flex items-center gap-3">
          {!isAccountant && (
            <Button onClick={() => setShowAddModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Labour
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500"><Users className="h-4 w-4 text-orange-500" />Total Labours</div>
          <div className="mt-3 text-3xl font-semibold text-gray-900">{labours.length}</div>
          <p className="text-xs text-gray-500 mt-1">{labours.filter((l) => l.status === 'ACTIVE').length} active</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500"><HardHat className="h-4 w-4 text-blue-500" />Companies</div>
          <div className="mt-3 text-3xl font-semibold text-gray-900">{companies.length}</div>
          <p className="text-xs text-gray-500 mt-1">Active clients</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500"><Users className="h-4 w-4 text-purple-500" />Filtered</div>
          <div className="mt-3 text-3xl font-semibold text-gray-900">{filteredLabours.length}</div>
          <p className="text-xs text-gray-500 mt-1">Matching current filters</p>
        </div>
      </div>

      {/* Filters + Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search labours..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
              </div>
              <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className="h-10 rounded-md border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none">
                <option value="all">All companies</option>
                {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | EmployeeStatus)} className="h-10 rounded-md border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none">
                <option value="all">All statuses</option>
                {LABOUR_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <span className="text-sm text-gray-500">Showing <strong>{filteredLabours.length}</strong> of {labours.length}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-2 text-left">Labour</th>
                <th className="px-4 py-2 text-left">Company</th>
                <th className="px-4 py-2 text-left">Designation</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">DOB</th>
                <th className="px-4 py-2 text-left">Net Salary</th>
                <th className="px-4 py-2 text-left">Status</th>
                {!isAccountant && <th className="px-4 py-2 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredLabours.length === 0 ? (
                <tr>
                  <td colSpan={isAccountant ? 7 : 8} className="px-4 py-12 text-center text-gray-500">
                    <HardHat className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                    No labours match your filters
                  </td>
                </tr>
              ) : (
                filteredLabours.map((labour) => {
                  const isEditing = editingLabourId === labour.id
                  return (
                    <tr key={labour.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3 align-top">
                        <div className="font-medium text-gray-900">{labour.fullName}</div>
                        <div className="text-xs text-gray-500">#{labour.labourId}</div>
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-gray-600">{labour.company?.name || '—'}</td>
                      <td className="px-4 py-3 align-top text-sm text-gray-600">
                        {isEditing
                          ? <Input value={editLabourForm.designation} onChange={(e) => setEditLabourForm((prev) => ({ ...prev, designation: e.target.value }))} className="h-8" />
                          : labour.designation || '—'}
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-gray-600">
                        {isEditing
                          ? <Input value={editLabourForm.phone} onChange={(e) => setEditLabourForm((prev) => ({ ...prev, phone: e.target.value }))} className="h-8" />
                          : labour.phone || '—'}
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-gray-600">
                        {isEditing
                          ? <Input type="date" value={editLabourForm.dob} onChange={(e) => setEditLabourForm((prev) => ({ ...prev, dob: e.target.value }))} className="h-8" />
                          : formatDate(labour.dob)}
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-gray-900">
                        {isEditing
                          ? <Input type="number" value={editLabourForm.netSalary} onChange={(e) => setEditLabourForm((prev) => ({ ...prev, netSalary: e.target.value }))} className="h-8" />
                          : formatCurrency(labour.netSalary)}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {isEditing ? (
                          <select value={editLabourForm.status} onChange={(e) => setEditLabourForm((prev) => ({ ...prev, status: e.target.value }))} className="h-8 w-full rounded-md border border-gray-200 px-2 text-xs text-gray-700 focus:outline-none">
                            {LABOUR_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : (
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${labour.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : labour.status === 'INACTIVE' ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-600'}`}>
                            {labour.status}
                          </span>
                        )}
                      </td>
                      {!isAccountant && (
                        <td className="px-4 py-3 align-top text-right text-xs">
                          {isEditing ? (
                            <div className="flex justify-end gap-2">
                              <button onClick={saveEditingLabour} disabled={savingRow} className="rounded border border-gray-200 px-2 py-1 font-medium text-gray-900 hover:bg-gray-100 disabled:opacity-50">{savingRow ? 'Saving…' : 'Save'}</button>
                              <button onClick={cancelEditingLabour} className="rounded px-2 py-1 text-gray-500 hover:text-gray-900">Cancel</button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => startEditingLabour(labour)} className="rounded border border-gray-200 px-2 py-1 text-gray-600 hover:bg-gray-100">Edit</button>
                              <button onClick={() => handleDeleteLabour(labour.id)} disabled={deletingRow === labour.id} className="rounded px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50">{deletingRow === labour.id ? 'Deleting…' : 'Delete'}</button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Upload — hidden for ACCOUNTANT and CONSULTANT */}
      {!isAccountant && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900"><Upload className="h-4 w-4 text-gray-500" />Bulk Import</div>
              <p className="mt-1 text-sm text-gray-500">Upload a CSV to create or update multiple labour records at once.</p>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Company</label>
              <select value={bulkCompanyId} onChange={(e) => setBulkCompanyId(e.target.value)} className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none">
                <option value="">Select company</option>
                {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">CSV file</label>
              <input key={fileInputKey} type="file" accept=".csv" onChange={(e) => setBulkFile(e.target.files?.[0] || null)} className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700" />
            </div>
          </div>
          <Button onClick={handleBulkUpload} className="mt-4 w-full" disabled={bulkUploading || !bulkCompanyId || !bulkFile}>
            {bulkUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading</> : 'Import labours'}
          </Button>
          {bulkResult && (
            <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50/80 p-4 text-sm">
              <p className="font-medium text-gray-900">Upload summary</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-gray-700">
                <span>Total rows: {bulkResult.summary.totalRows}</span>
                <span>Processed: {bulkResult.summary.processedRows}</span>
                <span>Created: {bulkResult.summary.created}</span>
                <span>Updated: {bulkResult.summary.updated}</span>
                <span>Failed: {bulkResult.summary.failed}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Labour Modal — hidden for ACCOUNTANT and CONSULTANT */}
      {showAddModal && !isAccountant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="max-w-2xl w-full rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add labour</h2>
                <p className="text-sm text-gray-500">Register a new labour record.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-sm text-gray-500 hover:text-gray-900">Close</button>
            </div>
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Company</label>
                  <select value={newLabour.companyId} onChange={(e) => setNewLabour((prev) => ({ ...prev, companyId: e.target.value }))} className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none">
                    <option value="">Select company</option>
                    {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Labour ID</label><Input value={newLabour.labourId} onChange={(e) => setNewLabour((prev) => ({ ...prev, labourId: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1"><label className="text-sm font-medium text-gray-700">First name</label><Input value={newLabour.firstName} onChange={(e) => setNewLabour((prev) => ({ ...prev, firstName: e.target.value }))} /></div>
                <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Last name</label><Input value={newLabour.lastName} onChange={(e) => setNewLabour((prev) => ({ ...prev, lastName: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Designation</label><Input value={newLabour.designation} onChange={(e) => setNewLabour((prev) => ({ ...prev, designation: e.target.value }))} /></div>
                <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Phone</label><Input value={newLabour.phone} onChange={(e) => setNewLabour((prev) => ({ ...prev, phone: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Date of birth</label><Input type="date" value={newLabour.dob} onChange={(e) => setNewLabour((prev) => ({ ...prev, dob: e.target.value }))} /></div>
                <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Net salary (INR)</label><Input type="number" value={newLabour.netSalary} onChange={(e) => setNewLabour((prev) => ({ ...prev, netSalary: e.target.value }))} /></div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select value={newLabour.status} onChange={(e) => setNewLabour((prev) => ({ ...prev, status: e.target.value as EmployeeStatus }))} className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-700 focus:outline-none">
                  {LABOUR_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleAddLabour} disabled={savingLabour}>
                {savingLabour ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving</> : 'Save labour'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}