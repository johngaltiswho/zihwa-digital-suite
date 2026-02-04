'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

type LineItem = {
  description?: string
  quantity?: number
  rate?: number
  amount?: number
}

type ExtractedPayload = {
  type: string
  confidence?: number
  data: {
    merchant?: string
    vendorName?: string
    amount?: number
    currency?: string
    date?: string
    billNumber?: string
    description?: string
    taxAmount?: number
    lineItems?: LineItem[]
  }
}

type DocumentDetail = {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  documentType: string
  status: string
  extractedData?: ExtractedPayload
  createdAt: string
  processedAt?: string | null
  error?: string | null
}

const STATUS_STYLES: Record<string, string> = {
  UPLOADED: 'bg-gray-100 text-gray-700 border border-gray-200',
  PROCESSING: 'bg-blue-50 text-blue-700 border border-blue-100',
  EXTRACTED: 'bg-amber-50 text-amber-700 border border-amber-100',
  POSTED: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  FAILED: 'bg-rose-50 text-rose-700 border border-rose-100',
}

const confidenceMeta = (value?: number) => {
  if (value === undefined) {
    return {
      label: 'Confidence unavailable',
      tone: 'bg-gray-50 text-gray-500 border border-gray-200',
      message: 'Document uploaded recently. AI is still reading the contents.',
    }
  }
  if (value >= 85) {
    return {
      label: 'Ready to post',
      tone: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      message: 'AI checked GST, ledger and narration. Just confirm to post.',
    }
  }
  if (value >= 65) {
    return {
      label: 'Needs your glance',
      tone: 'bg-amber-50 text-amber-700 border border-amber-100',
      message: 'One or two fields looked unusual. Review the highlighted sections.',
    }
  }
  return {
    label: 'Flagged for review',
    tone: 'bg-rose-50 text-rose-700 border border-rose-100',
    message: 'Totals or GST look risky. Please correct before posting.',
  }
}

const formatDateInput = (value?: string) => {
  if (!value) return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value.split('T')[0] ?? value
  return parsed.toISOString().split('T')[0]
}

