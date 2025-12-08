'use client'

import { useEffect, useMemo, useState } from 'react'
import { Download, Plus, RefreshCw } from 'lucide-react'

type Vendor = {
  id: string
  name: string
  bankName: string
  accountNumber: string
  ifsc: string
  branch: string
  description?: string | null
}

type ExportFormat = 'csv' | 'xlsx'

export default function VendorPaymentsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [exporting, setExporting] = useState<ExportFormat | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [amounts, setAmounts] = useState<Record<string, string>>({})
  const [newVendor, setNewVendor] = useState({
    name: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    branch: '',
    description: '',
  })

  const hasSelection = selected.size > 0

  useEffect(() => {
    loadVendors()
  }, [])

  const loadVendors = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/vendors')
      const data = await res.json()
      if (data.success) {
        setVendors(data.data)
      }
    } catch (error) {
      console.error('Failed to load vendors', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddVendor = async () => {
    if (!newVendor.name || !newVendor.bankName || !newVendor.accountNumber || !newVendor.ifsc || !newVendor.branch) {
      alert('Please fill in all required fields')
      return
    }
    setCreating(true)
    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVendor),
      })
      const data = await res.json()
      if (data.success) {
        setVendors((prev) => [data.data, ...prev])
        setNewVendor({
          name: '',
          bankName: '',
          accountNumber: '',
          ifsc: '',
          branch: '',
          description: '',
        })
      } else {
        alert(data.error || 'Failed to add vendor')
      }
    } catch (error) {
      console.error('Failed to add vendor', error)
      alert('Failed to add vendor')
    } finally {
      setCreating(false)
    }
  }

  const toggleSelect = (id: string, checked: boolean) => {
    const next = new Set(selected)
    if (checked) {
      next.add(id)
    } else {
      next.delete(id)
    }
    setSelected(next)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(new Set(vendors.map((v) => v.id)))
    } else {
      setSelected(new Set())
    }
  }

  const handleExport = async (format: ExportFormat) => {
    if (!hasSelection) {
      alert('Select at least one vendor')
      return
    }
    const payload = Array.from(selected).map((id) => ({
      id,
      amount: parseFloat(amounts[id] || '0') || 0,
    }))

    setExporting(format)
    try {
      const res = await fetch('/api/vendor-payments/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendors: payload, format }),
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error.error || 'Failed to export file')
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = format === 'csv' ? 'vendor-payments.csv' : 'vendor-payments.xlsx'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export', error)
      alert(error instanceof Error ? error.message : 'Failed to export')
    } finally {
      setExporting(null)
    }
  }

  const selectedCountLabel = useMemo(() => {
    if (!hasSelection) return 'No vendors selected'
    return `${selected.size} vendor${selected.size > 1 ? 's' : ''} selected`
  }, [selected, hasSelection])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Payments</h1>
          <p className="text-gray-600 mt-1">Manage vendors and generate bank upload files for payouts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadVendors}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={handleAddVendor}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={creating}
          >
            <Plus className="h-4 w-4" />
            {creating ? 'Saving...' : 'Add Vendor'}
          </button>
        </div>
      </div>

      {/* Add Vendor Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">New Vendor</h2>
            <p className="text-sm text-gray-600">Required fields are marked; use clear bank details for payouts.</p>
          </div>
          <span className="text-xs uppercase tracking-wide text-gray-500 bg-gray-100 px-2 py-1 rounded">Single currency</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              value={newVendor.name}
              onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Vendor name"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Bank *</label>
            <input
              type="text"
              value={newVendor.bankName}
              onChange={(e) => setNewVendor({ ...newVendor, bankName: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Bank name"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Branch *</label>
            <input
              type="text"
              value={newVendor.branch}
              onChange={(e) => setNewVendor({ ...newVendor, branch: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Branch name"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Account Number *</label>
            <input
              type="text"
              value={newVendor.accountNumber}
              onChange={(e) => setNewVendor({ ...newVendor, accountNumber: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Account number"
            />
            <p className="text-xs text-gray-500">Avoid spaces or separators.</p>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">IFSC *</label>
            <input
              type="text"
              value={newVendor.ifsc}
              onChange={(e) => setNewVendor({ ...newVendor, ifsc: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 uppercase"
              placeholder="Bank IFSC"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={newVendor.description}
              onChange={(e) => setNewVendor({ ...newVendor, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Optional notes"
            />
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Vendors</h2>
            <p className="text-sm text-gray-600">{selectedCountLabel}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport('csv')}
              disabled={!hasSelection || exporting !== null}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-black disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
              {exporting === 'csv' ? 'Generating...' : 'Export CSV'}
            </button>
            <button
              onClick={() => handleExport('xlsx')}
              disabled={!hasSelection || exporting !== null}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
              {exporting === 'xlsx' ? 'Generating...' : 'Export Excel'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100/80 backdrop-blur sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size > 0 && selected.size === vendors.length && vendors.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IFSC</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    Loading vendors...
                  </td>
                </tr>
              ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    No vendors added yet. Create your first vendor to get started.
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(vendor.id)}
                        onChange={(e) => toggleSelect(vendor.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                      {vendor.description && <div className="text-xs text-gray-500">{vendor.description}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{vendor.bankName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{vendor.accountNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{vendor.ifsc}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{vendor.branch}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={amounts[vendor.id] ?? ''}
                        onChange={(e) => setAmounts((prev) => ({ ...prev, [vendor.id]: e.target.value }))}
                        placeholder="0.00"
                        className="w-32 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
