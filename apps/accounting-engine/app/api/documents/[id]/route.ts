import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createLearningSignal, prisma, updateDocument } from '@repo/db'
import { requireDocumentPermission } from '@/lib/authz'
import { diffObjects } from '@/lib/learning/diff'

type ProcessingStatus = 'UPLOADED' | 'PROCESSING' | 'EXTRACTED' | 'POSTED' | 'FAILED'

type DocumentRouteContext = {
  params: Promise<{
    id: string
  }>
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function getStoragePathFromPublicUrl(fileUrl: string): string | null {
  const marker = '/storage/v1/object/public/accounting-documents/'
  const idx = fileUrl.indexOf(marker)
  if (idx === -1) return null
  const rawPath = fileUrl.slice(idx + marker.length)
  return rawPath ? decodeURIComponent(rawPath) : null
}

export async function GET(
  _request: NextRequest,
  context: DocumentRouteContext
) {
  const { id } = await context.params

  try {
    const auth = await requireDocumentPermission(id, 'company.read')
    if (!('user' in auth)) return auth.error

    const scoped = auth as {
      document: {
        id: string
        fileName: string
        fileUrl: string
        fileType: string
        documentType: string
        status: string
        extractedData: unknown
        postingResult: unknown
        zohoVoucherId: string | null
        zohoOrgId: string | null
        organizationId: string | null
        companyId: string | null
        error: string | null
        createdAt: Date
        processedAt: Date | null
      }
    }
    const document = scoped.document

    return NextResponse.json({
      success: true,
      data: {
        id: document.id,
        fileName: document.fileName,
        fileUrl: document.fileUrl,
        fileType: document.fileType,
        documentType: document.documentType,
        status: document.status,
        extractedData: document.extractedData,
        postingResult: document.postingResult,
        zohoVoucherId: document.zohoVoucherId,
        zohoOrgId: document.zohoOrgId,
        organizationId: document.organizationId,
        companyId: document.companyId,
        error: document.error,
        createdAt: document.createdAt,
        processedAt: document.processedAt,
      },
    })
  } catch (error: any) {
    console.error('Get document error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  context: DocumentRouteContext
) {
  const { id } = await context.params

  try {
    const auth = await requireDocumentPermission(id, 'draft.create')
    if (!('user' in auth)) return auth.error
    const scoped = auth as {
      user: { id: string }
      document: {
        id: string
        organizationId: string | null
        companyId: string | null
        extractedData: unknown
      }
      company?: { organizationId: string }
      organization?: { id: string }
    }

    const body = await request.json()
    const updates: {
      extractedData?: Record<string, unknown>
      status?: ProcessingStatus
    } = {}

    if (body.extractedData) {
      updates.extractedData = body.extractedData
    }

    if (body.status) {
      const allowed: ProcessingStatus[] = [
        'UPLOADED',
        'PROCESSING',
        'EXTRACTED',
        'POSTED',
        'FAILED',
      ]
      if (!allowed.includes(body.status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid status value' },
          { status: 400 }
        )
      }
      updates.status = body.status
    }

    if (!updates.extractedData && !updates.status) {
      return NextResponse.json(
        { success: false, error: 'No updates provided' },
        { status: 400 }
      )
    }

    await updateDocument(id, updates)

    if (updates.extractedData) {
      const before = (scoped.document.extractedData as Record<string, unknown> | null) ?? {}
      const after = updates.extractedData
      const diff = diffObjects(before, after)

      if (diff.changed) {
        await createLearningSignal({
          organizationId:
            scoped.document.organizationId ?? scoped.company?.organizationId ?? scoped.organization?.id ?? '',
          companyId: scoped.document.companyId,
          documentId: scoped.document.id,
          eventType: 'manual_edit',
          payload: {
            changes: diff.changes,
          },
          createdBy: scoped.user.id,
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Update document error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update document' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  context: DocumentRouteContext
) {
  const { id } = await context.params

  try {
    const auth = await requireDocumentPermission(id, 'draft.create')
    if (!('user' in auth)) return auth.error

    const scoped = auth as {
      document: {
        id: string
        status: string
        fileUrl: string
      }
    }

    if (scoped.document.status === 'POSTED') {
      return NextResponse.json(
        {
          success: false,
          error: 'Posted documents cannot be deleted.',
        },
        { status: 409 }
      )
    }

    const storagePath = getStoragePathFromPublicUrl(scoped.document.fileUrl)
    if (storagePath) {
      // Best-effort cleanup in Supabase storage.
      await supabase.storage.from('accounting-documents').remove([storagePath])
    }

    await prisma.processedDocument.delete({
      where: { id: scoped.document.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete document error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete document' },
      { status: 500 }
    )
  }
}
