import {
  searchVendors,
  createExpenseDraft,
  attachDocumentToDraft,
  validateDraft,
  submitDraftForApproval,
  approveAndPostDraft,
  getCompanySummary,
} from './tool-impl'

export type CopilotToolName =
  | 'search_vendors'
  | 'create_expense_draft'
  | 'attach_document_to_draft'
  | 'validate_draft'
  | 'submit_for_approval'
  | 'approve_and_post'
  | 'get_company_summary'

export async function runCopilotTool(input: {
  toolName: CopilotToolName
  companyId: string
  organizationId: string
  userId: string
  args: Record<string, unknown>
}) {
  switch (input.toolName) {
    case 'search_vendors':
      return searchVendors(input.companyId, String(input.args.query ?? ''))
    case 'create_expense_draft':
      return createExpenseDraft({
        organizationId: input.organizationId,
        companyId: input.companyId,
        userId: input.userId,
        payload: (input.args.payload as Record<string, unknown>) ?? {},
      })
    case 'attach_document_to_draft':
      return attachDocumentToDraft(input.companyId, String(input.args.draftId), String(input.args.documentId))
    case 'validate_draft':
      return validateDraft(input.companyId, String(input.args.draftId))
    case 'submit_for_approval':
      return submitDraftForApproval(input.companyId, String(input.args.draftId), input.userId)
    case 'approve_and_post':
      return approveAndPostDraft(input.companyId, String(input.args.draftId), input.userId)
    case 'get_company_summary':
      return getCompanySummary(input.companyId, input.args.dateRange as any)
    default:
      throw new Error(`Unsupported tool: ${input.toolName}`)
  }
}
