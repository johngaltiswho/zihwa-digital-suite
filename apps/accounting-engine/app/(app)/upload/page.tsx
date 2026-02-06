'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'

type UploadStatus = 'pending' | 'uploading' | 'processing' | 'completed' | 'failed'

type UploadItem = {
  id: string
  fileName: string
  size: number
  status: UploadStatus
  error?: string
  documentId?: string
}

type DocumentEntry = {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  documentType: string
  status: string
  createdAt: string
  processedAt?: string | null
}

const QUEUE_STYLES: Record<UploadStatus, string> = {
  pending: 'bg-gray-50 text-gray-600 border border-gray-200',
  uploading: 'bg-blue-50 text-blue-700 border border-blue-100',
  processing: 'bg-sky-50 text-sky-700 border border-sky-100',
  completed: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  failed: 'bg-rose-50 text-rose-700 border border-rose-100',
}

const QUEUE_COPY: Record<UploadStatus, string> = {
  pending: 'Queued',
  uploading: 'Sending…',
  processing: 'AI reading',
  completed: 'Ready',
  failed: 'Needs retry',
}

const STATUS_STYLES: Record<string, string> = {
  UPLOADED: 'bg-gray-100 text-gray-700 border border-gray-200',
  PROCESSING: 'bg-blue-50 text-blue-700 border border-blue-100',
  EXTRACTED: 'bg-amber-50 text-amber-700 border border-amber-100',
  POSTED: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  FAILED: 'bg-rose-50 text-rose-700 border border-rose-100',
}

