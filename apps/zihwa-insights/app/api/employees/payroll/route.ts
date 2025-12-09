import { NextResponse } from 'next/server'
import { PayrollStatus, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

// GET /api/employees/payroll?month=MM&year=YYYY
export async function GET(request: Request) {
  const url = new URL(request.url)
  const monthParam = url.searchParams.get('month')
  const yearParam = url.searchParams.get('year')

  const where: Prisma.PayrollRecordWhereInput = {}
  if (monthParam) where.month = Number(monthParam)
  if (yearParam) where.year = Number(yearParam)

  try {
    const records = await prisma.payrollRecord.findMany({
      where,
      orderBy: [{ year: 'desc' }, { month: 'desc' }, { createdAt: 'desc' }],
      include: {
        employee: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
            department: true,
            companyId: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: records })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      return NextResponse.json({
        success: true,
        data: [],
        warning: 'Payroll tables unavailable. Run migrations to enable payroll tracking.',
      })
    }
    console.error('Failed to fetch payroll records', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch payroll records' }, { status: 500 })
  }
}

// POST /api/employees/payroll - create/update payroll record
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      employeeId,
      month,
      year,
      grossAmount,
      netAmount,
      bonus = 0,
      deductions = 0,
      status,
      processedAt,
      notes,
    } = body

    if (!employeeId || !month || !year || grossAmount === undefined || netAmount === undefined) {
      return NextResponse.json(
        { success: false, error: 'employeeId, month, year, grossAmount and netAmount are required' },
        { status: 400 }
      )
    }

    let parsedStatus: PayrollStatus | undefined = undefined
    if (status) {
      if (!Object.values(PayrollStatus).includes(status)) {
        return NextResponse.json({ success: false, error: 'Invalid payroll status' }, { status: 400 })
      }
      parsedStatus = status
    }

    const createData: Prisma.PayrollRecordUncheckedCreateInput = {
      employeeId,
      month: Number(month),
      year: Number(year),
      grossAmount: Number(grossAmount),
      netAmount: Number(netAmount),
      bonus: Number(bonus) || 0,
      deductions: Number(deductions) || 0,
      processedAt: processedAt
        ? new Date(processedAt)
        : parsedStatus === PayrollStatus.PAID
          ? new Date()
          : null,
      notes: notes || null,
    }

    const updateData: Prisma.PayrollRecordUncheckedUpdateInput = {
      grossAmount: Number(grossAmount),
      netAmount: Number(netAmount),
      bonus: Number(bonus) || 0,
      deductions: Number(deductions) || 0,
      processedAt: processedAt
        ? new Date(processedAt)
        : parsedStatus === PayrollStatus.PAID
          ? new Date()
          : null,
      notes: notes || null,
    }

    if (parsedStatus) {
      createData.status = parsedStatus
      updateData.status = parsedStatus
    }

    const record = await prisma.payrollRecord.upsert({
      where: {
        employeeId_month_year: {
          employeeId,
          month: Number(month),
          year: Number(year),
        },
      },
      create: createData,
      update: updateData,
      include: {
        employee: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
            companyId: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: record })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      return NextResponse.json(
        { success: false, error: 'Payroll tables unavailable. Run migrations to enable payroll tracking.' },
        { status: 400 }
      )
    }
    console.error('Failed to upsert payroll record', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save payroll record' },
      { status: 500 }
    )
  }
}
