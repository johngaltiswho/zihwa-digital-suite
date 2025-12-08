'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SimpleFileUpload from '@/components/SimpleFileUpload'
import { Check } from 'lucide-react'

interface Company {
  id: string
  name: string
}

interface DocumentUploadProps {
  companies: Company[]
}

interface UploadedFile {
  name: string
  url: string
}

export default function DocumentUpload({ companies }: DocumentUploadProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('')
  const [category, setCategory] = useState<string>('OTHER')
  const [description, setDescription] = useState<string>('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const categories = [
    { value: 'KYC', label: 'KYC Documents' },
    { value: 'CERTIFICATE', label: 'Certificates' },
    { value: 'FINANCIAL_STATEMENT', label: 'Financial Statements' },
    { value: 'EMPLOYEE_RECORD', label: 'Employee Records' },
    { value: 'COMPLIANCE_DOC', label: 'Compliance Documents' },
    { value: 'CONTRACT', label: 'Contracts' },
    { value: 'OTHER', label: 'Other' }
  ]

  const handleFileUpload = (fileUrl: string, fileName: string) => {
    setUploadedFiles(prev => [...prev, { name: fileName, url: fileUrl }])
  }

  const handleSave = async () => {
    if (!selectedCompanyId || uploadedFiles.length === 0) {
      alert('Please select a company and upload at least one file')
      return
    }

    setIsLoading(true)

    try {
      // Save each uploaded file as a document record
      for (const file of uploadedFiles) {
        const response = await fetch('/api/documents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: file.name,
            description: description || null,
            category: category,
            fileUrl: file.url,
            fileName: file.name,
            fileSize: 0, // We don't track size in simple version
            mimeType: 'application/octet-stream', // Generic type
            companyId: selectedCompanyId,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to save document: ${file.name}`)
        }
      }

      router.push('/dashboard/documents')
      router.refresh()
    } catch (error) {
      console.error('Error saving documents:', error)
      alert('Failed to save documents. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/documents')
  }

  return (
    <div className="space-y-8">
      {/* Document Details */}
      <div className="space-y-6">
        <div>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="w-full px-0 py-3 text-gray-900 border-0 border-b border-gray-100 focus:border-gray-300 focus:outline-none focus:ring-0 bg-transparent text-sm"
          >
            <option value="">Select a company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-0 py-3 text-gray-900 border-0 border-b border-gray-100 focus:border-gray-300 focus:outline-none focus:ring-0 bg-transparent text-sm"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            rows={2}
            className="w-full px-0 py-3 text-gray-900 placeholder-gray-400 border-0 border-b border-gray-100 focus:border-gray-300 focus:outline-none focus:ring-0 bg-transparent text-sm resize-none"
          />
        </div>
      </div>

      {/* File Upload */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Upload files</h3>
        <SimpleFileUpload
          onUploadComplete={handleFileUpload}
          companyId={selectedCompanyId}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
        <button
          onClick={handleSave}
          disabled={isLoading || !selectedCompanyId || uploadedFiles.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Check className="w-4 h-4" />
          {isLoading ? 'Saving...' : `Save ${uploadedFiles.length} ${uploadedFiles.length === 1 ? 'document' : 'documents'}`}
        </button>
        <button
          onClick={handleCancel}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 text-sm font-medium rounded-md hover:text-gray-900 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}