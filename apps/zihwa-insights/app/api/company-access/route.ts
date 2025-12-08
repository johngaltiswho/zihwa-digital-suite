import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { CompanyRole } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { userId: targetUserId, companyId, role } = body as {
      userId?: string
      companyId?: string
      role?: string
    }

    if (!targetUserId || !companyId) {
      return NextResponse.json({ success: false, error: 'User and company are required' }, { status: 400 })
    }

    const normalizedRole: CompanyRole =
      role && Object.values(CompanyRole).includes(role as CompanyRole)
        ? (role as CompanyRole)
        : CompanyRole.VIEWER

    const access = await prisma.companyAccess.upsert({
      where: { userId_companyId: { userId: targetUserId, companyId } },
      update: { role: normalizedRole },
      create: {
        userId: targetUserId,
        companyId,
        role: normalizedRole,
      },
      include: { company: true, user: true },
    })

    return NextResponse.json({ success: true, data: access }, { status: 201 })
  } catch (error) {
    console.error('Failed to assign user to company', error)
    return NextResponse.json({ success: false, error: 'Failed to assign user to company' }, { status: 500 })
  }
}
