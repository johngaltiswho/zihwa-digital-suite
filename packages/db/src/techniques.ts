import { prisma } from './client'

type TechniqueCategory = 'GUARD' | 'PASSING' | 'SUBMISSIONS' | 'ESCAPES' | 'TRANSITIONS' | 'TAKEDOWNS'
type Position = 'CLOSED_GUARD' | 'OPEN_GUARD' | 'HALF_GUARD' | 'SIDE_CONTROL' | 'MOUNT' | 'BACK' | 'STANDING'
type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export type CreateTechniqueInput = {
  title: string
  slug: string
  description: string
  category: TechniqueCategory
  position: Position
  difficultyLevel: DifficultyLevel
  youtubeUrl?: string | null
  youtubeId?: string | null
  durationMinutes?: number | null
  instructorNotes?: string | null
  keyPoints: string[]
  prerequisites?: string[] | null
  nextTechniques?: string[] | null
  thumbnailUrl?: string | null
  isPublished?: boolean
}

export async function createTechnique(input: CreateTechniqueInput) {
  return prisma.technique.create({
    data: {
      title: input.title,
      slug: input.slug,
      description: input.description,
      category: input.category,
      position: input.position,
      difficultyLevel: input.difficultyLevel,
      youtubeUrl: input.youtubeUrl ?? null,
      youtubeId: input.youtubeId ?? null,
      durationMinutes: input.durationMinutes ?? null,
      instructorNotes: input.instructorNotes ?? null,
      keyPoints: input.keyPoints,
      prerequisites: input.prerequisites || undefined,
      nextTechniques: input.nextTechniques || undefined,
      thumbnailUrl: input.thumbnailUrl ?? null,
      isPublished: input.isPublished ?? false,
    },
  })
}

export async function getTechniqueById(id: string) {
  return prisma.technique.findUnique({ where: { id } })
}

export async function getTechniqueBySlug(slug: string) {
  return prisma.technique.findUnique({ where: { slug } })
}

export async function listTechniques(filters?: {
  category?: TechniqueCategory
  difficultyLevel?: DifficultyLevel
  position?: Position
  isPublished?: boolean
}) {
  return prisma.technique.findMany({
    where: {
      category: filters?.category,
      difficultyLevel: filters?.difficultyLevel,
      position: filters?.position,
      isPublished: filters?.isPublished ?? true,
    },
    orderBy: [{ category: 'asc' }, { difficultyLevel: 'asc' }],
  })
}

export async function updateTechnique(id: string, data: Partial<CreateTechniqueInput>) {
  const updateData = {
    ...data,
    prerequisites: data.prerequisites === null ? undefined : data.prerequisites,
    nextTechniques: data.nextTechniques === null ? undefined : data.nextTechniques,
    updatedAt: new Date(),
  }

  return prisma.technique.update({
    where: { id },
    data: updateData,
  })
}

export async function publishTechnique(id: string) {
  return prisma.technique.update({
    where: { id },
    data: { isPublished: true, updatedAt: new Date() },
  })
}

export async function unpublishTechnique(id: string) {
  return prisma.technique.update({
    where: { id },
    data: { isPublished: false, updatedAt: new Date() },
  })
}
