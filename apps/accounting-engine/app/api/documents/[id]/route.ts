import { NextRequest, NextResponse } from 'next/server'
import { getDocument } from '@repo/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const document = await getDocument(params.id)

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
