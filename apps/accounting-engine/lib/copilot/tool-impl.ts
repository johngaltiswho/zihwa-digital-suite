import {
  createAccountingDraft,
  getAccountingDraftById,
  listAccountingDrafts,
  updateAccountingDraft,
  createLearningSignal,
  getDocument,
  getActiveAccountingContext,
  prisma,
} from '@repo/db'
import { AccountingContextSchema, DraftPayloadSchema } from '@repo/ledger-core'
import { getCompanyZohoConnection } from '../zoho/company-connection'
import { postExpense, postPurchase } from '@repo/connector-zoho-books'

export async function searchVendors(companyId: string, query: string) {
  const docs = await prisma.processedDocument.findMany({
    where: {
      companyId,
      extractedData: { not: undefined },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: { extractedData: true },
  })

  const hits = new Set<string>()
  for (const doc of docs) {
    const payload = doc.extractedData as any
    const vendor = payload?.data?.vendorName || payload?.data?.merchant
    if (typeof vendor === 'string' && vendor.toLowerCase().includes(query.toLowerCase())) {
      hits.add(vendor)
    }
  }

  return Array.from(hits).slice(0, 10)
}

export async function createExpenseDraft(input: {
  organizationId: string
  companyId: string
  userId: string
  payload: Record<string, unknown>
}) {
  const parsed = DraftPayloadSchema.parse(input.payload)

  return createAccountingDraft({
    organizationId: input.organizationId,
    companyId: input.companyId,
    createdBy: input.userId,
    payload: parsed as unknown as Record<string, unknown>,
    source: 'COPILOT',
  })
}

export async function attachDocumentToDraft(companyId: string, draftId: string, documentId: string) {
  const draft = await getAccountingDraftById(draftId)
  if (!draft || draft.companyId !== companyId) throw new Error('Draft not found in active company')
  const document = await getDocument(documentId)
  if (!document || document.companyId !== companyId) throw new Error('Document not found in active company')

  return updateAccountingDraft(draftId, { documentId })
}

export async function validateDraft(companyId: string, draftId: string) {
  const draft = await getAccountingDraftById(draftId)
  if (!draft || draft.companyId !== companyId) throw new Error('Draft not found in active company')

  const parsed = DraftPayloadSchema.safeParse(draft.payload)
  if (!parsed.success) {
    const errors = parsed.error.issues.map((i) => i.message)
    await updateAccountingDraft(draftId, {
      status: 'FAILED',
      validation: { isValid: false, errors, warnings: [] },
    })

    return { isValid: false, errors, warnings: [] }
  }

  const payload = parsed.data
  const warnings: string[] = []
  const lineTotal = payload.lineItems.reduce((sum, li) => sum + li.amount, 0)
  if (payload.lineItems.length > 0 && Math.abs(lineTotal - payload.amount) > 1) {
    warnings.push('Line item total does not match draft amount')
  }

  const validation = { isValid: true, errors: [], warnings }
  await updateAccountingDraft(draftId, {
    status: 'VALIDATED',
    validation,
  })

  return validation
}

export async function submitDraftForApproval(companyId: string, draftId: string, userId: string) {
  const draft = await getAccountingDraftById(draftId)
  if (!draft || draft.companyId !== companyId) throw new Error('Draft not found in active company')

  const activeContext = await getActiveAccountingContext(companyId)
  if (!activeContext) {
    throw new Error('Company context is not active. Complete context wizard first.')
  }

  const contextParsed = AccountingContextSchema.safeParse(activeContext.context)
  if (!contextParsed.success) {
    throw new Error('Company context is incomplete. Complete context wizard first.')
  }

  await updateAccountingDraft(draftId, {
    status: 'SUBMITTED',
    submittedAt: new Date(),
    approvalMeta: {
      submittedBy: userId,
    },
  })

  return getAccountingDraftById(draftId)
}

export async function approveAndPostDraft(companyId: string, draftId: string, userId: string) {
  const draft = await getAccountingDraftById(draftId)
  if (!draft || draft.companyId !== companyId) throw new Error('Draft not found in active company')

  const connection = await getCompanyZohoConnection(draft.companyId)
  if (!connection) {
    throw new Error('Zoho connection is missing for this company')
  }

  const payload = DraftPayloadSchema.parse(draft.payload)

  let result
  if (payload.type === 'expense') {
    result = await postExpense(payload as any, connection.orgId, connection.tokens.accessToken)
  } else {
    result = await postPurchase(payload as any, connection.orgId, connection.tokens.accessToken)
  }

  const nextStatus = result.success ? 'POSTED' : 'FAILED'
  await updateAccountingDraft(draftId, {
    status: nextStatus,
    approvedAt: new Date(),
    postedAt: result.success ? new Date() : null,
    zohoResult: result as unknown as Record<string, unknown>,
    approvalMeta: {
      ...(draft.approvalMeta as any),
      approvedBy: userId,
    },
  })

  await createLearningSignal({
    organizationId: draft.organizationId,
    companyId: draft.companyId,
    draftId: draft.id,
    documentId: draft.documentId,
    eventType: result.success ? 'auto_accepted' : 'post_failed',
    payload: {
      result,
    },
    createdBy: userId,
  })

  return getAccountingDraftById(draftId)
}

export async function getCompanySummary(companyId: string, dateRange?: { from?: string; to?: string }) {
  const drafts = await listAccountingDrafts(companyId)

  const totalDraftAmount = drafts.reduce((sum, draft) => {
    const payload = draft.payload as any
    const amount = typeof payload?.amount === 'number' ? payload.amount : 0
    return sum + amount
  }, 0)

  return {
    dateRange: dateRange ?? null,
    totalDrafts: drafts.length,
    totalDraftAmount,
    byStatus: drafts.reduce<Record<string, number>>((acc, draft) => {
      acc[draft.status] = (acc[draft.status] ?? 0) + 1
      return acc
    }, {}),
  }
}
