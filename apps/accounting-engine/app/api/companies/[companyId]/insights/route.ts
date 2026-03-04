import { NextRequest, NextResponse } from 'next/server'
import { getCompanyLearningInsights, prisma } from '@repo/db'
import { requireCompanyPermission } from '@/lib/authz'

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ companyId: string }> }
) {
  const { companyId } = await context.params
  const auth = await requireCompanyPermission(companyId, 'company.read')
  if (!('user' in auth)) return auth.error

  const [insights, drafts] = await Promise.all([
    getCompanyLearningInsights(companyId),
    prisma.accountingDraft.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: 500,
      select: {
        status: true,
        payload: true,
      },
    }),
  ])

  const vendorCounts = new Map<string, number>()
  for (const draft of drafts) {
    const payload = draft.payload as any
    const vendor = payload.vendorName || payload.merchant
    if (typeof vendor === 'string' && vendor.trim()) {
      vendorCounts.set(vendor, (vendorCounts.get(vendor) ?? 0) + 1)
    }
  }

  const topVendors = Array.from(vendorCounts.entries())
    .map(([vendor, count]) => ({ vendor, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  const totalSignals = insights.totalSignals || 0
  const autoAcceptedRate = totalSignals > 0 ? (insights.autoAccepted / totalSignals) * 100 : 0
  const needsReviewRate = totalSignals > 0 ? (insights.needsReview / totalSignals) * 100 : 0
  const manualRate = totalSignals > 0 ? (insights.manual / totalSignals) * 100 : 0

  return NextResponse.json({
    success: true,
    data: {
      totalSignals,
      autoAccepted: insights.autoAccepted,
      needsReview: insights.needsReview,
      manual: insights.manual,
      autoAcceptedRate,
      needsReviewRate,
      manualRate,
      topCorrections: insights.topCorrections,
      topVendors,
    },
  })
}
