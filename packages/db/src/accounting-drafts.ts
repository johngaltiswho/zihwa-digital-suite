import type { DraftSource, DraftStatus } from '../prisma/generated/client'
import { prisma } from './client'

export type CreateAccountingDraftInput = {
  organizationId: string
  companyId: string
  createdBy: string
  payload: Record<string, unknown>
  source?: DraftSource
  documentId?: string | null
}

export async function createAccountingDraft(input: CreateAccountingDraftInput) {
  return prisma.accountingDraft.create({
    data: {
      organizationId: input.organizationId,
      companyId: input.companyId,
      createdBy: input.createdBy,
      payload: input.payload as any,
      source: input.source ?? 'MANUAL',
      documentId: input.documentId ?? null,
    },
  })
}

export async function getAccountingDraftById(id: string) {
  return prisma.accountingDraft.findUnique({
    where: { id },
  })
}

export async function listAccountingDrafts(companyId: string, status?: DraftStatus) {
  return prisma.accountingDraft.findMany({
    where: {
      companyId,
      status,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function updateAccountingDraft(
  id: string,
  data: {
    payload?: Record<string, unknown>
    validation?: Record<string, unknown>
    approvalMeta?: Record<string, unknown>
    zohoResult?: Record<string, unknown>
    status?: DraftStatus
    documentId?: string | null
    submittedAt?: Date | null
    approvedAt?: Date | null
    postedAt?: Date | null
    rejectedAt?: Date | null
  }
) {
  return prisma.accountingDraft.update({
    where: { id },
    data: data as any,
  })
}
