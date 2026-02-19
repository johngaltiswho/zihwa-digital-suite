import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@repo/db'
import type { ProcessingStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const status = searchParams.get('status') as ProcessingStatus | null
    const orgId = searchParams.get('orgId')
    const organizationId = searchParams.get('organizationId')
    const companyId = searchParams.get('companyId')
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    // Build where clause
    const where: any = {}
    if (status) where.status = status
    if (orgId) where.zohoOrgId = orgId
    if (organizationId) where.organizationId = organizationId
    if (companyId) where.companyId = companyId

    // Fetch documents with filters
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
