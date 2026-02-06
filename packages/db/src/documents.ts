// Document tracking helpers

import { prisma } from './client'
import type { DocumentType, ProcessingStatus } from '@prisma/client'

export interface CreateDocumentInput {
  fileName: string
  fileUrl: string
  fileType: string
  documentType: DocumentType
  status?: ProcessingStatus
}

export interface UpdateDocumentInput {
  status?: ProcessingStatus
  documentType?: DocumentType
  extractedData?: Record<string, unknown>
  postingResult?: Record<string, unknown>
  zohoVoucherId?: string
  zohoOrgId?: string
  error?: string
  processedAt?: Date
}

/**
 * Create a new document record when a file is uploaded
 */
export async function createDocument(
  input: CreateDocumentInput
): Promise<string> {
  const document = await prisma.processedDocument.create({
    data: {
      ...input,
      status: input.status || 'UPLOADED',
    },
    select: { id: true },
  })

  return document.id
}

/**
 * Update document processing status and data
 */
export async function updateDocument(
  id: string,
  input: UpdateDocumentInput
): Promise<void> {
  await prisma.processedDocument.update({
    where: { id },
    data: {
      ...input,
      updatedAt: new Date(),
    },
  })
}

/**
 * Get document by ID
 */
export async function getDocument(id: string) {
  return prisma.processedDocument.findUnique({
    where: { id },
  })
}

/**
 * List recent documents
 */
export async function listDocuments(limit: number = 20) {
  return prisma.processedDocument.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

/**
 * Get documents by status
 */
export async function getDocumentsByStatus(status: ProcessingStatus) {
  return prisma.processedDocument.findMany({
    where: { status },
    orderBy: { createdAt: 'desc' },
  })
}
