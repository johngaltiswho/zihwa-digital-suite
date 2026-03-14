import { NextRequest, NextResponse } from 'next/server'
import {
  createCopilotMessage,
  createCopilotThread,
  createCopilotToolCall,
  listCopilotMessages,
} from '@repo/db'
import type { Permission } from '@repo/ledger-core'
import { requireCompanyPermission } from '@/lib/authz'
import { runCopilotTool, type CopilotToolName } from '@/lib/copilot/action-dispatcher'

const permissionByTool: Record<CopilotToolName, Permission> = {
  search_vendors: 'company.read',
  create_expense_draft: 'draft.create',
  attach_document_to_draft: 'draft.create',
  validate_draft: 'draft.create',
  submit_for_approval: 'draft.submit',
  approve_and_post: 'draft.approve',
  get_company_summary: 'company.read',
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ companyId: string }> }
): Promise<NextResponse> { 
  const { companyId } = await context.params

  const body = await request.json()
  const toolName = body.toolName as CopilotToolName | undefined
  const message = String(body.message ?? '').trim()

  const requiredPermission = toolName ? permissionByTool[toolName] : 'company.read'
  const auth = await requireCompanyPermission(companyId, requiredPermission)
  if (!('user' in auth)) return auth.error
  const scoped = auth as {
    user: { id: string }
    company: { organizationId: string }
  }
  const userId = scoped.user?.id
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const thread = body.threadId
    ? { id: String(body.threadId) }
    : await createCopilotThread({
        organizationId: scoped.company.organizationId,
        companyId,
        createdBy: userId,
        title: message.slice(0, 80) || 'Copilot Thread',
      })

  const userMessage = await createCopilotMessage({
    threadId: thread.id,
    role: 'USER',
    content: message || `Execute ${toolName}`,
    metadata: {
      intent: body.intent ?? null,
      attachments: body.attachments ?? [],
    },
  })

  if (!toolName) {
    const assistant = await createCopilotMessage({
      threadId: thread.id,
      role: 'ASSISTANT',
      content:
        'I can help create and validate drafts, submit approvals, post to Zoho, and summarize this company. Send `toolName` and `args` to execute a workflow action.',
    })

    const messages = await listCopilotMessages(thread.id)
    return NextResponse.json({
      success: true,
      data: {
        threadId: thread.id,
        assistant,
        messages,
      },
    })
  }

  try {
    const result = await runCopilotTool({
      toolName,
      companyId,
      organizationId: scoped.company.organizationId,
      userId,
      args: (body.args ?? {}) as Record<string, unknown>,
    })

    await createCopilotToolCall({
      messageId: userMessage.id,
      toolName,
      input: (body.args ?? {}) as Record<string, unknown>,
      output: result as Record<string, unknown>,
      status: 'SUCCESS',
    })

    const assistant = await createCopilotMessage({
      threadId: thread.id,
      role: 'ASSISTANT',
      content: `Executed ${toolName} successfully.`,
      metadata: {
        toolName,
        result,
      },
      draftId: (result as any)?.id ?? null,
    })

    const messages = await listCopilotMessages(thread.id)

    return NextResponse.json({
      success: true,
      data: {
        threadId: thread.id,
        assistant,
        toolTrace: {
          toolName,
          status: 'SUCCESS',
        },
        result,
        messages,
      },
    })
  } catch (error: any) {
    await createCopilotToolCall({
      messageId: userMessage.id,
      toolName,
      input: (body.args ?? {}) as Record<string, unknown>,
      status: 'FAILED',
      error: error.message || 'Tool failed',
    })

    const assistant = await createCopilotMessage({
      threadId: thread.id,
      role: 'ASSISTANT',
      content: `Failed to execute ${toolName}: ${error.message || 'Unknown error'}`,
      metadata: {
        toolName,
        error: error.message || 'Unknown error',
      },
    })

    return NextResponse.json(
      {
        success: false,
        data: {
          threadId: thread.id,
          assistant,
          toolTrace: {
            toolName,
            status: 'FAILED',
          },
        },
        error: error.message || 'Tool execution failed',
      },
      { status: 400 }
    )
  }
}
