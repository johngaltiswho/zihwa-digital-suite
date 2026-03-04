import type { OrgPolicy } from '../prisma/generated/client'
import { prisma } from './client'

export type UpsertOrgPolicyInput = {
  organizationId: string
  policyType?: string
  data: Record<string, unknown>
  createdBy?: string
}

export async function createOrgPolicy(
  input: UpsertOrgPolicyInput
): Promise<OrgPolicy> {
  return prisma.orgPolicy.create({
    data: {
      organizationId: input.organizationId,
      policyType: input.policyType ?? 'defaults',
      data: input.data as any,
      createdBy: input.createdBy,
    },
  })
}

export async function getActiveOrgPolicy(
  organizationId: string,
  policyType: string = 'defaults'
) {
  return prisma.orgPolicy.findFirst({
    where: {
      organizationId,
      policyType,
      isActive: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function listOrgPolicies(
  organizationId: string,
  policyType?: string
) {
  return prisma.orgPolicy.findMany({
    where: {
      organizationId,
      policyType,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function deactivateOrgPolicy(id: string) {
  return prisma.orgPolicy.update({
    where: { id },
    data: { isActive: false },
  })
}
