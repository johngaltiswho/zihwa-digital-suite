import { prisma } from './client'

type BeltRank = 'WHITE' | 'BLUE' | 'PURPLE' | 'BROWN' | 'BLACK'

export type CreateStudentInput = {
  vendureCustomerId: string
  email: string
  firstName?: string | null
  lastName?: string | null
  beltRank?: BeltRank
  stripeCustomerId?: string | null
}

export async function createStudent(input: CreateStudentInput) {
  return prisma.student.create({
    data: {
      vendureCustomerId: input.vendureCustomerId,
      email: input.email,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      beltRank: input.beltRank ?? 'WHITE',
      stripeCustomerId: input.stripeCustomerId ?? null,
    },
  })
}

export async function getStudentById(id: string) {
  return prisma.student.findUnique({ where: { id } })
}

export async function getStudentByVendureCustomerId(vendureCustomerId: string) {
  return prisma.student.findUnique({ where: { vendureCustomerId } })
}

export async function getStudentByEmail(email: string) {
  return prisma.student.findUnique({ where: { email } })
}

export async function updateStudent(
  id: string,
  data: {
    firstName?: string
    lastName?: string
    beltRank?: BeltRank
  }
) {
  return prisma.student.update({
    where: { id },
    data,
  })
}

export async function listStudents() {
  return prisma.student.findMany({
    orderBy: { createdAt: 'desc' },
  })
}
