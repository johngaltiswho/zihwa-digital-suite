import { NextRequest, NextResponse } from 'next/server'
import { prisma, hasTokens, deleteTokens } from '@repo/db'
import { requireCompanyPermission } from '@/lib/authz'

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ companyId: string }> }
): Promise<Response> {
  const { companyId } = await context.params
  const auth = await requireCompanyPermission(companyId, 'integration.manage')
  if (!('user' in auth)) return auth.error

  const connection = await prisma.integrationConnection.findUnique({
    where: {
      companyId_provider: {
        companyId,
        provider: 'ZOHO_BOOKS',
      },
    },
  })

  return NextResponse.json({ success: true, data: connection })
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ companyId: string }> }
): Promise<Response> {
  const { companyId } = await context.params
  const auth = await requireCompanyPermission(companyId, 'integration.manage')
  if (!('user' in auth)) return auth.error
  const userId = auth.user?.id
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const action = String(body.action ?? '')

  if (action === 'connect') {
    const externalOrgId = String(body.externalOrgId ?? '').trim()
    if (!externalOrgId) {
      return NextResponse.json({ success: false, error: 'externalOrgId is required' }, { status: 400 })
    }

    const tokenExists = await hasTokens(externalOrgId)
    if (!tokenExists) {
      return NextResponse.json({
        success: false,
        error: 'No OAuth token found for this Zoho org. Complete /api/zoho/authorize first.',
      }, { status: 400 })
    }

    const connection = await prisma.integrationConnection.upsert({
      where: {
        companyId_provider: {
          companyId,
          provider: 'ZOHO_BOOKS',
        },
      },
      create: {
        companyId,
        provider: 'ZOHO_BOOKS',
        status: 'CONNECTED',
        externalOrgId,
        metadata: {
          connectedBy: userId,
        },
        lastSyncedAt: new Date(),
      },
      update: {
        status: 'CONNECTED',
        externalOrgId,
        metadata: {
          connectedBy: userId,
        },
        lastSyncedAt: new Date(),
        error: null,
      },
    })

    return NextResponse.json({ success: true, data: connection })
  }

  if (action === 'disconnect') {
    const existing = await prisma.integrationConnection.findUnique({
      where: {
        companyId_provider: {
          companyId,
          provider: 'ZOHO_BOOKS',
        },
      },
    })

    if (existing?.externalOrgId) {
      await deleteTokens(existing.externalOrgId)
    }

    const connection = await prisma.integrationConnection.upsert({
      where: {
        companyId_provider: {
          companyId,
          provider: 'ZOHO_BOOKS',
        },
      },
      create: {
        companyId,
        provider: 'ZOHO_BOOKS',
        status: 'DISCONNECTED',
      },
      update: {
        status: 'DISCONNECTED',
        error: null,
      },
    })

    return NextResponse.json({ success: true, data: connection })
  }

  return NextResponse.json({ success: false, error: 'Unsupported action' }, { status: 400 })
}
