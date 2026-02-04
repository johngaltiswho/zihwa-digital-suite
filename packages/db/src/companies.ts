import type { Company } from '@prisma/client'
import { prisma } from './client'

export type CreateCompanyInput = {
  organizationId: string
  name: string
  slug: string
  baseCurrency?: string | null
  timezone?: string | null
  industry?: string | null
}

export async function createCompany(
  input: CreateCompanyInput
): Promise<Company> {
  return prisma.company.create({
    data: {
      organizationId: input.organizationId,
      name: input.name,
      slug: input.slug,
      baseCurrency: input.baseCurrency ?? null,
      timezone: input.timezone ?? undefined,
      industry: input.industry ?? null,
    },
  })
}

export async function getCompanyById(id: string) {
  return prisma.company.findUnique({ where: { id } })
}

export async function getCompanyBySlug(organizationId: string, slug: string) {
  return prisma.company.findFirst({
    where: { organizationId, slug },
  })
}

export async function listCompanies(organizationId: string) {
  return prisma.company.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function archiveCompany(id: string) {
  return prisma.company.update({
    where: { id },
    data: { archivedAt: new Date() },
  })
}
