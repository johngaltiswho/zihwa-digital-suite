import { NextResponse } from 'next/server'
import { AttendanceStatus, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getRouteAuth, getCompanyWhereFilter } from '@/lib/auth'

const normalizeDate = (value: string | Date) => {
  if (typeof value === 'string') {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(Date.UTC(year, month - 1, day))
  }
  const date = new Date(value)
  date.setUTCHours(0, 0, 0, 0)
  return date
}

const balanceConsumption = (status?: AttendanceStatus | null) => ({
  el: status === 'EL' ? 1 : 0,
  sl: status === 'SL' ? 1 : 0,
})

const isHalfDay = (status?: AttendanceStatus | null) => status === 'HALF_DAY'

type CompOffLedgerStatus = 'OPEN' | 'PARTIALLY_USED' | 'EXPIRED' | 'CLOSED'

const COMP_OFF_OPEN_STATUSES: CompOffLedgerStatus[] = ['OPEN', 'PARTIALLY_USED']

const computeLedgerStatus = (earnedDays: number, usedDays: number, expiresOn: Date, asOf: Date): CompOffLedgerStatus => {
  const remaining = Math.max(earnedDays - usedDays, 0)
  if (remaining <= 0) return 'CLOSED'
  if (expiresOn < asOf) return 'EXPIRED'
  if (usedDays > 0) return 'PARTIALLY_USED'
  return 'OPEN'
}

async function expireCompOffEntries(
  tx: Prisma.TransactionClient,
  employeeId: string,
  asOf: Date
) {
  await tx.compOffLedger.updateMany({
    where: {
      employeeId,
      status: { in: COMP_OFF_OPEN_STATUSES },
      expiresOn: { lt: asOf },
    },
    data: { status: 'EXPIRED' },
  })
}

async function getAvailableCompOffDays(
  tx: Prisma.TransactionClient,
  employeeId: string,
  asOf: Date
) {
  const ledgers = await tx.compOffLedger.findMany({
    where: {
      employeeId,
      status: { in: COMP_OFF_OPEN_STATUSES },
      expiresOn: { gte: asOf },
    },
    select: { earnedDays: true, usedDays: true },
  })

  return ledgers.reduce((sum, ledger) => sum + Math.max(ledger.earnedDays - ledger.usedDays, 0), 0)
}

async function consumeCompOffDays(
  tx: Prisma.TransactionClient,
  employeeId: string,
  days: number,
  asOf: Date
) {
  if (days <= 0) return 0

  const ledgers = await tx.compOffLedger.findMany({
    where: {
      employeeId,
      status: { in: COMP_OFF_OPEN_STATUSES },
      expiresOn: { gte: asOf },
    },
    orderBy: [{ expiresOn: 'asc' }, { sourceDate: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      earnedDays: true,
      usedDays: true,
      expiresOn: true,
    },
  })

  let remaining = days
  for (const ledger of ledgers) {
    if (remaining <= 0) break
    const available = Math.max(ledger.earnedDays - ledger.usedDays, 0)
    if (available <= 0) continue
    const consume = Math.min(available, remaining)
    const nextUsed = ledger.usedDays + consume
    await tx.compOffLedger.update({
      where: { id: ledger.id },
      data: {
        usedDays: nextUsed,
        status: computeLedgerStatus(ledger.earnedDays, nextUsed, ledger.expiresOn, asOf),
      },
    })
    remaining -= consume
  }

  return days - remaining
}

async function releaseCompOffDays(
  tx: Prisma.TransactionClient,
  employeeId: string,
  days: number,
  asOf: Date
) {
  if (days <= 0) return 0

  const ledgers = await tx.compOffLedger.findMany({
    where: {
      employeeId,
      usedDays: { gt: 0 },
    },
    orderBy: [{ expiresOn: 'desc' }, { sourceDate: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      earnedDays: true,
      usedDays: true,
      expiresOn: true,
    },
  })

  let remaining = days
  for (const ledger of ledgers) {
    if (remaining <= 0) break
    const release = Math.min(ledger.usedDays, remaining)
    const nextUsed = Math.max(ledger.usedDays - release, 0)
    await tx.compOffLedger.update({
      where: { id: ledger.id },
      data: {
        usedDays: nextUsed,
        status: computeLedgerStatus(ledger.earnedDays, nextUsed, ledger.expiresOn, asOf),
      },
    })
    remaining -= release
  }

  return days - remaining
}

async function ensureCompanyAccess(employeeId: string, dbUser: { id: string; role: string } | null) {
  if (!dbUser) return false
  if (dbUser.role !== 'ACCOUNTANT') return true

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { companyId: true },
  })

  if (!employee) return false

  const access = await prisma.companyAccess.findFirst({
    where: {
      userId: dbUser.id,
      companyId: employee.companyId,
    },
    select: { id: true },
  })

  return Boolean(access)
}

// GET /api/employees/attendance?month=YYYY-MM
export async function GET(request: Request) {
  const url = new URL(request.url)
  const monthParam = url.searchParams.get('month')
  const baseDate = monthParam ? new Date(`${monthParam}-01T00:00:00`) : new Date()
  const start = new Date(baseDate)
  start.setDate(1)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setMonth(end.getMonth() + 1)

  try {
    const { user, dbUser } = await getRouteAuth()
    if (!user || !dbUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const scopeFilter = await getCompanyWhereFilter(dbUser)
    const employeeFilter = scopeFilter.companyId
      ? { employee: { companyId: scopeFilter.companyId } }
      : {}

    const records = await prisma.attendanceRecord.findMany({
      where: {
        date: { gte: start, lt: end },
        ...employeeFilter,
      },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      include: {
        employee: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
            department: true,
          },
        },
      },
    })

    const grouped = records.reduce<Record<string, typeof records>>((acc, record) => {
      const key = record.date.toISOString().split('T')[0]
      acc[key] = acc[key] ? [...acc[key], record] : [record]
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data: {
        start,
        end,
        grouped,
        records: records.map((record) => ({
          ...record,
          resolvedStatus: record.status,
        })),
      },
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      return NextResponse.json({
        success: true,
        data: {
          start,
          end,
          grouped: {},
          records: [],
        },
      })
    }
    console.error('Failed to fetch attendance records', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch attendance records',
      },
      { status: 500 }
    )
  }
}

