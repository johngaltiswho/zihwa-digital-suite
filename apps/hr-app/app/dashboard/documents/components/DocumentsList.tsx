'use client'

import { MoreHorizontal, Download, ExternalLink } from 'lucide-react'
import { fileUtils } from '@/lib/supabase'

interface Document {
  id: string
  name: string
  description?: string | null
  category: string
  fileUrl: string
  fileName: string
  fileSize: number
  mimeType: string
  createdAt: string
  company: {
    id: string
    name: string
  }
}

interface DocumentsListProps {
  documents: Document[]
}

export default function DocumentsList({ documents }: DocumentsListProps) {
  const handleDownload = (document: Document) => {
    window.open(document.fileUrl, '_blank')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      'KYC': 'KYC',
      'CERTIFICATE': 'Certificate',
      'FINANCIAL_STATEMENT': 'Financial Statement',
      'EMPLOYEE_RECORD': 'Employee Record',
      'COMPLIANCE_DOC': 'Compliance Document',
      'CONTRACT': 'Contract',
      'OTHER': 'Other'
    }
    return categories[category] || category
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <div 
          key={document.id}
          className="group p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">
                    {fileUtils.getFileIcon(document.mimeType)}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {document.name}
                    </h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                      {getCategoryLabel(document.category)}
                    </span>
                  </div>
                  
                  {document.description && (
                    <p className="text-sm text-gray-500 truncate mb-1">
                      {document.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{document.company.name}</span>
                    <span>{fileUtils.formatFileSize(document.fileSize)}</span>
                    <span>{formatDate(document.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownload(document)}
                className="opacity-0 group-hover:opacity-100 p-2 rounded hover:bg-gray-200 transition-all"
                title="Download"
              >
                <Download className="w-4 h-4 text-gray-500" />
              </button>
              
              <button
                onClick={() => window.open(document.fileUrl, '_blank')}
                className="opacity-0 group-hover:opacity-100 p-2 rounded hover:bg-gray-200 transition-all"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </button>
              
              <button className="opacity-0 group-hover:opacity-100 p-2 rounded hover:bg-gray-200 transition-all">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}