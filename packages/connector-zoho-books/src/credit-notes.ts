import type { PurchaseData, VoucherResult } from '@repo/ledger-core'
import { formatDate } from '@repo/ledger-core'
import { ZohoBooksClient } from './client'
import { ZohoConnectorError } from './errors'
import type {
  ZohoPurchaseRequestOptions,
  ZohoVendorCreditRequest,
  ZohoRegion,
} from './types'

function transformCreditNoteData(
  data: PurchaseData,
  options: ZohoPurchaseRequestOptions = {}
): ZohoVendorCreditRequest {
  if (!options.vendorId) {
    throw new ZohoConnectorError(
      'vendorId is required for posting credit notes to Zoho Books',
      'VALIDATION_ERROR',
      400,
      false
    )
  }

  if (!data.lineItems || data.lineItems.length === 0) {
    throw new ZohoConnectorError(
      'At least one line item is required for credit notes',
      'VALIDATION_ERROR',
      400,
      false
    )
  }

  return {
    vendor_id: options.vendorId,
    creditnote_number: data.billNumber,
    reference_number: data.referenceInvoiceNo,
    date: formatDate(data.date),
    currency_code: options.currencyCode || data.currency,
    line_items: data.lineItems.map((item) => ({
      account_id: item.accountId || options.accountId,
      name: item.description,
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      tax_id: item.taxId || options.taxId,
    })),
    notes: [data.description, data.referenceInvoiceNo ? `Ref Invoice: ${data.referenceInvoiceNo}` : undefined]
      .filter(Boolean)
      .join(' | '),
  }
}

export async function postVendorCredit(
  creditData: PurchaseData,
  orgId: string,
  accessToken: string,
  region: ZohoRegion = 'in',
  options: ZohoPurchaseRequestOptions = {}
): Promise<VoucherResult> {
  const startTime = new Date()

  try {
    const payload = transformCreditNoteData(creditData, options)
    const client = new ZohoBooksClient(orgId, accessToken, region)

    const headers: Record<string, string> = {}
    if (options.idempotencyKey) {
      headers['X-Request-Id'] = options.idempotencyKey
    }

    const formData = new URLSearchParams()
    formData.append('JSONString', JSON.stringify(payload))

    const response = await client.post<any>('/vendorcredits', formData.toString(), {
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const creditId = response.vendor_credit?.vendor_credit_id as string

    return {
      success: true,
      voucherId: creditId,
      externalRef: creditId,
      timestamp: startTime,
    }
  } catch (error) {
    let errorMessage = 'Failed to post vendor credit note to Zoho Books'

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
