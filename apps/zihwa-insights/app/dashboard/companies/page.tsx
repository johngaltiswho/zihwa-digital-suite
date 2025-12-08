import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CompanyForm from './components/CompanyForm'
import { Plus, Building2, Users, Calendar, FileText, MoreHorizontal } from 'lucide-react'

interface SearchParams {
  action?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function CompaniesPage({ searchParams }: PageProps) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const params = await searchParams
  const showAddForm = params.action === 'add'

  // Get companies for the current user
  let companies = []
  try {
    companies = await prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            employees: true,
            complianceDeadlines: true,
            documents: true
          }
        }
      }
    })
  } catch (error) {
    console.log('Error fetching companies:', error)
  }

  if (showAddForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <a 
            href="/dashboard/companies"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Companies
          </a>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">New company</span>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900">New company</h1>
            <p className="text-gray-500 text-sm">Add a new client company to your workspace</p>
          </div>
          <CompanyForm />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
          <p className="text-gray-500 text-sm">{companies.length} {companies.length === 1 ? 'company' : 'companies'}</p>
        </div>
        <a
          href="/dashboard/companies?action=add"
          className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New
        </a>
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-16">
          <Building2 className="w-8 h-8 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies yet</h3>
          <p className="text-gray-500 mb-6 text-sm">Get started by adding your first client company</p>
          <a
            href="/dashboard/companies?action=add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add company
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {companies.map((company) => (
            <div 
              key={company.id} 
              className="group p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{company.name}</h3>
                      {company.description && (
                        <p className="text-sm text-gray-500 truncate mt-0.5">{company.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3 ml-11">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      {company._count.employees}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {company._count.complianceDeadlines}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FileText className="w-3 h-3" />
                      {company._count.documents}
                    </div>
                  </div>
                </div>
                
                <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 transition-all">
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}