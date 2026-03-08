import { NextRequest, NextResponse } from 'next/server'
import {
  createCopilotMessage,
  createCopilotThread,
  createCopilotToolCall,
  listCopilotMessages,
  getAccountingDraftById,
} from '@repo/db'
import type { Permission } from '@repo/ledger-core'
import { requireCompanyPermission } from '@/lib/authz'
import { runCopilotTool, type CopilotToolName } from '@/lib/copilot/action-dispatcher'

const permissionByTool: Record<CopilotToolName, Permission> = {
  search_vendors: 'company.read',
  create_expense_draft: 'draft.create',
  ingest_expense_list: 'draft.create',
  post_drafts_as_zoho_drafts: 'draft.approve',
  attach_document_to_draft: 'draft.create',
  validate_draft: 'draft.create',
  submit_for_approval: 'draft.submit',
  approve_and_post: 'draft.approve',
  get_company_summary: 'company.read',
}

function getDraftIdFromResult(result: unknown): string | null {
  if (!result || typeof result !== 'object') return null
  const id = (result as { id?: unknown }).id
  return typeof id === 'string' ? id : null
}

function isLikelyExpenseList(text: string): boolean {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length < 2) return false
  const numericLines = lines.filter((line) => /\d[\d,]*(\.\d+)?/.test(line))
  return numericLines.length >= 2
}

function isApproveAllMessage(text: string): boolean {
  const normalized = text.trim().toLowerCase()
  return /^approve(\s+all)?$/.test(normalized) || normalized === 'post all'
}

function isShowEntriesMessage(text: string): boolean {
  const normalized = text.trim().toLowerCase()
  return (
    normalized.includes('show me the entries') ||
    normalized.includes('show entries') ||
    normalized.includes("how you've structured") ||
    normalized.includes('how you structured')
  )
}

