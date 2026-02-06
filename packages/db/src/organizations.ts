import type { OrgRole, Organization } from '@prisma/client'
import { prisma } from './client'

export type CreateOrganizationInput = {
  name: string
  slug: string
  description?: string | null
  defaultCurrency?: string | null
  timezone?: string | null
}

export async function createOrganization(
  input: CreateOrganizationInput
): Promise<Organization> {
  return prisma.organization.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      defaultCurrency: input.defaultCurrency ?? null,
      timezone: input.timezone ?? undefined,
    },
  })
}

export async function getOrganizationById(id: string) {
  return prisma.organization.findUnique({ where: { id } })
}

export async function getOrganizationBySlug(slug: string) {
  return prisma.organization.findUnique({ where: { slug } })
}

export async function listOrganizations() {
  return prisma.organization.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export type AddOrgMemberInput = {
  organizationId: string
  userId: string
  role?: OrgRole
}

export async function addOrgMember(input: AddOrgMemberInput) {
  return prisma.orgMembership.upsert({
    where: {
      organizationId_userId: {
        organizationId: input.organizationId,
        userId: input.userId,
      },
    },
    update: {
      role: input.role ?? 'ACCOUNTANT',
    },
    create: {
      organizationId: input.organizationId,
      userId: input.userId,
      role: input.role ?? 'ACCOUNTANT',
    },
  })
}

export async function listOrgMembers(organizationId: string) {
  return prisma.orgMembership.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'asc' },
  })
}
