import { prisma } from './client'

type AnalysisType = 'TECHNIQUE_FORM' | 'POSITIONING' | 'MOVEMENT_FLOW'

export type CreateVideoAnalysisInput = {
  videoId: string
  frameNumber: number
  timestamp: number
  frameUrl: string
  analysisType?: AnalysisType
  formScore?: number | null
  positioningScore?: number | null
  feedback: string
  strengths: string[]
  improvements: string[]
  metadata?: any
}

export async function createVideoAnalysis(input: CreateVideoAnalysisInput) {
  return prisma.videoAnalysis.create({
    data: {
      videoId: input.videoId,
      frameNumber: input.frameNumber,
      timestamp: input.timestamp,
      frameUrl: input.frameUrl,
      analysisType: input.analysisType ?? 'TECHNIQUE_FORM',
      formScore: input.formScore ?? null,
      positioningScore: input.positioningScore ?? null,
      feedback: input.feedback,
      strengths: input.strengths,
      improvements: input.improvements,
      metadata: input.metadata ?? null,
    },
  })
}

export async function getVideoAnalysisById(id: string) {
  return prisma.videoAnalysis.findUnique({ where: { id } })
}

export async function listVideoAnalyses(videoId: string) {
  return prisma.videoAnalysis.findMany({
    where: { videoId },
    orderBy: { frameNumber: 'asc' },
  })
}

export async function getAverageScores(videoId: string) {
  const analyses = await listVideoAnalyses(videoId)

  if (analyses.length === 0) {
    return { avgFormScore: 0, avgPositioningScore: 0, count: 0 }
  }

  const formScores = analyses.filter((a) => a.formScore !== null).map((a) => a.formScore as number)
  const positioningScores = analyses
    .filter((a) => a.positioningScore !== null)
    .map((a) => a.positioningScore as number)

  const avgFormScore = formScores.length > 0 ? formScores.reduce((a, b) => a + b, 0) / formScores.length : 0
  const avgPositioningScore =
    positioningScores.length > 0 ? positioningScores.reduce((a, b) => a + b, 0) / positioningScores.length : 0

  return {
    avgFormScore: Math.round(avgFormScore),
    avgPositioningScore: Math.round(avgPositioningScore),
    count: analyses.length,
  }
}
