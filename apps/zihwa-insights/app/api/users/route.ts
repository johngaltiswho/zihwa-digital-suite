import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        companyAccesses: {
          include: { company: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error('Failed to fetch users', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { id, role } = body as { id?: string; role?: UserRole }

    if (!id || !role) {
      return NextResponse.json({ success: false, error: 'User id and role are required' }, { status: 400 })
    }

    const normalizedRole: UserRole | undefined = role && Object.values(UserRole).includes(role) ? role : undefined
    if (!normalizedRole) {
      return NextResponse.json({ success: false, error: 'Invalid role provided' }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role: normalizedRole },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Failed to update user role', error)
    return NextResponse.json({ success: false, error: 'Failed to update user role' }, { status: 500 })
  }
}