const generateId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [documents, setDocuments] = useState<DocumentEntry[]>([])
  const [documentsLoading, setDocumentsLoading] = useState(true)
  const [documentsError, setDocumentsError] = useState<string | null>(null)

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await fetch('/api/documents?limit=50')
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load documents')
      }

      setDocuments(data.data.documents)
      setDocumentsError(null)
    } catch (error) {
      setDocumentsError(
        error instanceof Error ? error.message : 'Failed to load documents'
      )
    } finally {
      setDocumentsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDocuments()
    const interval = setInterval(fetchDocuments, 5000)
    return () => clearInterval(interval)
  }, [fetchDocuments])

  useEffect(() => {
    setUploadQueue((prev) => {
      let hasChanges = false
      const next = prev.map((item) => {
        if (!item.documentId) return item
        const doc = documents.find((d) => d.id === item.documentId)
        if (!doc) return item

        if (
          (doc.status === 'EXTRACTED' || doc.status === 'POSTED') &&
          item.status !== 'completed'
        ) {
          hasChanges = true
          return { ...item, status: 'completed' }
        }

        if (doc.status === 'FAILED' && item.status !== 'failed') {
          hasChanges = true
          return { ...item, status: 'failed', error: doc.error || 'Processing failed' }
        }

        return item
      })

      return hasChanges ? next : prev
    })
  }, [documents])

  const handleSelectedFiles = (files: FileList | File[]) => {
    const incoming = Array.from(files)
    if (!incoming.length) return

    setSelectedFiles((prev) => {
      const signature = new Set(prev.map((file) => `${file.name}-${file.size}`))
      const filtered = incoming.filter(
        (file) => !signature.has(`${file.name}-${file.size}`)
      )
      return [...prev, ...filtered]
    })
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleSelectedFiles(event.target.files)
      event.target.value = ''
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer.files) {
      handleSelectedFiles(event.dataTransfer.files)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index))
  }

  const updateQueueItem = (queueId: string, updates: Partial<UploadItem>) => {
    setUploadQueue((prev) =>
      prev.map((item) => (item.id === queueId ? { ...item, ...updates } : item))
    )
  }

  const uploadSingleFile = async (queueId: string, file: File) => {
    updateQueueItem(queueId, { status: 'uploading', error: undefined })

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('orgId', 'default-org')

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      updateQueueItem(queueId, {
        status: 'processing',
        documentId: data.data.documentId,
      })
    } catch (error) {
      updateQueueItem(queueId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Upload failed',
      })
    }
  }

  const handleUpload = async () => {
    if (!selectedFiles.length) return

    setIsUploading(true)
    const filePayload = selectedFiles.map((file) => ({
      queueId: generateId(),
      file,
    }))

    setUploadQueue((prev) => [
      ...filePayload.map(({ queueId, file }) => ({
        id: queueId,
        fileName: file.name,
        size: file.size,
        status: 'pending' as UploadStatus,
      })),
      ...prev,
    ])

    for (const entry of filePayload) {
      await uploadSingleFile(entry.queueId, entry.file)
      await fetchDocuments()
    }

    setSelectedFiles([])
    setIsUploading(false)
  }

  const queueHasItems = uploadQueue.length > 0
  const documentsMessage = useMemo(() => {
    if (documentsLoading) return 'Collecting the latest documents…'
    if (documentsError) return documentsError
    if (!documents.length) return 'No documents yet. Upload to get started.'
    return null
  }, [documentsLoading, documentsError, documents.length])

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-sky-700">Step 1 · Capture</p>
          <h1 className="text-3xl font-semibold text-gray-900">
            Drop the bills. The AI accountant handles the rest.
          </h1>
          <p className="text-gray-600">
            PDFs, phone photos, WhatsApp screenshots — everything lands here first. We read it, classify it, and tell you the exact ledger and GST.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Capture queue
            </p>
            <h2 className="mt-2 text-xl font-semibold text-gray-900">Bring in today’s bills</h2>
            <p className="text-sm text-gray-600">
              Drop files anywhere, or click below. Limit 10MB each.
            </p>

            <div
              className="mt-6 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400 transition"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="block cursor-pointer">
                <p className="text-lg font-medium text-gray-900">
                  Drag & drop or tap to browse files
                </p>
                <p className="text-xs text-gray-500 mt-1">AI starts reading immediately.</p>
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    Ready to upload ({selectedFiles.length})
                  </p>
                  <button
                    className="text-sm text-rose-600 hover:underline"
                    onClick={() => setSelectedFiles([])}
                  >
                    Clear list
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-100">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${file.size}-${index}`}
                      className="flex items-center justify-between px-3 py-2 text-sm text-gray-700"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        className="text-rose-500 hover:text-rose-700"
                        onClick={() => removeSelectedFile(index)}
                        aria-label={`Remove ${file.name}`}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="mt-4 w-full rounded-lg bg-gray-900 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-500"
                >
                  {isUploading ? 'Uploading & reading…' : 'Upload & let AI read'}
                </button>
              </div>
            )}

            {!selectedFiles.length && (
              <button
                disabled
                className="mt-6 w-full rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-400 cursor-not-allowed"
              >
                Select files to begin
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Processing
                </p>
                <h2 className="text-xl font-semibold text-gray-900">AI queue</h2>
                <p className="text-sm text-gray-600">
                  Watch files move from upload → AI suggestion → ready to approve.
                </p>
              </div>
              <Link href="/documents" className="text-sm font-semibold text-sky-700 hover:underline">
                Go to review →
              </Link>
            </div>

            {queueHasItems ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {uploadQueue.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${QUEUE_STYLES[item.status]}`}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.fileName}</p>
                      <p className="text-xs">
                        {(item.size / 1024).toFixed(1)} KB · {item.error || 'Awaiting AI output'}
                      </p>
                    </div>
                    <span className="text-xs font-semibold">
                      {QUEUE_COPY[item.status]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Files you upload will appear here with the exact action the AI is taking on them.
              </p>
            )}

            <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              High confidence items go green and auto-post. Ambers need a glance. Reds are put on hold so you can request better bills.
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Step 2</p>
              <h2 className="text-xl font-semibold text-gray-900">Review desk preview</h2>
              <p className="text-sm text-gray-600">
                These are the latest documents waiting in your queue. Click “Review” to confirm and post.
              </p>
            </div>
            <Link href="/documents" className="text-sm font-semibold text-sky-700 hover:underline">
              View full list →
            </Link>
          </div>

          {documentsMessage ? (
            <p className="text-sm text-gray-500">{documentsMessage}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                  <tr>
                    <th className="py-3 px-4">Document</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4">Processed</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {documents.slice(0, 8).map((doc) => (
                    <tr key={doc.id}>
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{doc.fileName}</p>
                        <p className="text-xs text-gray-500">{doc.fileType}</p>
                      </td>
                      <td className="py-4 px-4 capitalize text-gray-600">
                        {doc.documentType.toLowerCase()}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[doc.status] || 'bg-gray-100 text-gray-600 border border-gray-200'}`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-500">
                        {new Date(doc.createdAt).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-500">
                        {doc.processedAt ? new Date(doc.processedAt).toLocaleString() : '—'}
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
