'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Company {
  id: string
  name: string
}

interface DocumentUploadProps {
  companies: Company[]
  defaultCompanyId?: string
}

type DocumentCategoryValue =
  | 'KYC'
  | 'CERTIFICATE'
  | 'FINANCIAL_STATEMENT'
  | 'EMPLOYEE_RECORD'
  | 'COMPLIANCE_DOC'
  | 'CONTRACT'
  | 'OTHER'

type UploadRow = {
  id: string
  companyId: string
  documentName: string
  category: DocumentCategoryValue
  file?: File
}

const categories: { value: DocumentCategoryValue; label: string }[] = [
  { value: 'KYC', label: 'KYC Documents' },
  { value: 'CERTIFICATE', label: 'Certificates' },
  { value: 'FINANCIAL_STATEMENT', label: 'Financial Statements' },
  { value: 'EMPLOYEE_RECORD', label: 'Employee Records' },
  { value: 'COMPLIANCE_DOC', label: 'Compliance Documents' },
  { value: 'CONTRACT', label: 'Contracts' },
  { value: 'OTHER', label: 'Other' },
]

const createRow = (overrides?: Partial<UploadRow>): UploadRow => ({
  id: `row-${Math.random().toString(36).slice(2)}`,
  companyId: overrides?.companyId ?? '',
  documentName: overrides?.documentName ?? '',
  category: overrides?.category ?? 'OTHER',
  file: overrides?.file,
})

export default function DocumentUpload({ companies, defaultCompanyId }: DocumentUploadProps) {
  const router = useRouter()
  const [companyOptions, setCompanyOptions] = useState<Company[]>(companies)
  const [rows, setRows] = useState<UploadRow[]>(() => [createRow({ companyId: defaultCompanyId })])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setCompanyOptions(companies)
  }, [companies])

  useEffect(() => {
    if (companies.length === 0) {
      ;(async () => {
        try {
          const response = await fetch('/api/companies')
          if (!response.ok) return
          const data = (await response.json()) as Company[]
          setCompanyOptions(data)
          setRows((prev) =>
            prev.map((row, index) => {
              if (index === 0 && !row.companyId && defaultCompanyId) {
                return { ...row, companyId: defaultCompanyId }
              }
              return row
            })
          )
        } catch (error) {
          console.error('Failed to fetch companies for upload', error)
        }
      })()
    }
  }, [companies.length, defaultCompanyId])

  const validRows = useMemo(
    () => rows.filter((row) => row.companyId && row.file),
    [rows]
  )

  const updateRow = (rowId: string, updates: Partial<UploadRow>) => {
    setRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, ...updates } : row)))
  }

  const addRow = () => {
    setRows((prev) => [...prev, createRow({ companyId: defaultCompanyId })])
  }

  const removeRow = (rowId: string) => {
    if (rows.length === 1) {
      setRows([createRow({ companyId: defaultCompanyId })])
      return
    }
    setRows((prev) => prev.filter((row) => row.id !== rowId))
  }

  const handleFileChange = (rowId: string, file?: File) => {
    if (!file) return
    updateRow(rowId, { file, documentName: file.name })
  }

  const uploadFile = async (file: File, companyId: string) => {
    const timestamp = Date.now()
    const cleanFileName = file.name.replace(/\s+/g, '_')
    const fileName = `${timestamp}-${cleanFileName}`
    const folderPath = companyId ? `companies/${companyId}/${fileName}` : `general/${fileName}`

    const { error } = await supabase.storage.from('Zihwa-digital-suite').upload(folderPath, file)
    if (error) {
      throw new Error(error.message)
    }

    const { data } = supabase.storage.from('Zihwa-digital-suite').getPublicUrl(folderPath)
    return {
      fileUrl: data.publicUrl,
      storedName: fileName,
    }
  }

  const handleSave = async () => {
    if (validRows.length === 0) {
      alert('Add at least one row with a company and attachment before saving.')
      return
    }

    setIsSaving(true)
    try {
      for (const row of validRows) {
        const file = row.file as File
        const { fileUrl } = await uploadFile(file, row.companyId)

        const response = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: row.documentName || file.name,
            description: null,
            category: row.category,
            fileUrl,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type || 'application/octet-stream',
            companyId: row.companyId,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to save ${row.documentName || file.name}`)
        }
      }

      router.push('/dashboard/documents')
      router.refresh()
    } catch (error) {
      console.error('Error saving documents', error)
      alert(error instanceof Error ? error.message : 'Failed to save documents')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Bulk upload</h3>
            <p className="text-xs text-gray-500">Add rows to upload multiple documents in one go.</p>
          </div>
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" />
            Add row
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Attachment</th>
                <th className="px-4 py-3 text-left">Document name</th>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3">
                    <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900">
                      {row.file ? row.file.name : 'Choose file'}
                      <input
                        type="file"
                        className="hidden"
                        onChange={(event) => handleFileChange(row.id, event.target.files?.[0])}
                      />
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={row.documentName}
                      onChange={(event) => updateRow(row.id, { documentName: event.target.value })}
                      placeholder="Enter document name"
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-gray-300 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={row.companyId}
                      onChange={(event) => updateRow(row.id, { companyId: event.target.value })}
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-300 focus:outline-none"
                    >
                      <option value="">Select company</option>
                      {companyOptions.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={row.category}
                      onChange={(event) =>
                        updateRow(row.id, { category: event.target.value as DocumentCategoryValue })
                      }
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-300 focus:outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="rounded-md border border-gray-200 p-2 text-gray-500 hover:border-red-200 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || validRows.length === 0}
          className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          {isSaving ? 'Saving...' : `Save ${validRows.length} ${validRows.length === 1 ? 'document' : 'documents'}`}
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard/documents')}
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
