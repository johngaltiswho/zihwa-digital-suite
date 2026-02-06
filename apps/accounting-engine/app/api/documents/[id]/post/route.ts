import { NextRequest, NextResponse } from 'next/server'
import { getDocument, updateDocument, getTokens } from '@repo/db'
import { refreshAndStoreTokens } from '@repo/db'
import { postExpense, postPurchase } from '@repo/connector-zoho-books'
import type { ExpenseData, PurchaseData } from '@repo/ledger-core'

type DocumentRouteContext = {
  params: {
    id: string
  }
}

export async function POST(
  request: NextRequest,
  context: unknown
) {
  const { params } = context as DocumentRouteContext
  try {
    const { orgId, accountId, vendorId } = await request.json()

    if (!orgId) {
      return NextResponse.json(
        { success: false, error: 'orgId is required' },
        { status: 400 }
      )
    }

    // 1. Get document
    const doc = await getDocument(params.id)

    if (!doc) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      )
    }

    if (doc.status !== 'EXTRACTED') {
      return NextResponse.json(
        {
          success: false,
          error: `Document not ready for posting. Current status: ${doc.status}`,
        },
        { status: 400 }
      )
    }

    // 2. Get tokens for orgId
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

    // 3. Check if token needs refresh (< 5 minutes)
    const expiresIn = (tokens.expiresAt.getTime() - Date.now()) / 1000
    let accessToken = tokens.accessToken

    if (expiresIn < 300) {
      console.log('Token expires soon, refreshing...')

      const config = {
        clientId: process.env.ZOHO_CLIENT_ID!,
        clientSecret: process.env.ZOHO_CLIENT_SECRET!,
        redirectUri: process.env.ZOHO_REDIRECT_URI!,
        region: process.env.ZOHO_REGION as 'in' | 'com' | 'eu' | 'com.au' | 'jp',
      }

      try {
        const refreshed = await refreshAndStoreTokens(
          orgId,
          tokens.refreshToken,
          config
        )
        accessToken = refreshed.accessToken
        console.log('Token refreshed successfully')
      } catch (error: any) {
        console.error('Token refresh failed:', error)
        return NextResponse.json(
          {
            success: false,
            error: 'Token refresh failed. Please reconnect your Zoho account.',
          },
          { status: 401 }
        )
      }
    }

    // 4. Post to Zoho Books
    try {
      let result

      if (doc.documentType === 'EXPENSE') {
        if (!accountId) {
          return NextResponse.json(
            { success: false, error: 'accountId is required for expenses' },
            { status: 400 }
          )
        }

        const expenseData: ExpenseData = {
          ...(doc.extractedData as any),
          accountId,
        }

        console.log('Posting expense to Zoho:', JSON.stringify(expenseData, null, 2))

        result = await postExpense(expenseData, orgId, accessToken)
      } else if (doc.documentType === 'PURCHASE') {
        if (!vendorId) {
          return NextResponse.json(
            { success: false, error: 'vendorId is required for purchases' },
            { status: 400 }
          )
        }

        const purchaseData: PurchaseData = {
          ...(doc.extractedData as any),
          vendorId,
        }

        console.log('Posting purchase to Zoho:', JSON.stringify(purchaseData, null, 2))

        result = await postPurchase(purchaseData, orgId, accessToken)
      } else {
        return NextResponse.json(
          {
            success: false,
            error: `Unsupported document type: ${doc.documentType}`,
          },
          { status: 400 }
        )
      }

      console.log('Zoho posting result:', JSON.stringify(result, null, 2))

      // 5. Update document
      await updateDocument(params.id, {
        status: result.success ? 'POSTED' : 'FAILED',
        zohoVoucherId: result.externalRef,
        zohoOrgId: orgId,
        // Prisma JSON field expects a plain object; cast VoucherResult via unknown to satisfy TS
        postingResult: result as unknown as Record<string, unknown>,
        processedAt: new Date(),
        error: result.error,
      })

      // 6. Return result
      return NextResponse.json({
        success: result.success,
        data: {
          voucherId: params.id,
          zohoVoucherId: result.externalRef,
          status: result.success ? 'POSTED' : 'FAILED',
          postedAt: new Date(),
          error: result.error,
        },
      })
    } catch (error: any) {
      console.error('Zoho posting error:', error)

      // Update document with error
      await updateDocument(params.id, {
        status: 'FAILED',
        error: error.message || 'Failed to post to Zoho Books',
      })

      return NextResponse.json(
        {
          success: false,
          error: `Failed to post to Zoho: ${error.message}`,
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Post endpoint error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