function findPendingDraftIds(
  messages: Array<{ role: string; metadata: Record<string, unknown> | null }>
): string[] {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const msg = messages[i]
    if (!msg || msg.role !== 'ASSISTANT') continue
    const metadata = msg.metadata
    if (!metadata) continue
    const pending = metadata.pendingDraftIds
    if (Array.isArray(pending)) {
      return pending.map((id) => String(id)).filter(Boolean)
    }
  }
  return []
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ companyId: string }> }
): Promise<Response> {
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
    if (isLikelyExpenseList(message)) {
      const previewResult = await runCopilotTool({
        toolName: 'ingest_expense_list',
        companyId,
        organizationId: scoped.company.organizationId,
        userId,
        args: {
          text: message,
          postToZohoDraft: false,
        },
      })

      const preview = previewResult as {
        parsedRows: number
        draftsCreated: number
        failures: Array<{ row: number; reason: string }>
        draftIds: string[]
      }

      const issues =
        preview.failures.length > 0
          ? `Issues: ${preview.failures.map((f) => `row ${f.row}: ${f.reason}`).join(' | ')}`
          : 'No parse issues found.'

      await createCopilotMessage({
        threadId: thread.id,
        role: 'ASSISTANT',
        content:
          `I parsed ${preview.parsedRows} rows and prepared ${preview.draftsCreated} draft entries. ${issues} ` +
          `Reply with "approve all" to post these as Zoho draft bills, or send corrected rows.`,
        metadata: {
          mode: 'expense_list_preview',
          pendingDraftIds: preview.draftIds,
          preview,
        },
      })

      const messages = await listCopilotMessages(thread.id)
      return NextResponse.json({
        success: true,
        data: {
          threadId: thread.id,
          messages,
          result: preview,
        },
      })
    }

    if (isShowEntriesMessage(message)) {
      const messages = await listCopilotMessages(thread.id)
      const pendingDraftIds = findPendingDraftIds(
        messages.map((m) => ({
          role: m.role,
          metadata: (m.metadata ?? null) as Record<string, unknown> | null,
        }))
      )

      if (pendingDraftIds.length === 0) {
        await createCopilotMessage({
          threadId: thread.id,
          role: 'ASSISTANT',
          content: 'No prepared batch found yet. Paste expense rows first and click Analyze.',
        })
      } else {
        const previewLines: string[] = []
        for (let i = 0; i < pendingDraftIds.length; i += 1) {
          const draft = await getAccountingDraftById(pendingDraftIds[i]!)
          if (!draft) continue
          const payload = draft.payload as {
            vendorName?: string
            amount?: number
            date?: string
            narration?: string
          }
          previewLines.push(
            `${i + 1}. ${payload.vendorName || 'Unknown vendor'} | ₹${Number(payload.amount || 0).toLocaleString()} | ${payload.date || '—'} | ${payload.narration || '—'}`
          )
        }

        await createCopilotMessage({
          threadId: thread.id,
          role: 'ASSISTANT',
          content:
            `Here are the prepared entries (${previewLines.length}):\n` +
            previewLines.slice(0, 25).join('\n') +
            (previewLines.length > 25 ? `\n...and ${previewLines.length - 25} more.` : '') +
            '\n\nReply "approve all" to post this batch as Zoho drafts.',
          metadata: {
            mode: 'expense_list_preview_table',
            pendingDraftIds,
          },
        })
      }

      const refreshed = await listCopilotMessages(thread.id)
      return NextResponse.json({
        success: true,
        data: {
          threadId: thread.id,
          messages: refreshed,
        },
      })
    }

    if (isApproveAllMessage(message)) {
      const messages = await listCopilotMessages(thread.id)
      const pendingDraftIds = findPendingDraftIds(
        messages.map((m) => ({
          role: m.role,
          metadata: (m.metadata ?? null) as Record<string, unknown> | null,
        }))
      )

      if (pendingDraftIds.length === 0) {
        await createCopilotMessage({
          threadId: thread.id,
          role: 'ASSISTANT',
          content: 'No pending draft batch found. Paste an expense list first.',
        })
        const refreshed = await listCopilotMessages(thread.id)
        return NextResponse.json({
          success: true,
          data: { threadId: thread.id, messages: refreshed },
        })
      }

      const approveAuth = await requireCompanyPermission(companyId, 'draft.approve')
      if (!('user' in approveAuth)) {
        await createCopilotMessage({
          threadId: thread.id,
          role: 'ASSISTANT',
          content:
            'You do not have Approver access for this company. Ask an Approver/Admin to run "approve all", or get your role upgraded.',
          metadata: {
            mode: 'approval_permission_denied',
          },
        })
        const refreshed = await listCopilotMessages(thread.id)
        return NextResponse.json({
          success: true,
          data: { threadId: thread.id, messages: refreshed },
        })
      }

      try {
        const postResult = await runCopilotTool({
          toolName: 'post_drafts_as_zoho_drafts',
          companyId,
          organizationId: scoped.company.organizationId,
          userId,
          args: {
            draftIds: pendingDraftIds,
          },
        })

        const posted = postResult as {
          total: number
          posted: number
          failures: Array<{ draftId: string; reason: string }>
        }

        await createCopilotMessage({
          threadId: thread.id,
          role: 'ASSISTANT',
          content:
            `Posted ${posted.posted}/${posted.total} drafts to Zoho (draft mode). ` +
            (posted.failures.length > 0
              ? `Failures: ${posted.failures.map((f) => `${f.draftId.slice(0, 8)}: ${f.reason}`).join(' | ')}`
              : 'No failures.'),
          metadata: {
            mode: 'expense_list_posted',
            result: posted,
          },
        })

        const refreshed = await listCopilotMessages(thread.id)
        return NextResponse.json({
          success: true,
          data: {
            threadId: thread.id,
            messages: refreshed,
            result: posted,
          },
        })
      } catch (error: unknown) {
        const reason = error instanceof Error ? error.message : 'Unable to post draft batch'
        await createCopilotMessage({
          threadId: thread.id,
          role: 'ASSISTANT',
          content:
            `Could not post this batch: ${reason}. ` +
            'Likely cause: Zoho role/scope does not allow vendor read. Re-authorize Zoho with contacts/vendor read permissions.',
          metadata: {
            mode: 'expense_list_post_failed',
            reason,
          },
        })
        const refreshed = await listCopilotMessages(thread.id)
        return NextResponse.json({
          success: true,
          data: {
            threadId: thread.id,
            messages: refreshed,
          },
        })
      }
    }

    const assistant = await createCopilotMessage({
      threadId: thread.id,
      role: 'ASSISTANT',
      content:
        'Paste your expense rows and I will prepare drafts with issues/suggestions. Then reply "approve all" to post to Zoho drafts.',
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
      draftId: getDraftIdFromResult(result),
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    await createCopilotToolCall({
      messageId: userMessage.id,
      toolName,
      input: (body.args ?? {}) as Record<string, unknown>,
      status: 'FAILED',
      error: message || 'Tool failed',
    })

    const assistant = await createCopilotMessage({
      threadId: thread.id,
      role: 'ASSISTANT',
      content: `Failed to execute ${toolName}: ${message}`,
      metadata: {
        toolName,
        error: message,
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
        error: message || 'Tool execution failed',
      },
      { status: 400 }
    )
  }
}
