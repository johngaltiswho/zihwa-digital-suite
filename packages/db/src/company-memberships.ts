import type { CompanyRole } from '../prisma/generated/client'
import { prisma } from './client'

export type UpsertCompanyMembershipInput = {
  companyId: string
  userId: string
  role?: CompanyRole
}

export async function upsertCompanyMembership(input: UpsertCompanyMembershipInput) {
  return prisma.companyMembership.upsert({
    where: {
      companyId_userId: {
        companyId: input.companyId,
        userId: input.userId,
      },
    },
    update: {
      role: input.role ?? 'VIEWER',
    },
    create: {
      companyId: input.companyId,
      userId: input.userId,
      role: input.role ?? 'VIEWER',
    },
  })
}

export async function getCompanyMembership(companyId: string, userId: string) {
  return prisma.companyMembership.findUnique({
    where: {
      companyId_userId: {
        companyId,
        userId,
      },
    },
  })
}

export async function listCompanyMemberships(companyId: string) {
  return prisma.companyMembership.findMany({
    where: { companyId },
    orderBy: { createdAt: 'asc' },
  })
}

export async function listUserCompanyMemberships(userId: string) {
  return prisma.companyMembership.findMany({
    where: { userId },
    include: {
      company: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}
