import { prisma } from './client'

// Local type definitions (matching Prisma schema)
type CopilotMessageRole = 'SYSTEM' | 'USER' | 'ASSISTANT'
type ToolCallStatus = 'SUCCESS' | 'FAILED'

type BJJCopilotThread = {
  id: string
  studentId: string
  title: string | null
  createdAt: Date
  updatedAt: Date
}

type BJJCopilotMessage = {
  id: string
  threadId: string
  role: CopilotMessageRole
  content: string
  metadata: unknown
  videoAnalysisId: string | null
  createdAt: Date
}

type BJJCopilotToolCall = {
  id: string
  messageId: string
  toolName: string
  input: unknown | null
  output: unknown | null
  status: ToolCallStatus
  error: string | null
  createdAt: Date
}

export type CreateBJJCopilotThreadInput = {
  studentId: string
  title?: string | null
}

export type CreateBJJCopilotMessageInput = {
  threadId: string
  role: CopilotMessageRole
  content: string
  metadata?: any
  videoAnalysisId?: string | null
  trainingPlanId?: string | null
}

export type CreateBJJCopilotToolCallInput = {
  messageId: string
  toolName: string
  input?: any
  output?: any
  status: ToolCallStatus
  error?: string | null
}

export async function createBJJCopilotThread(
  input: CreateBJJCopilotThreadInput
) {
  return prisma.bJJCopilotThread.create({
    data: {
      studentId: input.studentId,
      title: input.title ?? null,
    },
  })
}

export async function getBJJCopilotThreadById(id: string) {
  return prisma.bJJCopilotThread.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        include: { toolCalls: true },
      },
    },
  })
}

export async function listBJJCopilotThreadsByStudent(studentId: string) {
  return prisma.bJJCopilotThread.findMany({
    where: { studentId },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function createBJJCopilotMessage(
  input: CreateBJJCopilotMessageInput
) {
  const message = await prisma.bJJCopilotMessage.create({
    data: {
      threadId: input.threadId,
      role: input.role,
      content: input.content,
      metadata: input.metadata ?? null,
      videoAnalysisId: input.videoAnalysisId ?? null,
      trainingPlanId: input.trainingPlanId ?? null,
    },
  })

  // Update thread's updatedAt timestamp
  await prisma.bJJCopilotThread.update({
    where: { id: input.threadId },
    data: { updatedAt: new Date() },
  })

  return message
}

export async function listBJJCopilotMessages(threadId: string) {
  return prisma.bJJCopilotMessage.findMany({
    where: { threadId },
    orderBy: { createdAt: 'asc' },
    include: { toolCalls: true },
  })
}

export async function createBJJCopilotToolCall(
  input: CreateBJJCopilotToolCallInput
) {
  return prisma.bJJCopilotToolCall.create({
    data: {
      messageId: input.messageId,
      toolName: input.toolName,
      input: input.input ?? null,
      output: input.output ?? null,
      status: input.status,
      error: input.error ?? null,
    },
  })
}

export async function countBJJCopilotMessagesInDay(studentId: string, date: Date) {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  return prisma.bJJCopilotMessage.count({
    where: {
      thread: {
        studentId,
      },
      role: 'USER',
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  })
}
