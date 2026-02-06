'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type ProcessingStatus = 'UPLOADED' | 'PROCESSING' | 'EXTRACTED' | 'POSTED' | 'FAILED'

type DocumentRow = {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  documentType: string
  status: ProcessingStatus
  createdAt: string
  processedAt?: string | null
  extractedData?: {
    type: string
    confidence?: number
    data?: {
      amount?: number
      currency?: string
      merchant?: string
      vendorName?: string
      billNumber?: string
      date?: string
    }
  }
}

const STATUS_OPTIONS: ProcessingStatus[] = [
  'UPLOADED',
  'PROCESSING',
  'EXTRACTED',
  'POSTED',
  'FAILED',
]

const STATUS_STYLES: Record<string, string> = {
  UPLOADED: 'bg-gray-100 text-gray-700 border border-gray-200',
  PROCESSING: 'bg-blue-50 text-blue-700 border border-blue-100',
  EXTRACTED: 'bg-amber-50 text-amber-700 border border-amber-100',
  POSTED: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  FAILED: 'bg-rose-50 text-rose-700 border border-rose-100',
}

const confidenceCopy = (value?: number) => {
  if (value === undefined)
    return { label: 'Waiting', tone: 'bg-gray-50 text-gray-600 border border-gray-200' }
  if (value >= 85)
    return { label: 'Confident', tone: 'bg-emerald-50 text-emerald-700 border border-emerald-100' }
  if (value >= 65)
    return { label: 'Needs glance', tone: 'bg-amber-50 text-amber-700 border border-amber-100' }
  return { label: 'Flagged', tone: 'bg-rose-50 text-rose-700 border border-rose-100' }
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'ALL' | ProcessingStatus>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchDocuments = async () => {
    try {
      const params = new URLSearchParams({ limit: '200' })
      if (statusFilter !== 'ALL') {
        params.set('status', statusFilter)
      }

      const response = await fetch(`/api/documents?${params.toString()}`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load documents')
      }

      setDocuments(data.data.documents)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchDocuments()
  }, [statusFilter])

  const filteredDocuments = useMemo(() => {
    if (!searchTerm.trim()) return documents
    const query = searchTerm.toLowerCase()
    return documents.filter((doc) => {
      const merchant =
        doc.extractedData?.data?.merchant || doc.extractedData?.data?.vendorName
      return (
        doc.fileName.toLowerCase().includes(query) ||
        (merchant && merchant.toLowerCase().includes(query)) ||
        (doc.extractedData?.data?.billNumber || '').toLowerCase().includes(query)
      )
    })
  }, [documents, searchTerm])

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-700">Step 2 · Review</p>
            <h1 className="text-3xl font-semibold text-gray-900">Review desk</h1>
            <p className="text-gray-600 mt-1 max-w-2xl">
              The AI accountant already prepared the entry. You only confirm — and we highlight where attention is needed.
            </p>
          </div>
          <Link
            href="/upload"
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Upload more bills
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Filter by status</p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  statusFilter === 'ALL'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'text-gray-600 border-gray-200'
                }`}
              >
                All
              </button>
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    statusFilter === status
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'text-gray-600 border-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2 w-full md:max-w-xs">
            <p className="text-sm font-semibold text-gray-700">Search</p>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Bill number, vendor, amount…"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <p className="p-6 text-gray-500 text-sm">Fetching documents…</p>
          ) : error ? (
            <p className="p-6 text-rose-500 text-sm">{error}</p>
          ) : filteredDocuments.length === 0 ? (
            <p className="p-6 text-gray-500 text-sm">Nothing matches that filter.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                  <tr>
                    <th className="py-3 px-4">File</th>
                    <th className="py-3 px-4">AI suggestion</th>
                    <th className="py-3 px-4">Confidence</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDocuments.map((doc) => {
                    const partyName =
                      doc.extractedData?.data?.vendorName ||
                      doc.extractedData?.data?.merchant ||
                      '—'
                    const amount = doc.extractedData?.data?.amount
                    const currency = doc.extractedData?.data?.currency
                    const confidence = confidenceCopy(doc.extractedData?.confidence)
                    const needsAttention =
                      doc.status === 'EXTRACTED' && (doc.extractedData?.confidence || 0) < 85
                    return (
                      <tr key={doc.id} className={needsAttention ? 'bg-amber-50/50' : ''}>
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900">{doc.fileName}</p>
                          <p className="text-xs text-gray-500">{doc.fileType}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">{partyName}</p>
                            <p className="text-xs text-gray-600">
                              {amount
                                ? `${currency || 'INR'} ${(amount / 1).toLocaleString()}`
                                : 'Amount pending'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {doc.extractedData?.data?.billNumber
                                ? `Bill #${doc.extractedData?.data?.billNumber}`
                                : 'Bill number missing'}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${confidence.tone}`}
                          >
                            {confidence.label}
                            {doc.extractedData?.confidence ? `${doc.extractedData.confidence}%` : ''}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${STATUS_STYLES[doc.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs text-gray-500">
                          <p>{new Date(doc.createdAt).toLocaleString()}</p>
                          {doc.processedAt && (
                            <p className="text-[11px] text-gray-400">
                              Processed {new Date(doc.processedAt).toLocaleString()}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Link
                            href={`/documents/${doc.id}`}
                            className="font-semibold text-sky-700 hover:underline"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
