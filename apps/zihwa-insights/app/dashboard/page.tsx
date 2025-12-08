import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Building2, Calendar, FileText, Users, Plus } from 'lucide-react'

export default async function Dashboard() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // Get basic stats for dashboard
  const stats = {
    totalCompanies: 0,
    upcomingDeadlines: 0,
    totalDocuments: 0,
    totalEmployees: 0
  }

  try {
    stats.totalCompanies = await prisma.company.count()
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    stats.upcomingDeadlines = await prisma.complianceDeadline.count({
      where: {
        dueDate: {
          gte: now,
          lte: thirtyDaysFromNow, // Next 30 days
        },
        status: 'PENDING'
      }
    })
    stats.totalDocuments = await prisma.document.count()
    stats.totalEmployees = await prisma.employee.count()
  } catch (error) {
    console.log('Database not yet connected:', error)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Home</h1>
        <p className="text-gray-500 text-sm">Welcome back to your workspace</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-600">Companies</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900">{stats.totalCompanies}</div>
        </div>
        
        <div className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-orange-500" />
            <span className="text-sm text-gray-600">Due Soon</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900">{stats.upcomingDeadlines}</div>
        </div>
        
        <div className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-600">Documents</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900">{stats.totalDocuments}</div>
        </div>
        
        <div className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-purple-500" />
            <span className="text-sm text-gray-600">Employees</span>
          </div>
          <div className="text-2xl font-semibold text-gray-900">{stats.totalEmployees}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Quick actions</h2>
        <div className="grid gap-3">
          <a
            href="/dashboard/companies?action=add"
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
          >
            <div className="p-2 rounded-md bg-blue-50 group-hover:bg-blue-100 transition-colors">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Add new company</div>
              <div className="text-sm text-gray-500">Register a new client company</div>
            </div>
            <Plus className="h-4 w-4 text-gray-400" />
          </a>
          
          <a
            href="/dashboard/deadlines?action=add"
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
          >
            <div className="p-2 rounded-md bg-orange-50 group-hover:bg-orange-100 transition-colors">
              <Calendar className="h-4 w-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Set compliance deadline</div>
              <div className="text-sm text-gray-500">Track important compliance dates</div>
            </div>
            <Plus className="h-4 w-4 text-gray-400" />
          </a>
          
          <a
            href="/dashboard/documents?action=upload"
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
          >
            <div className="p-2 rounded-md bg-green-50 group-hover:bg-green-100 transition-colors">
              <FileText className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Upload document</div>
              <div className="text-sm text-gray-500">Store important company files</div>
            </div>
            <Plus className="h-4 w-4 text-gray-400" />
          </a>
        </div>
      </div>
    </div>
  )
}
