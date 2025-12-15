import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DocumentsList from './components/DocumentsList'
import DocumentUpload from './components/DocumentUpload'
import DocumentsFilter from './components/DocumentsFilter'
import { Building2, Plus, FileText, Upload } from 'lucide-react'
import { ensureDocumentTypes } from '@/lib/document-type-seed'

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

type RequirementWithStatuses = Awaited<ReturnType<typeof prisma.companyDocumentRequirement.findMany>>[number]
type DocumentTypeSummary = Awaited<ReturnType<typeof prisma.documentType.findMany>>[number]

interface SearchParams {
  action?: string
  company?: string
  documentTypeId?: string
  period?: string
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
  const selectedDocumentTypeId = params.documentTypeId
  const selectedPeriod = params.period

  // Get documents and companies
  let documents: DocumentWithCompany[] = []
  let companies: CompanyOption[] = []
  let requirements: RequirementWithStatuses[] = []
  let documentTypes: DocumentTypeSummary[] = []
  
  try {
    await ensureDocumentTypes(prisma)

    const [documentRecords, companyRecords, documentTypeRecords] = await Promise.all([
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
      prisma.documentType.findMany({
        orderBy: [{ frequency: 'asc' }, { title: 'asc' }],
      }),
    ])

    documents = documentRecords.map((doc) => ({
      ...doc,
      createdAt: doc.createdAt.toISOString(),
    }))
    companies = companyRecords
    documentTypes = documentTypeRecords

    if (selectedCompanyId) {
      requirements = await prisma.companyDocumentRequirement.findMany({
        where: { companyId: selectedCompanyId },
        include: {
          documentType: true,
          statuses: {
            orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }, { createdAt: 'desc' }],
            include: {
              document: {
                select: {
                  id: true,
                  name: true,
                  fileUrl: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      })
    }
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
          <DocumentUpload
            companies={companies}
            documentTypes={documentTypes}
            defaultCompanyId={selectedCompanyId}
            defaultDocumentTypeId={selectedDocumentTypeId}
            defaultPeriod={selectedPeriod}
          />
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
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/companies"
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Building2 className="h-4 w-4 text-gray-500" />
            Companies
          </Link>
          <Link
            href="/dashboard/documents?action=upload"
            className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
            Upload
          </Link>
        </div>
      </div>

      {/* Filters */}
      <DocumentsFilter companies={companies} />

      {selectedCompanyId && (
        <CompanyDocumentChecklist
          companyId={selectedCompanyId}
          requirements={requirements}
        />
      )}

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

function CompanyDocumentChecklist({
  companyId,
  requirements,
}: {
  companyId: string
  requirements: RequirementWithStatuses[]
}) {
  if (requirements.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Compliance checklist</h2>
            <p className="text-sm text-gray-500">No structured requirements yet for this company.</p>
          </div>
          <a
            href={`/dashboard/documents?action=upload&company=${companyId}`}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Upload className="h-4 w-4" />
            Upload document
          </a>
        </div>
      </div>
    )
  }

  const formatPeriod = (periodYear?: number | null, periodMonth?: number | null) => {
    if (!periodYear || !periodMonth) return '—'
    return `${periodYear}-${String(periodMonth).padStart(2, '0')}`
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      PENDING: 'bg-amber-50 text-amber-700',
      SUBMITTED: 'bg-emerald-50 text-emerald-700',
      APPROVED: 'bg-blue-50 text-blue-700',
      EXPIRED: 'bg-rose-50 text-rose-700',
      NOT_REQUIRED: 'bg-gray-100 text-gray-600',
    }
    return map[status] || 'bg-gray-100 text-gray-600'
  }

  const getNextPeriod = (requirement: RequirementWithStatuses) => {
    if (!requirement.documentType.requiresPeriod) return undefined
    const pending = requirement.statuses.find((status) => status.status !== 'SUBMITTED')
    if (pending?.periodYear && pending?.periodMonth) {
      return `${pending.periodYear}-${String(pending.periodMonth).padStart(2, '0')}`
    }
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Compliance checklist</h2>
          <p className="text-sm text-gray-500">Track required documents and monthly compliance for this company.</p>
        </div>
        <a
          href={`/dashboard/documents?action=upload&company=${companyId}`}
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Upload className="h-4 w-4" />
          Upload document
        </a>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50/70 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Requirement</th>
              <th className="px-4 py-3 text-left">Frequency</th>
              <th className="px-4 py-3 text-left">Latest period</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {requirements.map((requirement) => {
              const latestStatus = requirement.statuses[0]
              const periodLabel = formatPeriod(latestStatus?.periodYear, latestStatus?.periodMonth)
              const uploadHref = `/dashboard/documents?action=upload&company=${companyId}&documentTypeId=${requirement.documentType.id}${
                requirement.documentType.requiresPeriod ? `&period=${getNextPeriod(requirement)}` : ''
              }`

              return (
                <tr key={requirement.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{requirement.customTitle || requirement.documentType.title}</div>
                    <p className="text-xs text-gray-500">{requirement.documentType.category.replace('_', ' ')}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{requirement.documentType.frequency.replace('_', ' ').toLowerCase()}</td>
                  <td className="px-4 py-3 text-gray-700">{periodLabel}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(latestStatus?.status || 'PENDING')}`}>
                      {latestStatus?.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a
                        className="rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        href={uploadHref}
                      >
                        Upload
                      </a>
                      {latestStatus?.document?.fileUrl && (
                        <a
                          href={latestStatus.document.fileUrl}
                          target="_blank"
                          className="text-xs font-medium text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
