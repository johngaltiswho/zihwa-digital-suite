import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getRouteAuth } from '@/lib/auth'

const ensureAdmin = (role?: string | null) => role === 'ADMIN'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, dbUser } = await getRouteAuth()
    if (!user || !dbUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (!ensureAdmin(dbUser.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json({ success: false, error: 'Holiday id is required' }, { status: 400 })
    }

    await prisma.companyHoliday.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Holiday not found' }, { status: 404 })
    }
    console.error('Failed to delete holiday', error)
    return NextResponse.json({ success: false, error: 'Failed to delete holiday' }, { status: 500 })
  }
}
