import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getCompanyWhereFilter, getRouteAuth } from '@/lib/auth'

const normalizeDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
}

const getYearBounds = (year: number) => ({
  start: new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)),
  end: new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0, 0)),
})

const ensureAdmin = (role?: string | null) => role === 'ADMIN'

export async function GET(request: Request) {
  try {
    const { user, dbUser } = await getRouteAuth()
    if (!user || !dbUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const companyId = url.searchParams.get('companyId')
    const yearParam = url.searchParams.get('year')

    if (!companyId) {
      return NextResponse.json({ success: false, error: 'companyId is required' }, { status: 400 })
    }

    const scopeFilter = await getCompanyWhereFilter(dbUser)
    const allowedCompanyIds = (scopeFilter as { companyId?: { in?: string[] } }).companyId?.in
    if (allowedCompanyIds && !allowedCompanyIds.includes(companyId)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const where: Prisma.CompanyHolidayWhereInput = { companyId }
    if (yearParam) {
      const year = Number(yearParam)
      if (!year || Number.isNaN(year)) {
        return NextResponse.json({ success: false, error: 'Invalid year' }, { status: 400 })
      }
      const { start, end } = getYearBounds(year)
      where.date = { gte: start, lt: end }
    }

    const holidays = await prisma.companyHoliday.findMany({
      where,
      orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
    })

    return NextResponse.json({ success: true, data: holidays })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      return NextResponse.json({
        success: true,
        data: [],
        warning: 'Holiday table unavailable. Run migrations to enable holiday calendar.',
      })
    }
    console.error('Failed to fetch holidays', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch holidays' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { user, dbUser } = await getRouteAuth()
    if (!user || !dbUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (!ensureAdmin(dbUser.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { companyId, date, name, isOptional } = body as {
      companyId?: string
      date?: string
      name?: string
      isOptional?: boolean
    }

    if (!companyId || !date || !name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'companyId, date, and name are required' },
        { status: 400 }
      )
    }

    const normalizedDate = normalizeDate(date)

    const holiday = await prisma.companyHoliday.create({
      data: {
        companyId,
        date: normalizedDate,
        name: name.trim(),
        isOptional: Boolean(isOptional),
      },
    })

    return NextResponse.json({ success: true, data: holiday }, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'A holiday already exists for this company and date.' },
        { status: 409 }
      )
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      return NextResponse.json(
        { success: false, error: 'Holiday table unavailable. Run migrations first.' },
        { status: 400 }
      )
    }
    console.error('Failed to create holiday', error)
    return NextResponse.json({ success: false, error: 'Failed to create holiday' }, { status: 500 })
  }
}
