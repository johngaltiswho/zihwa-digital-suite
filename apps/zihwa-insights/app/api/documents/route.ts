import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

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
})

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
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
      whereClause.category = category
    }

    const documents = await prisma.document.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
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
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate the request body
    const validationResult = documentSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Verify that the company exists and user has access
    const company = await prisma.company.findUnique({
      where: { id: data.companyId }
    })

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Create the document
    const document = await prisma.document.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        companyId: data.companyId,
        uploadedById: userId, // You might need to add this field to your schema
      },
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

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
    const { userId } = await auth()
    
    if (!userId) {
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
