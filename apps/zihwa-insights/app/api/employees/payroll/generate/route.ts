import { NextResponse } from 'next/server'
import { AttendanceStatus, PayrollStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

const PAYABLE_STATUSES = new Set<AttendanceStatus>(['PRESENT', 'REMOTE', 'LEAVE', 'EL', 'SL'])

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyId, month, year } = body as { companyId?: string; month?: number; year?: number }

    if (!companyId || !month || !year) {
      return NextResponse.json(
        { success: false, error: 'companyId, month, and year are required' },
        { status: 400 }
      )
    }

    const monthNumber = Number(month)
    const yearNumber = Number(year)

    if (!monthNumber || !yearNumber) {
      return NextResponse.json({ success: false, error: 'Invalid month or year' }, { status: 400 })
    }

    const employees = await prisma.employee.findMany({
      where: { companyId },
      select: {
        id: true,
        netSalary: true,
        grossSalary: true,
      },
    })

    if (employees.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No employees found for this company.' },
        { status: 404 }
      )
    }

    const employeeIds = employees.map((employee) => employee.id)
    const start = new Date(Date.UTC(yearNumber, monthNumber - 1, 1))
    const end = new Date(Date.UTC(yearNumber, monthNumber, 1))

    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: {
        employeeId: { in: employeeIds },
        date: {
          gte: start,
          lt: end,
        },
      },
      select: {
        employeeId: true,
        date: true,
        status: true,
      },
    })

    const existingPayroll = await prisma.payrollRecord.findMany({
      where: {
        employeeId: { in: employeeIds },
        month: monthNumber,
        year: yearNumber,
      },
      select: {
        id: true,
        employeeId: true,
        status: true,
      },
    })

    const attendanceMap = new Map<string, AttendanceStatus>()
    attendanceRecords.forEach((record) => {
      const key = `${record.employeeId}-${record.date.toISOString().split('T')[0]}`
      attendanceMap.set(key, record.status)
    })

    const existingPayrollMap = new Map(existingPayroll.map((record) => [record.employeeId, record]))
    const totalDaysInMonth = new Date(yearNumber, monthNumber, 0).getDate()

    let created = 0
    let updated = 0
    let skipped = 0

    const operations = []

    for (const employee of employees) {
      const existing = existingPayrollMap.get(employee.id)
      if (existing && existing.status === 'PAID') {
        skipped += 1
        continue
      }

      let paidDays = 0
      let unpaidDays = 0

      for (let day = 1; day <= totalDaysInMonth; day += 1) {
        const isoDate = new Date(Date.UTC(yearNumber, monthNumber - 1, day)).toISOString().split('T')[0]
        const status = attendanceMap.get(`${employee.id}-${isoDate}`)
        if (status) {
          if (PAYABLE_STATUSES.has(status)) {
            paidDays += 1
          } else {
            unpaidDays += 1
          }
        } else {
          unpaidDays += 1
        }
      }

      const grossBase = employee.grossSalary ?? employee.netSalary ?? 0
      const netBase = employee.netSalary ?? grossBase

      const perDayGross = totalDaysInMonth > 0 ? grossBase / totalDaysInMonth : 0
      const perDayNet = totalDaysInMonth > 0 ? netBase / totalDaysInMonth : 0

      const grossAmount = Math.round(perDayGross * paidDays)
      const netAmount = Math.round(perDayNet * paidDays)
      const deductions = Math.round(perDayNet * unpaidDays)

      operations.push(
        prisma.payrollRecord.upsert({
          where: {
            employeeId_month_year: {
              employeeId: employee.id,
              month: monthNumber,
              year: yearNumber,
            },
          },
          create: {
            employeeId: employee.id,
            month: monthNumber,
            year: yearNumber,
            grossAmount,
            netAmount,
            bonus: 0,
            deductions,
            status: PayrollStatus.PENDING,
          },
          update: {
            grossAmount,
            netAmount,
            deductions,
          },
        })
      )

      if (existing) {
        updated += 1
      } else {
        created += 1
      }
    }

    if (operations.length > 0) {
      await prisma.$transaction(operations)
    }

    return NextResponse.json({
      success: true,
      summary: {
        created,
        updated,
        skipped,
        processed: created + updated,
      },
    })
  } catch (error) {
    console.error('Failed to generate payroll', error)
    return NextResponse.json({ success: false, error: 'Failed to generate payroll' }, { status: 500 })
  }
}
