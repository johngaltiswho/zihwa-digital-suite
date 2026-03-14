import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { getRouteAuth } from '@/lib/auth'

export async function GET() {
  try {
    const { user } = await getRouteAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
    const { user } = await getRouteAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
// ✅ DELETE — removes a user and all their company accesses
export async function DELETE(request: NextRequest) {
  try {
    const { user } = await getRouteAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'User id is required' }, { status: 400 })
    }

    // ✅ Fetch both the requester and target user roles
    const [requestingUser, targetUser] = await Promise.all([
      prisma.user.findUnique({ where: { id: user.id }, select: { role: true } }),
      prisma.user.findUnique({ where: { id }, select: { role: true } }),
    ])

    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Nobody can delete an ADMIN
    if (targetUser.role === 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Cannot delete an ADMIN user' }, { status: 403 })
    }

    // HR can only delete CONSULTANT and ACCOUNTANT
    if (requestingUser?.role === 'HR' && targetUser.role !== 'CONSULTANT' && targetUser.role !== 'ACCOUNTANT') {
      return NextResponse.json({ success: false, error: 'HR can only delete CONSULTANT or ACCOUNTANT users' }, { status: 403 })
    }

    // Delete company accesses first, then the user
    await prisma.companyAccess.deleteMany({ where: { userId: id } })
    await prisma.user.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete user', error)
    return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 })
  }
}










