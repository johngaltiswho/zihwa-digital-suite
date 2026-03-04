import { prisma } from './client'

type VideoProcessingStatus = 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export type CreateVideoUploadInput = {
  studentId: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  status?: VideoProcessingStatus
}

export async function createVideoUpload(input: CreateVideoUploadInput) {
  return prisma.videoUpload.create({
    data: {
      studentId: input.studentId,
      fileName: input.fileName,
      fileUrl: input.fileUrl,
      fileSize: input.fileSize,
      mimeType: input.mimeType,
      status: input.status ?? 'UPLOADED',
    },
  })
}

export async function getVideoUploadById(id: string) {
  return prisma.videoUpload.findUnique({
    where: { id },
    include: { analyses: true },
  })
}

export async function listVideoUploadsByStudent(studentId: string) {
  return prisma.videoUpload.findMany({
    where: { studentId },
    orderBy: { uploadedAt: 'desc' },
  })
}

export async function updateVideoUploadStatus(
  id: string,
  status: VideoProcessingStatus,
  timestamps?: {
    processingStartedAt?: Date
    processingCompletedAt?: Date
  }
) {
  return prisma.videoUpload.update({
    where: { id },
    data: {
      status,
      processingStartedAt: timestamps?.processingStartedAt,
      processingCompletedAt: timestamps?.processingCompletedAt,
    },
  })
}

export async function countVideoUploadsInMonth(studentId: string, startDate: Date, endDate: Date) {
  return prisma.videoUpload.count({
    where: {
      studentId,
      uploadedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  })
}
