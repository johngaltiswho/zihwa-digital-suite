import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DocumentsList from './components/DocumentsList'
import DocumentUpload from './components/DocumentUpload'
import DocumentsFilter from './components/DocumentsFilter'
import { Plus, FileText } from 'lucide-react'

type DocumentWithCompany = {
  id: string
  name: string
  description: string | null
  category: string
  fileUrl: string
  fileName: string
  fileSize: number
  mimeType: string
  createdAt: Date
  company: {
    id: string
    name: string
  }
}

type CompanyOption = {
  id: string
  name: string
}

interface SearchParams {
  action?: string
  company?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function DocumentsPage({ searchParams }: PageProps) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const params = await searchParams
  const showUploadForm = params.action === 'upload'
  const selectedCompanyId = params.company

  // Get documents and companies
  let documents: DocumentWithCompany[] = []
  let companies: CompanyOption[] = []
  
  try {
    const [documentRecords, companyRecords] = await Promise.all([
      prisma.document.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: {
              id: true,
              name: true
            }
          }
        },
        where: selectedCompanyId ? { companyId: selectedCompanyId } : undefined
      }),
      prisma.company.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: 'asc' },
      }),
    ])

    documents = documentRecords.map((doc) => ({
      ...doc,
      createdAt: doc.createdAt.toISOString(),
    }))
    companies = companyRecords
  } catch (error) {
    console.log('Error fetching documents:', error)
  }

  if (showUploadForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <a 
            href="/dashboard/documents"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Documents
          </a>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Upload</span>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900">Upload documents</h1>
            <p className="text-gray-500 text-sm">Add new documents to your workspace</p>
          </div>
          <DocumentUpload companies={companies} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
          <p className="text-gray-500 text-sm">
            {documents.length} {documents.length === 1 ? 'document' : 'documents'}
            {selectedCompanyId && companies.find(c => c.id === selectedCompanyId) && (
              <span> for {companies.find(c => c.id === selectedCompanyId)?.name}</span>
            )}
          </p>
        </div>
        <a
          href="/dashboard/documents?action=upload"
          className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Upload
        </a>
      </div>

      {/* Filters */}
      <DocumentsFilter companies={companies} />

      {documents.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-8 h-8 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
          <p className="text-gray-500 mb-6 text-sm">
            {selectedCompanyId 
              ? 'No documents found for this company'
              : 'Upload your first document to get started'
            }
          </p>
          <a
            href="/dashboard/documents?action=upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Upload document
          </a>
        </div>
      ) : (
        <DocumentsList documents={documents} />
      )}
    </div>
  )
}
