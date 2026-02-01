// Purchase/Bill posting to Zoho Books

import type { PurchaseData, VoucherResult, LineItem } from '@repo/ledger-core'
import { formatDate } from '@repo/ledger-core'
import { ZohoBooksClient } from './client'
import { getValidAccessToken, isOrgRegistered } from './oauth'
import { ZohoConnectorError } from './errors'
import type {
  ZohoPurchaseRequestOptions,
  ZohoBillRequest,
  ZohoApiResponse,
  ZohoRegion,
} from './types'

/**
 * Transform line items to Zoho format
 */
function transformLineItems(
  lineItems: LineItem[],
  options: ZohoPurchaseRequestOptions = {}
): ZohoBillRequest['line_items'] {
  return lineItems.map((item) => ({
    name: item.description,
    description: item.description,
    rate: item.rate,
    quantity: item.quantity,
    account_id: item.accountId || options.accountId,
    tax_id: item.taxId || options.taxId,
  }))
}

/**
 * Transform PurchaseData to Zoho Books bill format
 */
function transformPurchaseData(
  data: PurchaseData,
  options: ZohoPurchaseRequestOptions = {}
): ZohoBillRequest {
  // Validate required fields
  if (!options.vendorId) {
    throw new ZohoConnectorError(
      'vendorId is required for posting bills to Zoho Books',
      'VALIDATION_ERROR',
      400,
      false
    )
  }

  if (!data.lineItems || data.lineItems.length === 0) {
    throw new ZohoConnectorError(
      'At least one line item is required for bills',
      'VALIDATION_ERROR',
      400,
      false
    )
  }

  const bill: ZohoBillRequest = {
    vendor_id: options.vendorId,
    bill_number: data.billNumber,
    date: formatDate(data.date),
    currency_code: options.currencyCode || data.currency,
    line_items: transformLineItems(data.lineItems, options),
    notes: data.description,
  }

  // Optional fields
  if (data.dueDate) {
    bill.due_date = formatDate(data.dueDate)
  }

  if (options.paymentTerms) {
    bill.payment_terms = options.paymentTerms
  }

  return bill
}

/**
 * Post purchase/bill to Zoho Books
 *
 * @param purchaseData - Purchase data from @repo/ledger-core
 * @param orgId - Zoho organization ID
 * @param accessToken - Valid Zoho access token
 * @param region - Zoho region (default: 'in')
 * @param options - Additional options for purchase posting
 * @returns VoucherResult with success status and Zoho bill ID
 */
export async function postPurchase(
  purchaseData: PurchaseData,
  orgId: string,
  accessToken: string,
  region: ZohoRegion = 'in',
  options: ZohoPurchaseRequestOptions = {}
): Promise<VoucherResult> {
  const startTime = new Date()

  try {
    // Transform purchase data to Zoho format
    const zohoBill = transformPurchaseData(purchaseData, options)

    // Create Zoho Books client
    const client = new ZohoBooksClient(orgId, accessToken, region)

    // Add idempotency key if provided
    const headers: Record<string, string> = {}
    if (options.idempotencyKey) {
      headers['X-Request-Id'] = options.idempotencyKey
    }

    // Post bill to Zoho Books
    // Zoho expects form-urlencoded data
    const formData = new URLSearchParams()
    formData.append('JSONString', JSON.stringify(zohoBill))

    const response = await client.post<any>(
      '/bills',
      formData.toString(),
      {
        headers: {
          ...headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
    )

    // Extract bill ID from response
    const billId = response.bill?.bill_id as string

    return {
      success: true,
      voucherId: billId,
      externalRef: billId,
      timestamp: startTime,
    }
  } catch (error) {
    // Handle errors
    let errorMessage = 'Failed to post bill to Zoho Books'

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
 * Post purchase with automatic token refresh
 * This is a convenience function that handles token management
 *
 * @param purchaseData - Purchase data from @repo/ledger-core
 * @param orgId - Zoho organization ID
 * @param region - Zoho region (default: 'in')
 * @param options - Additional options for purchase posting
 * @returns VoucherResult with success status and Zoho bill ID
 */
export async function postPurchaseWithAuth(
  purchaseData: PurchaseData,
  orgId: string,
  region: ZohoRegion = 'in',
  options: ZohoPurchaseRequestOptions = {}
): Promise<VoucherResult> {
  // Check if org is registered
  if (!isOrgRegistered(orgId)) {
    throw ZohoConnectorError.orgNotRegistered(orgId)
  }

  // Get valid access token (auto-refreshes if needed)
  const accessToken = await getValidAccessToken(orgId)

  // Post purchase
  return postPurchase(purchaseData, orgId, accessToken, region, options)
}
