// Expense posting to Zoho Books

import type { ExpenseData, VoucherResult } from '@repo/ledger-core'
import { formatDate } from '@repo/ledger-core'
import { ZohoBooksClient } from './client'
import { getValidAccessToken, isOrgRegistered } from './oauth'
import { ZohoConnectorError } from './errors'
import type {
  ZohoExpenseRequestOptions,
  ZohoExpenseRequest,
  ZohoApiResponse,
  ZohoRegion,
} from './types'

/**
 * Transform ExpenseData to Zoho Books expense format
 */
function transformExpenseData(
  data: ExpenseData,
  options: ZohoExpenseRequestOptions = {}
): ZohoExpenseRequest {
  const expense: ZohoExpenseRequest = {
    account_id: options.accountId || '', // Required by Zoho
    amount: data.amount,
    date: formatDate(data.date),
    description: data.description,
    currency_code: options.currencyCode || data.currency,
  }

  // Optional fields
  if (data.merchant) {
    expense.reference_number = data.merchant
  }

  if (options.customerId) {
    expense.customer_id = options.customerId
  }

  if (options.projectId) {
    expense.project_id = options.projectId
  }

  if (options.taxId) {
    expense.tax_id = options.taxId
  }

  if (data.taxAmount !== undefined) {
    expense.is_inclusive_tax = true
  }

  return expense
}

/**
 * Post expense to Zoho Books
 *
 * @param expenseData - Expense data from @repo/ledger-core
 * @param orgId - Zoho organization ID
 * @param accessToken - Valid Zoho access token
 * @param region - Zoho region (default: 'in')
 * @param options - Additional options for expense posting
 * @returns VoucherResult with success status and Zoho expense ID
 */
export async function postExpense(
  expenseData: ExpenseData,
  orgId: string,
  accessToken: string,
  region: ZohoRegion = 'in',
  options: ZohoExpenseRequestOptions = {}
): Promise<VoucherResult> {
  const startTime = new Date()

  try {
    // Validate account_id is provided (required by Zoho)
    if (!options.accountId) {
      throw new ZohoConnectorError(
        'accountId is required for posting expenses to Zoho Books',
        'VALIDATION_ERROR',
        400,
        false
      )
    }

    // Transform expense data to Zoho format
    const zohoExpense = transformExpenseData(expenseData, options)

    // Create Zoho Books client
    const client = new ZohoBooksClient(orgId, accessToken, region)

    // Add idempotency key if provided
    const headers: Record<string, string> = {}
    if (options.idempotencyKey) {
      headers['X-Request-Id'] = options.idempotencyKey
    }

    // Post expense to Zoho Books
    // Zoho expects form-urlencoded data
    const formData = new URLSearchParams()
    formData.append('JSONString', JSON.stringify(zohoExpense))

    const response = await client.post<any>(
      '/expenses',
      formData.toString(),
      {
        headers: {
          ...headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
    )

    // Extract expense ID from response
    const expenseId = response.expense?.expense_id as string

    return {
      success: true,
      voucherId: expenseId,
      externalRef: expenseId,
      timestamp: startTime,
    }
  } catch (error) {
    // Handle errors
    let errorMessage = 'Failed to post expense to Zoho Books'

    if (error instanceof ZohoConnectorError) {
      errorMessage = error.message
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
      timestamp: startTime,
    }
  }
}

/**
 * Post expense with automatic token refresh
 * This is a convenience function that handles token management
 *
 * @param expenseData - Expense data from @repo/ledger-core
 * @param orgId - Zoho organization ID
 * @param region - Zoho region (default: 'in')
 * @param options - Additional options for expense posting
 * @returns VoucherResult with success status and Zoho expense ID
 */
export async function postExpenseWithAuth(
  expenseData: ExpenseData,
  orgId: string,
  region: ZohoRegion = 'in',
  options: ZohoExpenseRequestOptions = {}
): Promise<VoucherResult> {
  // Check if org is registered
  if (!isOrgRegistered(orgId)) {
    throw ZohoConnectorError.orgNotRegistered(orgId)
  }

  // Get valid access token (auto-refreshes if needed)
  const accessToken = await getValidAccessToken(orgId)

  // Post expense
  return postExpense(expenseData, orgId, accessToken, region, options)
}
