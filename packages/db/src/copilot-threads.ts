import type { CopilotMessageRole, ToolCallStatus } from '../prisma/generated/client'
import { prisma } from './client'

export async function createCopilotThread(input: {
  organizationId: string
  companyId: string
  createdBy: string
  title?: string | null
}) {
  return prisma.copilotThread.create({
    data: {
      organizationId: input.organizationId,
      companyId: input.companyId,
      createdBy: input.createdBy,
      title: input.title ?? null,
    },
  })
}

export async function listCopilotThreads(companyId: string, createdBy: string) {
  return prisma.copilotThread.findMany({
    where: {
      companyId,
      createdBy,
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function createCopilotMessage(input: {
  threadId: string
  role: CopilotMessageRole
  content: string
  metadata?: Record<string, unknown>
  draftId?: string | null
}) {
  return prisma.copilotMessage.create({
    data: {
      threadId: input.threadId,
      role: input.role,
      content: input.content,
      metadata: input.metadata as any,
      draftId: input.draftId ?? null,
    },
  })
}

export async function listCopilotMessages(threadId: string) {
  return prisma.copilotMessage.findMany({
    where: { threadId },
    include: { toolCalls: true },
    orderBy: { createdAt: 'asc' },
  })
}

export async function createCopilotToolCall(input: {
  messageId: string
  toolName: string
  input?: Record<string, unknown>
  output?: Record<string, unknown>
  status?: ToolCallStatus
  error?: string
}) {
  return prisma.copilotToolCall.create({
    data: {
      messageId: input.messageId,
      toolName: input.toolName,
      input: input.input as any,
      output: input.output as any,
      status: input.status ?? 'SUCCESS',
      error: input.error,
    },
  })
}
