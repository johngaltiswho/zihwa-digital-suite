import { prisma } from './client'

export async function createLearningSignal(input: {
  organizationId: string
  companyId?: string | null
  documentId?: string | null
  draftId?: string | null
  eventType: string
  payload: Record<string, unknown>
  createdBy?: string
}) {
  return prisma.learningSignal.create({
    data: {
      organizationId: input.organizationId,
      companyId: input.companyId ?? null,
      documentId: input.documentId ?? null,
      draftId: input.draftId ?? null,
      eventType: input.eventType,
      payload: input.payload as any,
      createdBy: input.createdBy,
    },
  })
}

export async function listLearningSignalsByCompany(companyId: string) {
  return prisma.learningSignal.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getCompanyLearningInsights(companyId: string) {
  const signals = await prisma.learningSignal.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' },
  })

  const correctionCounts = new Map<string, number>()
  let autoAccepted = 0
  let needsReview = 0
  let manual = 0

  for (const signal of signals) {
    if (signal.eventType === 'auto_accepted') autoAccepted += 1
    if (signal.eventType === 'needs_review') needsReview += 1
    if (signal.eventType === 'manual_edit') manual += 1

    const key = signal.eventType
    correctionCounts.set(key, (correctionCounts.get(key) ?? 0) + 1)
  }

  const topCorrections = Array.from(correctionCounts.entries())
    .map(([eventType, count]) => ({ eventType, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    totalSignals: signals.length,
    autoAccepted,
    needsReview,
    manual,
    topCorrections,
  }
}
