import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DocumentCategory, DocumentComplianceStatus, Prisma } from '@prisma/client'
import { z } from 'zod'
import { ensureDocumentTypes } from '@/lib/document-type-seed'
import { getRouteAuth } from '@/lib/auth'

// Validation schema for document data
const documentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  description: z.string().nullable().optional(),
  category: z.enum(['KYC', 'CERTIFICATE', 'FINANCIAL_STATEMENT', 'EMPLOYEE_RECORD', 'COMPLIANCE_DOC', 'CONTRACT', 'OTHER']),
  fileUrl: z.string().url('Invalid file URL'),
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().min(1, 'File size must be greater than 0'),
  mimeType: z.string().min(1, 'MIME type is required'),
  companyId: z.string().min(1, 'Company ID is required'),
  documentTypeId: z.string().optional(),
  requirementId: z.string().optional(),
  periodMonth: z.number().int().min(1).max(12).optional(),
  periodYear: z.number().int().min(2000).max(2100).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { user } = await getRouteAuth()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const category = searchParams.get('category')

    const whereClause: Prisma.DocumentWhereInput = {
      isActive: true,
    }

    if (companyId) {
      whereClause.companyId = companyId
    }

    if (category) {
      const allowedCategories: DocumentCategory[] = [
        'KYC',
        'CERTIFICATE',
        'FINANCIAL_STATEMENT',
        'EMPLOYEE_RECORD',
        'COMPLIANCE_DOC',
        'CONTRACT',
        'OTHER',
      ]
      if (allowedCategories.includes(category as DocumentCategory)) {
        whereClause.category = category as DocumentCategory
      }
    }

    await ensureDocumentTypes(prisma)

    const documents = await prisma.document.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
        },
        documentType: {
          select: {
            id: true,
            title: true,
            category: true,
            frequency: true,
          },
        },
        requirement: {
          select: {
            id: true,
            customTitle: true,
            documentTypeId: true,
          },
        }
      }
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await getRouteAuth()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate the request body
    const validationResult = documentSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Verify that the company exists and user has access
    const companyAccess = await prisma.companyAccess.findFirst({
      where: { 
        companyId: data.companyId,
        user: {
          authId: user.id
        }
      },
      include: {
        company: true
      }
    })

    if (!companyAccess) {
      return NextResponse.json(
        { error: 'Company not found or access denied' },
        { status: 404 }
      )
    }

    await ensureDocumentTypes(prisma)

    let requirementId = data.requirementId

    if (!requirementId && data.documentTypeId) {
      const existingRequirement = await prisma.companyDocumentRequirement.findFirst({
        where: {
          companyId: data.companyId,
          documentTypeId: data.documentTypeId,
        },
      })

      if (existingRequirement) {
        requirementId = existingRequirement.id
      } else {
        const createdRequirement = await prisma.companyDocumentRequirement.create({
          data: {
            companyId: data.companyId,
            documentTypeId: data.documentTypeId,
          },
        })
        requirementId = createdRequirement.id
      }
    }

    // Create the document
    const document = await prisma.document.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        documentTypeId: data.documentTypeId,
        requirementId,
        periodMonth: data.periodMonth,
        periodYear: data.periodYear,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        companyId: data.companyId,
        uploadedById: user.id,
        status: DocumentComplianceStatus.SUBMITTED,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
        },
        documentType: true,
        requirement: true,
      }
    })

    if (document.documentTypeId) {
      const normalizedMonth = data.periodMonth ?? 0
      const normalizedYear = data.periodYear ?? 0

      await prisma.companyDocumentStatus.upsert({
        where: {
          companyId_documentTypeId_periodMonth_periodYear: {
            companyId: data.companyId,
            documentTypeId: document.documentTypeId,
            periodMonth: normalizedMonth,
            periodYear: normalizedYear,
          },
        },
        update: {
          status: DocumentComplianceStatus.SUBMITTED,
          documentId: document.id,
          requirementId: requirementId!,
        },
        create: {
          companyId: data.companyId,
          documentTypeId: document.documentTypeId,
          requirementId: requirementId!,
          periodMonth: normalizedMonth,
          periodYear: normalizedYear,
          documentId: document.id,
          status: DocumentComplianceStatus.SUBMITTED,
        },
        include: {
          documentType: true,
        },
      })
    }

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user } = await getRouteAuth()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('id')

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    // Find the document
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Soft delete by setting isActive to false
    await prisma.document.update({
      where: { id: documentId },
      data: { isActive: false }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}
