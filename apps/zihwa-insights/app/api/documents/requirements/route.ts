import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { DocumentComplianceStatus } from '@prisma/client'
import { z } from 'zod'
import { ensureDocumentTypes } from '@/lib/document-type-seed'

const upsertStatusSchema = z.object({
  companyId: z.string().min(1),
  documentTypeId: z.string().min(1),
  customTitle: z.string().optional(),
  periodMonth: z.number().int().min(1).max(12).optional(),
  periodYear: z.number().int().min(2000).max(2100).optional(),
  dueDate: z.string().datetime().optional(),
  status: z.nativeEnum(DocumentComplianceStatus).optional(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 })
    }

    await ensureDocumentTypes(prisma)

    const requirements = await prisma.companyDocumentRequirement.findMany({
      where: { companyId },
      orderBy: { createdAt: 'asc' },
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
                fileName: true,
                createdAt: true,
                uploadedById: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: requirements })
  } catch (error) {
    console.error('Failed to fetch document requirements', error)
    return NextResponse.json({ error: 'Failed to fetch document requirements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await request.json()
    const result = upsertStatusSchema.safeParse(payload)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }

    const data = result.data

    await ensureDocumentTypes(prisma)

    const documentType = await prisma.documentType.findUnique({ where: { id: data.documentTypeId } })
    if (!documentType) {
      return NextResponse.json({ error: 'Document type not found' }, { status: 404 })
    }

    let requirement = await prisma.companyDocumentRequirement.findFirst({
      where: { companyId: data.companyId, documentTypeId: data.documentTypeId },
    })

    if (!requirement) {
      requirement = await prisma.companyDocumentRequirement.create({
        data: {
          companyId: data.companyId,
          documentTypeId: data.documentTypeId,
          customTitle: data.customTitle,
          notes: data.notes,
        },
        include: { documentType: true },
      })
    } else if (data.customTitle || data.notes) {
      requirement = await prisma.companyDocumentRequirement.update({
        where: { id: requirement.id },
        data: {
          customTitle: data.customTitle ?? requirement.customTitle,
          notes: data.notes ?? requirement.notes,
        },
        include: { documentType: true },
      })
    }

    const normalizedMonth = data.periodMonth ?? 0
    const normalizedYear = data.periodYear ?? 0

    const statusRow = await prisma.companyDocumentStatus.upsert({
      where: {
        companyId_documentTypeId_periodMonth_periodYear: {
          companyId: data.companyId,
          documentTypeId: data.documentTypeId,
          periodMonth: normalizedMonth,
          periodYear: normalizedYear,
        },
      },
      create: {
        companyId: data.companyId,
        documentTypeId: data.documentTypeId,
        requirementId: requirement.id,
        periodMonth: normalizedMonth,
        periodYear: normalizedYear,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        status: data.status ?? DocumentComplianceStatus.PENDING,
      },
      update: {
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        status: data.status ?? undefined,
        requirementId: requirement.id,
        periodMonth: normalizedMonth,
        periodYear: normalizedYear,
      },
      include: {
        document: true,
      },
    })

    return NextResponse.json({ success: true, data: { requirement, status: statusRow } })
  } catch (error) {
    console.error('Failed to upsert document requirement/status', error)
    return NextResponse.json({ error: 'Failed to upsert requirement/status' }, { status: 500 })
  }
}
