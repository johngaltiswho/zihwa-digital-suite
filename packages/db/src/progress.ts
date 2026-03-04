import { prisma } from './client'

type ProgressStatus = 'NOT_STARTED' | 'LEARNING' | 'PRACTICING' | 'PROFICIENT' | 'MASTERED'

export type CreateTechniqueProgressInput = {
  studentId: string
  techniqueId: string
  status?: ProgressStatus
  proficiencyLevel?: number
  practiceCount?: number
  notes?: string | null
}

export async function createTechniqueProgress(
  input: CreateTechniqueProgressInput
) {
  return prisma.techniqueProgress.create({
    data: {
      studentId: input.studentId,
      techniqueId: input.techniqueId,
      status: input.status ?? 'NOT_STARTED',
      proficiencyLevel: input.proficiencyLevel ?? 0,
      practiceCount: input.practiceCount ?? 0,
      notes: input.notes ?? null,
    },
  })
}

export async function getTechniqueProgress(studentId: string, techniqueId: string) {
  return prisma.techniqueProgress.findUnique({
    where: {
      studentId_techniqueId: {
        studentId,
        techniqueId,
      },
    },
    include: { technique: true },
  })
}

export async function listTechniqueProgress(studentId: string, status?: ProgressStatus) {
  return prisma.techniqueProgress.findMany({
    where: {
      studentId,
      status,
    },
    include: { technique: true },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function incrementPracticeCount(studentId: string, techniqueId: string) {
  const progress = await getTechniqueProgress(studentId, techniqueId)

  if (!progress) {
    return createTechniqueProgress({
      studentId,
      techniqueId,
      status: 'LEARNING',
      practiceCount: 1,
    })
  }

  return prisma.techniqueProgress.update({
    where: { id: progress.id },
    data: {
      practiceCount: { increment: 1 },
      lastPracticedAt: new Date(),
      updatedAt: new Date(),
    },
  })
}

export async function updateTechniqueProgress(
  studentId: string,
  techniqueId: string,
  data: {
    status?: ProgressStatus
    proficiencyLevel?: number
    notes?: string
  }
) {
  const progress = await getTechniqueProgress(studentId, techniqueId)

  if (!progress) {
    return createTechniqueProgress({
      studentId,
      techniqueId,
      ...data,
    })
  }

  return prisma.techniqueProgress.update({
    where: { id: progress.id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })
}

export async function getProgressSummary(studentId: string) {
  const allProgress = await listTechniqueProgress(studentId)

  const summary = {
    total: allProgress.length,
    notStarted: allProgress.filter((p) => p.status === 'NOT_STARTED').length,
    learning: allProgress.filter((p) => p.status === 'LEARNING').length,
    practicing: allProgress.filter((p) => p.status === 'PRACTICING').length,
    proficient: allProgress.filter((p) => p.status === 'PROFICIENT').length,
    mastered: allProgress.filter((p) => p.status === 'MASTERED').length,
    avgProficiency:
      allProgress.length > 0
        ? Math.round(allProgress.reduce((sum, p) => sum + p.proficiencyLevel, 0) / allProgress.length)
        : 0,
    totalPractice: allProgress.reduce((sum, p) => sum + p.practiceCount, 0),
  }

  return summary
}
