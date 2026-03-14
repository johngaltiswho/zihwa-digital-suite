import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@repo/db'
import { getActiveScope } from '@/lib/active-scope'
import { requireCompanyPermission, requireOrgAccess, requireUser } from '@/lib/authz'

type ProcessingStatus = 'UPLOADED' | 'PROCESSING' | 'EXTRACTED' | 'POSTED' | 'FAILED'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const auth = await requireUser()
    if (!('user' in auth)) return auth.error

    const scope = await getActiveScope()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get('status') as ProcessingStatus | null
    const orgId = searchParams.get('orgId')
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const where: Record<string, unknown> = {}

    if (scope.companyId) {
      const companyAuth = await requireCompanyPermission(scope.companyId, 'company.read')
      if (!('user' in companyAuth)) return companyAuth.error
      where.companyId = scope.companyId
    } else if (scope.organizationId) {
      const orgAuth = await requireOrgAccess(scope.organizationId)
      if (!('user' in orgAuth)) return orgAuth.error
      where.organizationId = scope.organizationId
    } else {
      return NextResponse.json(
        { success: false, error: 'Select an active organization/company first.' },
        { status: 400 }
      )
    }

    if (status) where.status = status
    if (orgId) where.zohoOrgId = orgId

    const [documents, total] = await Promise.all([
      prisma.processedDocument.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.processedDocument.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        documents: documents.map((doc) => ({
          id: doc.id,
          fileName: doc.fileName,
          fileUrl: doc.fileUrl,
          fileType: doc.fileType,
          documentType: doc.documentType,
          status: doc.status,
          extractedData: doc.extractedData,
          postingResult: doc.postingResult,
          zohoVoucherId: doc.zohoVoucherId,
          zohoOrgId: doc.zohoOrgId,
          organizationId: doc.organizationId,
          companyId: doc.companyId,
          error: doc.error,
          createdAt: doc.createdAt,
          processedAt: doc.processedAt,
        })),
        total,
        limit,
        offset,
      },
    })
  } catch (error: any) {
    console.error('List documents error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