// POST /api/employees/attendance - create/update a record for a day
export async function POST(request: Request) {
  try {
    const { user, dbUser } = await getRouteAuth()
    if (!user || !dbUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { employeeId, date, status, checkIn, checkOut, notes } = body

    if (!employeeId || !date) {
      return NextResponse.json(
        { success: false, error: 'employeeId and date are required' },
        { status: 400 }
      )
    }

    const hasAccess = await ensureCompanyAccess(employeeId, dbUser)
    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    let parsedStatus: AttendanceStatus | undefined
    if (status) {
      if (!Object.values(AttendanceStatus).includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid attendance status' },
          { status: 400 }
        )
      }
      parsedStatus = status
    }

    const normalizedDate = normalizeDate(date)

    try {
      const result = await prisma.$transaction(async (tx) => {
        const policyWarnings: string[] = []

        const existingRecord = await tx.attendanceRecord.findUnique({
          where: {
            employeeId_date: {
              employeeId,
              date: normalizedDate,
            },
          },
          select: { id: true, status: true },
        })

        const employee = await tx.employee.findUnique({
          where: { id: employeeId },
          select: { elBalance: true, slBalance: true, coBalance: true },
        })

        if (!employee) {
          throw new Error('Employee not found')
        }

        let elBalance = employee.elBalance ?? 0
        let slBalance = employee.slBalance ?? 0
        let coBalance = employee.coBalance ?? 0

        if (existingRecord) {
          const refunds = balanceConsumption(existingRecord.status)
          elBalance += refunds.el
          slBalance += refunds.sl
        }

        await expireCompOffEntries(tx, employeeId, normalizedDate)

        if (existingRecord?.status === AttendanceStatus.CO) {
          const released = await releaseCompOffDays(tx, employeeId, 1, normalizedDate)
          coBalance += released
        }

        let resolvedStatus: AttendanceStatus =
          parsedStatus ?? existingRecord?.status ?? AttendanceStatus.PRESENT

        if (!isHalfDay(resolvedStatus)) {
          if (resolvedStatus === AttendanceStatus.EL && elBalance < 1) {
            resolvedStatus = AttendanceStatus.ABSENT
            policyWarnings.push('EL balance unavailable. Marked as ABSENT (unpaid).')
          }
          if (resolvedStatus === AttendanceStatus.SL && slBalance < 1) {
            resolvedStatus = AttendanceStatus.ABSENT
            policyWarnings.push('SL balance unavailable. Marked as ABSENT (unpaid).')
          }
          if (resolvedStatus === AttendanceStatus.CO) {
            const availableCompOff = await getAvailableCompOffDays(tx, employeeId, normalizedDate)
            if (availableCompOff < 1) {
              resolvedStatus = AttendanceStatus.ABSENT
              policyWarnings.push('Comp-off balance unavailable. Marked as ABSENT (unpaid).')
            }
          }
        }

        const consumption = balanceConsumption(resolvedStatus)
        elBalance -= consumption.el
        slBalance -= consumption.sl

        if (resolvedStatus === AttendanceStatus.CO) {
          const consumed = await consumeCompOffDays(tx, employeeId, 1, normalizedDate)
          if (consumed < 1) {
            resolvedStatus = AttendanceStatus.ABSENT
            policyWarnings.push('Comp-off balance unavailable. Marked as ABSENT (unpaid).')
          } else {
            coBalance = Math.max(coBalance - consumed, 0)
          }
        }

        const availableAfter = await getAvailableCompOffDays(tx, employeeId, normalizedDate)
        coBalance = availableAfter

        const baseData: Prisma.AttendanceRecordUncheckedUpdateInput = {
          status: resolvedStatus,
          checkIn: checkIn ? new Date(checkIn) : null,
          checkOut: checkOut ? new Date(checkOut) : null,
          notes: notes || null,
        }

        const record = existingRecord && existingRecord.id
          ? await tx.attendanceRecord.update({
              where: { id: existingRecord.id },
              data: baseData,
              include: {
                employee: {
                  select: {
                    id: true,
                    employeeId: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            })
          : await tx.attendanceRecord.create({
              data: {
                employeeId,
                date: normalizedDate,
                status: resolvedStatus,
                checkIn: checkIn ? new Date(checkIn) : null,
                checkOut: checkOut ? new Date(checkOut) : null,
                notes: notes || null,
              },
              include: {
                employee: {
                  select: {
                    id: true,
                    employeeId: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            })

        await tx.employee.update({
          where: { id: employeeId },
          data: {
            elBalance,
            slBalance,
            coBalance,
          },
        })

        return {
          record,
          resolvedStatus,
          policyWarnings,
        }
      })

      return NextResponse.json({ success: true, data: result })
    } catch (error) {
      if (error instanceof Error && error.message === 'Employee not found') {
        return NextResponse.json({ success: false, error: error.message }, { status: 404 })
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
        return NextResponse.json(
          { success: false, error: 'Attendance tracking tables are not configured yet.' },
          { status: 400 }
        )
      }

      console.error('Failed to upsert attendance record', error)
      return NextResponse.json(
        { success: false, error: 'Failed to save attendance record' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Failed to upsert attendance record', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save attendance record' },
      { status: 500 }
    )
  }
}
