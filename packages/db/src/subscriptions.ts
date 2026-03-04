import { prisma } from './client'

type SubscriptionTier = 'FREE' | 'BASIC' | 'PREMIUM'
type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED'

export type CreateSubscriptionInput = {
  studentId: string
  vendureOrderId?: string | null
  tier: SubscriptionTier
  status: SubscriptionStatus
  startDate: Date
  endDate?: Date | null
  autoRenew?: boolean
  metadata?: any
}

export async function createSubscription(input: CreateSubscriptionInput) {
  return prisma.subscription.create({
    data: {
      studentId: input.studentId,
      vendureOrderId: input.vendureOrderId ?? null,
      tier: input.tier,
      status: input.status,
      startDate: input.startDate,
      endDate: input.endDate ?? null,
      autoRenew: input.autoRenew ?? true,
      metadata: input.metadata ?? null,
    },
  })
}

export async function getSubscriptionById(id: string) {
  return prisma.subscription.findUnique({ where: { id } })
}

export async function getActiveSubscription(studentId: string) {
  return prisma.subscription.findFirst({
    where: {
      studentId,
      status: 'ACTIVE',
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function listSubscriptionsByStudent(studentId: string) {
  return prisma.subscription.findMany({
    where: { studentId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function updateSubscriptionStatus(id: string, status: SubscriptionStatus) {
  return prisma.subscription.update({
    where: { id },
    data: { status, updatedAt: new Date() },
  })
}

export async function extendSubscription(id: string, newEndDate: Date) {
  return prisma.subscription.update({
    where: { id },
    data: { endDate: newEndDate, updatedAt: new Date() },
  })
}
