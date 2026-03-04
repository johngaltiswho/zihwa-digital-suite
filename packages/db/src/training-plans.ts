import { prisma } from './client'

type BeltRank = 'WHITE' | 'BLUE' | 'PURPLE' | 'BROWN' | 'BLACK'
type PlanStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'

export type CreateTrainingPlanInput = {
  studentId: string
  title: string
  description?: string | null
  goalBeltRank?: BeltRank | null
  startDate: Date
  endDate?: Date | null
  status?: PlanStatus
  createdBy?: string
}

export type CreateTrainingPlanItemInput = {
  planId: string
  techniqueId: string
  orderIndex: number
  targetReps?: number | null
  targetDuration?: number | null
  notes?: string | null
}

export async function createTrainingPlan(input: CreateTrainingPlanInput) {
  return prisma.trainingPlan.create({
    data: {
      studentId: input.studentId,
      title: input.title,
      description: input.description ?? null,
      goalBeltRank: input.goalBeltRank ?? null,
      startDate: input.startDate,
      endDate: input.endDate ?? null,
      status: input.status ?? 'ACTIVE',
      createdBy: input.createdBy ?? 'copilot',
    },
  })
}

export async function getTrainingPlanById(id: string) {
  return prisma.trainingPlan.findUnique({
    where: { id },
    include: {
      items: {
        include: { technique: true },
        orderBy: { orderIndex: 'asc' },
      },
    },
  })
}

export async function listTrainingPlansByStudent(studentId: string, status?: PlanStatus) {
  return prisma.trainingPlan.findMany({
    where: {
      studentId,
      status,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { technique: true },
        orderBy: { orderIndex: 'asc' },
      },
    },
  })
}

export async function createTrainingPlanItem(
  input: CreateTrainingPlanItemInput
) {
  return prisma.trainingPlanItem.create({
    data: {
      planId: input.planId,
      techniqueId: input.techniqueId,
      orderIndex: input.orderIndex,
      targetReps: input.targetReps ?? null,
      targetDuration: input.targetDuration ?? null,
      notes: input.notes ?? null,
    },
  })
}

export async function markTrainingPlanItemComplete(id: string) {
  return prisma.trainingPlanItem.update({
    where: { id },
    data: {
      completed: true,
      completedAt: new Date(),
    },
  })
}

export async function updateTrainingPlanStatus(id: string, status: PlanStatus) {
  return prisma.trainingPlan.update({
    where: { id },
    data: { status, updatedAt: new Date() },
  })
}

export async function getTrainingPlanProgress(planId: string) {
  const items = await prisma.trainingPlanItem.findMany({
    where: { planId },
  })

  const totalItems = items.length
  const completedItems = items.filter((item) => item.completed).length
  const percentComplete = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  return {
    totalItems,
    completedItems,
    percentComplete,
  }
}
