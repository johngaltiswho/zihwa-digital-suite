import { NextRequest, NextResponse } from 'next/server'
import {
  getTokens,
  refreshAndStoreTokens,
  updateDocument,
  getActiveAccountingContext,
} from '@repo/db'
import { postExpense, postPurchase, postVendorCredit } from '@repo/connector-zoho-books'
import { AccountingContextSchema, type ExpenseData, type PurchaseData } from '@repo/ledger-core'
import { requireDocumentPermission } from '@/lib/authz'
import { getCompanyZohoConnection } from '@/lib/zoho/company-connection'

type DocumentRouteContext = {
  params: Promise<{
    id: string
  }>
}

function normalizeExtractedData(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== 'object') return {}
  const payload = raw as Record<string, unknown>
  const nested = payload.data
  if (nested && typeof nested === 'object') {
    return nested as Record<string, unknown>
  }
  return payload
}

function ensurePurchaseLineItems(data: PurchaseData): PurchaseData {
  if (Array.isArray(data.lineItems) && data.lineItems.length > 0) {
    return data
  }

  const amount = Number(data.amount || 0)
  const taxAmount = Number(data.taxAmount || 0)
  const taxableSubtotal = amount > 0 ? Math.max(amount - taxAmount, 0) : 0
  const fallbackAmount = taxableSubtotal > 0 ? taxableSubtotal : amount

  if (!fallbackAmount || !Number.isFinite(fallbackAmount)) {
    return data
  }

  const description =
    (typeof data.description === 'string' && data.description.trim()) ||
    (typeof data.billNumber === 'string' && data.billNumber.trim()
      ? `Invoice ${data.billNumber.trim()}`
      : '') ||
    'Invoice item'

  return {
    ...data,
    lineItems: [
      {
        description,
        quantity: 1,
        rate: fallbackAmount,
        amount: fallbackAmount,
      },
    ],
  }
}

export async function POST(request: NextRequest, context: DocumentRouteContext): Promise<Response> {
  const { id } = await context.params

  try {
    const auth = await requireDocumentPermission(id, 'draft.approve')
    if (!('user' in auth)) return auth.error

    const scoped = auth as {
      document: {
        id: string
        status: string
        companyId: string | null
        documentType: 'EXPENSE' | 'PURCHASE' | 'INVOICE' | 'CREDIT_NOTE'
        extractedData: unknown
      }
    }
    const doc = scoped.document

    const allowedStatuses = new Set(['EXTRACTED', 'FAILED'])
    if (!allowedStatuses.has(doc.status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Document not ready for posting. Current status: ${doc.status}. Allowed: EXTRACTED, FAILED`,
        },
        { status: 400 }
      )
    }

    if (doc.companyId) {
      const activeContext = await getActiveAccountingContext(doc.companyId)
      if (!activeContext) {
        return NextResponse.json(
          { success: false, error: 'Company accounting context is missing. Activate context first.' },
          { status: 409 }
        )
      }

      const parsed = AccountingContextSchema.safeParse(activeContext.context)
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: 'Company context is incomplete. Complete context wizard before posting.' },
          { status: 409 }
        )
      }
    }

    const body = await request.json()
    let orgId = String(body.orgId ?? '').trim() || null
    const accountId = body.accountId ? String(body.accountId) : ''
    const vendorId = body.vendorId ? String(body.vendorId) : ''

    let accessToken = ''

    if (doc.companyId) {
      const companyConnection = await getCompanyZohoConnection(doc.companyId)
      if (companyConnection) {
        orgId = companyConnection.orgId
        accessToken = companyConnection.tokens.accessToken
      }
    }

    if (!orgId) {
      return NextResponse.json(
        { success: false, error: 'Zoho org is not connected for this company. Set integration first.' },
        { status: 400 }
      )
    }

    if (!accessToken) {
      const tokens = await getTokens(orgId)
      if (!tokens) {
        return NextResponse.json(
          {
            success: false,
            error: 'Not connected to Zoho. Please connect via /api/zoho/authorize',
          },
          { status: 401 }
        )
      }

      const expiresIn = (tokens.expiresAt.getTime() - Date.now()) / 1000
      accessToken = tokens.accessToken

      if (expiresIn < 300) {
        const config = {
          clientId: process.env.ZOHO_CLIENT_ID!,
          clientSecret: process.env.ZOHO_CLIENT_SECRET!,
          redirectUri: process.env.ZOHO_REDIRECT_URI!,
          region: process.env.ZOHO_REGION as 'in' | 'com' | 'eu' | 'com.au' | 'jp',
        }

        const refreshed = await refreshAndStoreTokens(orgId, tokens.refreshToken, config)
        accessToken = refreshed.accessToken
      }
    }

    try {
      let result
      const extracted = normalizeExtractedData(doc.extractedData)

      if (doc.documentType === 'EXPENSE') {
        if (!accountId) {
          return NextResponse.json(
            { success: false, error: 'accountId is required for expenses' },
            { status: 400 }
          )
        }

        const expenseData: ExpenseData = extracted as unknown as ExpenseData

        result = await postExpense(expenseData, orgId, accessToken, undefined, {
          accountId,
        })
      } else if (doc.documentType === 'PURCHASE' || doc.documentType === 'CREDIT_NOTE') {
        if (!vendorId) {
          return NextResponse.json(
            { success: false, error: 'vendorId is required for purchases/credit notes' },
            { status: 400 }
          )
        }

        const parsedPurchase = extracted as unknown as PurchaseData
        const purchaseData = ensurePurchaseLineItems(parsedPurchase)

        if (doc.documentType === 'CREDIT_NOTE') {
          result = await postVendorCredit(purchaseData, orgId, accessToken, undefined, {
            vendorId,
          })
        } else {
          result = await postPurchase(purchaseData, orgId, accessToken, undefined, {
            vendorId,
          })
        }
      } else {
        return NextResponse.json(
          {
            success: false,
            error: `Unsupported document type: ${doc.documentType}`,
          },
          { status: 400 }
        )
      }

      await updateDocument(id, {
        status: result.success ? 'POSTED' : 'FAILED',
        zohoVoucherId: result.externalRef,
        zohoOrgId: orgId,
        postingResult: result as unknown as Record<string, unknown>,
        processedAt: new Date(),
        error: result.error,
      })

      if (!result.success) {
        console.error('Zoho post failed', {
          documentId: id,
          documentType: doc.documentType,
          orgId,
          accountId: accountId || undefined,
          vendorId: vendorId || undefined,
          error: result.error,
        })
      }

      return NextResponse.json({
        success: result.success,
        data: {
          voucherId: id,
          zohoVoucherId: result.externalRef,
          status: result.success ? 'POSTED' : 'FAILED',
          postedAt: new Date(),
          error: result.error,
        },
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to post to Zoho Books'
      await updateDocument(id, {
        status: 'FAILED',
        error: message,
      })

      return NextResponse.json(
        {
          success: false,
          error: `Failed to post to Zoho: ${message}`,
        },
        { status: 500 }
      )
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    console.error('Post endpoint error:', error)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