export default function DocumentDetailPage() {
  const params = useParams()
  const documentId = useMemo(() => {
    const raw = params?.id
    if (typeof raw === 'string') return raw
    if (Array.isArray(raw)) return raw[0]
    return ''
  }, [params])

  const [document, setDocument] = useState<DocumentDetail | null>(null)
  const [formData, setFormData] = useState<ExtractedPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [posting, setPosting] = useState(false)
  const [postResult, setPostResult] = useState<{ success: boolean; message: string } | null>(null)
  const [orgId, setOrgId] = useState('default-org')
  const [accountId, setAccountId] = useState('')
  const [vendorId, setVendorId] = useState('')

  const fetchDocument = async () => {
    if (!documentId) return
    try {
      const response = await fetch(`/api/documents/${documentId}`)
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load document')
      }
      setDocument(data.data)
      const extracted = data.data.extractedData
      const normalizedExtracted =
        extracted &&
        typeof extracted === 'object' &&
        'data' in (extracted as Record<string, unknown>)
          ? (extracted as ExtractedPayload)
          : extracted
            ? ({
                type: (data.data.documentType || 'expense').toLowerCase(),
                data: extracted as ExtractedPayload['data'],
              } as ExtractedPayload)
            : null
      setFormData(normalizedExtracted)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load document')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocument()
  }, [documentId])

  const updateField = (field: keyof ExtractedPayload['data'], value: string | number) => {
    setFormData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        data: {
          ...prev.data,
          [field]: value,
        },
      }
    })
  }

  const updateLineItem = (index: number, field: keyof LineItem, value: string) => {
    setFormData((prev) => {
      if (!prev) return prev
      const lineItems = [...(prev.data.lineItems || [])]
      const parsedValue = field === 'description' ? value : Number(value)
      lineItems[index] = {
        ...lineItems[index],
        [field]: parsedValue,
      }
      return {
        ...prev,
        data: {
          ...prev.data,
          lineItems,
        },
      }
    })
  }

  const addLineItem = () => {
    setFormData((prev) => {
      if (!prev) return prev
      const lineItems = [...(prev.data.lineItems || [])]
      lineItems.push({ description: '', quantity: 1, rate: 0, amount: 0 })
      return {
        ...prev,
        data: { ...prev.data, lineItems },
      }
    })
  }

  const removeLineItem = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev
      const lineItems = (prev.data.lineItems || []).filter((_, idx) => idx !== index)
      return {
        ...prev,
        data: { ...prev.data, lineItems },
      }
    })
  }

  const handleSave = async () => {
    if (!documentId || !formData) return false
    setSaving(true)
    setSaveMessage(null)
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ extractedData: formData }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save changes')
      }
      setDocument((prev) => (prev ? { ...prev, extractedData: formData } : prev))
      setSaveMessage('Changes saved successfully.')
      return true
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : 'Failed to save')
      return false
    } finally {
      setSaving(false)
    }
  }

  const handlePost = async () => {
    setPostResult(null)
    const saved = await handleSave()
    if (!saved) return

    if (!orgId) {
      setPostResult({ success: false, message: 'Organization ID is required.' })
      return
    }

    if (document?.documentType === 'EXPENSE' && !accountId) {
      setPostResult({ success: false, message: 'Account ID is required for expenses.' })
      return
    }

    if (document?.documentType === 'PURCHASE' && !vendorId) {
      setPostResult({ success: false, message: 'Vendor ID is required for purchases.' })
      return
    }

    setPosting(true)
    try {
      const body: Record<string, string> = { orgId }
      if (accountId) body.accountId = accountId
      if (vendorId) body.vendorId = vendorId

      const response = await fetch(`/api/documents/${documentId}/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to post document')
      }
      setPostResult({ success: true, message: 'Posted to Zoho successfully.' })
      fetchDocument()
    } catch (err) {
      setPostResult({
        success: false,
        message: err instanceof Error ? err.message : 'Failed to post document',
      })
    } finally {
      setPosting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-gray-500">
        Loading document…
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-gray-600">
        <p>{error || 'Document not found.'}</p>
        <Link href="/documents" className="mt-4 text-sky-700 hover:underline">
          Back to documents
        </Link>
      </div>
    )
  }

  const isPurchase = document.documentType === 'PURCHASE'
  const lineItems = formData?.data?.lineItems || []
  const confidence = confidenceMeta(formData?.confidence)

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/documents" className="text-sm text-sky-700 hover:underline">
          ← Back to documents
        </Link>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-sky-700">Step 3 · Approve</p>
          <h1 className="text-3xl font-semibold text-gray-900">Approve & Post</h1>
          <p className="text-gray-600">
            The AI accountant already filled in the entry. Adjust anything that looks off, then approve with one confident click.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm text-gray-500">File</p>
                  <p className="font-semibold text-gray-900">{document.fileName}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full border ${STATUS_STYLES[document.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}
                >
                  {document.status}
                </span>
              </div>
              <div className="grid gap-3 text-sm text-gray-600 md:grid-cols-2">
                <div>
                  <p className="font-medium text-gray-500">Created</p>
                  <p>{new Date(document.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Processed</p>
                  <p>{document.processedAt ? new Date(document.processedAt).toLocaleString() : '—'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Document type</p>
                  <p className="capitalize">{document.documentType.toLowerCase()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Confidence</p>
                  <span className={`inline-flex mt-1 text-xs font-semibold px-2 py-1 rounded-full border ${confidence.tone}`}>
                    {confidence.label}
                  </span>
                </div>
              </div>
              <a
                href={document.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-700 hover:underline text-sm font-medium"
              >
                Download original
              </a>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    AI suggestion
                  </p>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {isPurchase ? 'Will post as Purchase Bill' : 'Will post as Expense'}
                  </h2>
                </div>
                <button
                  className="text-sm text-sky-700 hover:underline"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">{confidence.message}</p>

              {saveMessage && (
                <p className={`text-sm mt-3 ${saveMessage.includes('success') ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {saveMessage}
                </p>
              )}

              {formData ? (
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      {isPurchase ? 'Vendor name' : 'Merchant'}
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
                      value={
                        isPurchase
                          ? formData.data?.vendorName || ''
                          : formData.data?.merchant || ''
                      }
                      onChange={(event) =>
                        updateField(isPurchase ? 'vendorName' : 'merchant', event.target.value)
                      }
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Amount</label>
                      <input
                        type="number"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
                        value={formData.data?.amount ?? ''}
                        onChange={(event) => updateField('amount', Number(event.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Currency</label>
                      <input
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
                        value={formData.data?.currency || ''}
                        onChange={(event) => updateField('currency', event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Date</label>
                      <input
                        type="date"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
                        value={formatDateInput(formData.data?.date)}
                        onChange={(event) => updateField('date', event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        {isPurchase ? 'Bill number' : 'Reference'}
                      </label>
                      <input
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
                        value={formData.data?.billNumber || ''}
                        onChange={(event) => updateField('billNumber', event.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Description</label>
                    <textarea
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
                      rows={3}
                      value={formData.data?.description || ''}
                      onChange={(event) => updateField('description', event.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-gray-700 font-medium">Line items</label>
                      <button
                        type="button"
                        onClick={addLineItem}
                        className="text-sm text-sky-700 hover:underline"
                      >
                        Add line
                      </button>
                    </div>
                    {lineItems.length === 0 ? (
                      <p className="text-xs text-gray-500">No line items detected.</p>
                    ) : (
                      <div className="space-y-3">
                        {lineItems.map((item, index) => (
                          <div
                            key={index}
                            className="rounded-xl border border-gray-100 bg-gray-50 p-3 grid gap-3 text-xs md:grid-cols-2"
                          >
                            <div className="md:col-span-2">
                              <label className="block text-gray-600 mb-1">Description</label>
                              <input
                                className="w-full rounded border border-gray-200 px-2 py-1 text-gray-900 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                                value={item.description || ''}
                                onChange={(event) => updateLineItem(index, 'description', event.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">Quantity</label>
                              <input
                                type="number"
                                className="w-full rounded border border-gray-200 px-2 py-1 text-gray-900 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                                value={item.quantity ?? ''}
                                onChange={(event) => updateLineItem(index, 'quantity', event.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">Rate</label>
                              <input
                                type="number"
                                className="w-full rounded border border-gray-200 px-2 py-1 text-gray-900 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                                value={item.rate ?? ''}
                                onChange={(event) => updateLineItem(index, 'rate', event.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">Amount</label>
                              <input
                                type="number"
                                className="w-full rounded border border-gray-200 px-2 py-1 text-gray-900 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                                value={item.amount ?? ''}
                                onChange={(event) => updateLineItem(index, 'amount', event.target.value)}
                              />
                            </div>
                            <div className="flex items-center justify-end">
                              <button
                                type="button"
                                onClick={() => removeLineItem(index)}
                                className="text-rose-600 hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No extracted data available for this document.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Original document</h2>
              <p className="text-xs text-gray-500 mb-3">
                Keep the preview open while you confirm.
              </p>
              {document.fileType.includes('pdf') ? (
                <object
                  data={document.fileUrl}
                  type="application/pdf"
                  className="w-full h-[420px] border border-gray-200 rounded"
                >
                  <p className="text-sm text-gray-500">
                    PDF preview unavailable.{' '}
                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-700 hover:underline"
                    >
                      Download file
                    </a>
                    .
                  </p>
                </object>
              ) : (
                <img
                  src={document.fileUrl}
                  alt={document.fileName}
                  className="w-full max-h-[420px] object-contain border border-gray-200 rounded"
                />
              )}
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Post to Zoho Books</h2>
              <p className="text-sm text-gray-600">
                We’ll handle narration, taxes and attachments. You only choose where it lands.
              </p>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Organization ID</label>
                  <input
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
                    value={orgId}
                    onChange={(event) => setOrgId(event.target.value)}
                  />
                </div>

                {!isPurchase && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Account ID (expense ledger)</label>
                    <input
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
                      value={accountId}
                      onChange={(event) => setAccountId(event.target.value)}
                      placeholder="Fuel Expense, Vehicle Costs…"
                    />
                  </div>
                )}

                {isPurchase && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Vendor ID</label>
                    <input
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
                      value={vendorId}
                      onChange={(event) => setVendorId(event.target.value)}
                      placeholder="Zoho vendor reference"
                    />
                  </div>
                )}
              </div>

              {postResult && (
                <div
                  className={`text-sm rounded-lg px-3 py-2 border ${
                    postResult.success
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-rose-50 text-rose-700 border-rose-100'
                  }`}
                >
                  {postResult.message}
                </div>
              )}

              <button
                onClick={handlePost}
                disabled={posting}
                className="w-full rounded-lg bg-gray-900 py-2 px-4 text-sm font-semibold text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-500"
              >
                {posting ? 'Posting…' : 'Approve & post to Zoho'}
              </button>
              <p className="text-xs text-gray-500">
                We store the full AI audit trail. Your boss can always see what was suggested.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
