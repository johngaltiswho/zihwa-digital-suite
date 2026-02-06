import { NextRequest, NextResponse } from 'next/server'
import { getDocument, updateDocument } from '@repo/db'
import type { ProcessingStatus } from '@prisma/client'

type DocumentRouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: NextRequest,
  context: DocumentRouteContext
) {
  const { id } = await context.params
  try {
    const document = await getDocument(id)

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      )
    }

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

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Update document error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update document' },
      { status: 500 }
    )
  }
}
