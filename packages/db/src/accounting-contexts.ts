import type { AccountingContext, ContextStatus } from '@prisma/client'
import { prisma } from './client'

export type CreateAccountingContextInput = {
  companyId: string
  context: Record<string, unknown>
  createdBy?: string
  notes?: string | null
  status?: ContextStatus
}

export async function createAccountingContext(
  input: CreateAccountingContextInput
): Promise<AccountingContext> {
  return prisma.accountingContext.create({
    data: {
      companyId: input.companyId,
      context: input.context,
      createdBy: input.createdBy,
      notes: input.notes ?? null,
      status: input.status ?? 'DRAFT',
    },
  })
}

export async function listAccountingContexts(companyId: string) {
  return prisma.accountingContext.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getActiveAccountingContext(companyId: string) {
  return prisma.accountingContext.findFirst({
    where: {
      companyId,
      status: 'ACTIVE',
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function activateAccountingContext(id: string) {
  return prisma.accountingContext.update({
    where: { id },
    data: {
      status: 'ACTIVE',
      activatedAt: new Date(),
    },
  })
}
