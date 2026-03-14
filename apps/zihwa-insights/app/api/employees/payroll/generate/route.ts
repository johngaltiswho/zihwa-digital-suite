import { NextResponse } from 'next/server'
import { AttendanceStatus, PayrollStatus, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getCompanyWhereFilter, getRouteAuth } from '@/lib/auth'

const TRIGGER_STATUSES = new Set<AttendanceStatus>(['ABSENT', 'EL', 'SL'])
const HOLIDAY_WORK_STATUSES = new Set<AttendanceStatus>(['PRESENT', 'REMOTE', 'HALF_DAY'])

type AttendanceForCalc = {
  id: string
  status: AttendanceStatus
}

const toIsoDate = (date: Date) => date.toISOString().split('T')[0]

const toUtcDate = (year: number, month: number, day: number) =>
  new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))

const round2 = (value: number) => Math.round(value * 100) / 100

const isSunday = (year: number, month: number, day: number) => toUtcDate(year, month, day).getUTCDay() === 0

const getRemainingCompOff = (earnedDays: number, usedDays: number) =>
  Math.max(round2(earnedDays - usedDays), 0)

export async function POST(request: Request) {
  try {
    const { user, dbUser } = await getRouteAuth()
    if (!user || !dbUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { companyId, month, year } = body as { companyId?: string; month?: number; year?: number }

    if (!companyId || !month || !year) {
      return NextResponse.json(
        { success: false, error: 'companyId, month, and year are required' },
        { status: 400 }
      )
    }

    const scopeFilter = await getCompanyWhereFilter(dbUser)
    const allowedCompanyIds = (scopeFilter as { companyId?: { in?: string[] } }).companyId?.in
    if (allowedCompanyIds && !allowedCompanyIds.includes(companyId)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
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
    const start = toUtcDate(yearNumber, monthNumber, 1)
    const end = toUtcDate(monthNumber === 12 ? yearNumber + 1 : yearNumber, monthNumber === 12 ? 1 : monthNumber + 1, 1)

    const [attendanceRecords, existingPayroll, holidays] = await Promise.all([
      prisma.attendanceRecord.findMany({
        where: {
          employeeId: { in: employeeIds },
          date: { gte: start, lt: end },
        },
        select: {
          id: true,
          employeeId: true,
          date: true,
          status: true,
        },
      }),
      prisma.payrollRecord.findMany({
        where: {
          employeeId: { in: employeeIds },
          month: monthNumber,
          year: yearNumber,
        },
        select: {
          employeeId: true,
          status: true,
        },
      }),
      prisma.companyHoliday.findMany({
        where: {
          companyId,
          date: { gte: start, lt: end },
        },
        select: {
          date: true,
        },
      }),
    ])
    // REPLACE THIS:
// ADD THESE DEBUG LINES:
console.error('=== PAYROLL DEBUG ===')
console.error('companyId:', companyId)
console.error('employees found:', employees.length)
console.error('employeeIds sample:', employeeIds.slice(0, 3))
console.error('date range:', start.toISOString(), 'to', end.toISOString())
console.error('attendanceRecords found:', attendanceRecords.length)
console.error('holidays found:', holidays.length)
if (attendanceRecords.length > 0) {
  console.error('sample attendance:', attendanceRecords[0])
}

// WITH THIS:
console.error('\n=== PAYROLL DEBUG ===')
console.error('companyId:', companyId)
console.error('month/year requested:', monthNumber, yearNumber)
console.error('employees found:', employees.length)
console.error('employeeIds sample:', employeeIds.slice(0, 5))
console.error('date range:', start.toISOString(), 'to', end.toISOString())
console.error('attendanceRecords found:', attendanceRecords.length)
console.error('holidays found:', holidays.length)

if (attendanceRecords.length === 0) {
  console.error('⚠️  NO ATTENDANCE RECORDS FOUND - checking why...')
  // Check if attendance exists for this company employees at ALL (any month)
  const anyAttendance = await prisma.attendanceRecord.findMany({
    where: { employeeId: { in: employeeIds } },
    select: { employeeId: true, date: true, status: true },
    take: 5,
    orderBy: { date: 'desc' },
  })
  console.error('Most recent attendance for these employees (any month):', 
    anyAttendance.map(r => ({ empId: r.employeeId, date: r.date.toISOString().split('T')[0], status: r.status }))
  )
  if (anyAttendance.length === 0) {
    console.error('❌ ZERO attendance records exist for these employee IDs at any date.')
    console.error('   This means attendance was imported under DIFFERENT employee IDs (duplicates exist).')
    console.error('   Check for duplicate employees with the same short code (A8, ZI35, etc.)')
  } else {
    console.error('✅ Attendance EXISTS for these employees but NOT in the requested month/year.')
    console.error('   Requested:', yearNumber, '-', monthNumber)
    console.error('   Most recent attendance date found:', anyAttendance[0]?.date.toISOString().split('T')[0])
    console.error('   ⚠️  You likely generated payroll for the WRONG month!')
  }
} else {
  // Attendance found - show sample
  console.error('✅ Attendance found. Sample records:')
  attendanceRecords.slice(0, 3).forEach(r => {
    console.error(' ', { empId: r.employeeId, date: (r.date as Date).toISOString().split('T')[0], status: r.status })
  })
  // Check if attendance employee IDs match our employee IDs
  const attendanceEmpIds = new Set(attendanceRecords.map(r => r.employeeId))
  const ourEmpIds = new Set(employeeIds)
  const matched = [...attendanceEmpIds].filter(id => ourEmpIds.has(id))
  const unmatched = [...attendanceEmpIds].filter(id => !ourEmpIds.has(id))
  console.error(`Attendance empIds that match our employees: ${matched.length}/${attendanceEmpIds.size}`)
  if (unmatched.length > 0) {
    console.error('❌ Attendance empIds NOT in our employee list (orphaned):', unmatched.slice(0, 5))
  }
}

    const attendanceByEmployee = new Map<string, Map<string, AttendanceForCalc>>()
    for (const record of attendanceRecords) {
      const key = toIsoDate(record.date)
      const byDate = attendanceByEmployee.get(record.employeeId) ?? new Map<string, AttendanceForCalc>()
      byDate.set(key, { id: record.id, status: record.status })
      attendanceByEmployee.set(record.employeeId, byDate)
    }
   // REPLACE THIS:
console.error('=== MAP DEBUG ===')
console.error('map size (unique employees in attendance):', attendanceByEmployee.size)
console.error('map keys sample:', [...attendanceByEmployee.keys()].slice(0, 3))
console.error('employee ids sample:', employees.map(e => e.id).slice(0, 3))
console.error('first employee in map?:', attendanceByEmployee.has(employees[0]?.id))

// WITH THIS:
console.error('\n=== MAP DEBUG ===')
console.error('map size (unique employees with attendance):', attendanceByEmployee.size)

if (attendanceByEmployee.size === 0 && attendanceRecords.length > 0) {
  console.error('❌ CRITICAL: attendance records exist but map is empty!')
  console.error('   This should never happen - likely a code bug in map building.')
} else if (attendanceByEmployee.size === 0) {
  console.error('❌ Map is empty because no attendance records were found (see above).')
} else {
  console.error('Map employee IDs (first 3):', [...attendanceByEmployee.keys()].slice(0, 3))
  console.error('Our employee IDs   (first 3):', employees.map(e => e.id).slice(0, 3))
  
  let matchCount = 0
  const missingList: string[] = []
  for (const emp of employees) {
    if (attendanceByEmployee.has(emp.id)) {
      matchCount++
    } else {
      missingList.push(`${emp.id} (no attendance data)`)
    }
  }
  console.error(`Employees WITH attendance in map: ${matchCount}/${employees.length}`)
  if (missingList.length > 0) {
    console.error('Employees MISSING from map (first 5):', missingList.slice(0, 5))
  }
}

// === CROSS-CHECK ===
console.error('\n=== CROSS-CHECK ===')
const employeeIdSet = new Set(employeeIds)
const orphanedAttendance = attendanceRecords.filter((r: { employeeId: string }) => !employeeIdSet.has(r.employeeId))
console.error('Orphaned attendance records (belong to unknown employees):', orphanedAttendance.length)
if (orphanedAttendance.length > 0) {
  console.error('Sample orphaned empIds:', [...new Set(orphanedAttendance.map((r: { employeeId: string }) => r.employeeId))].slice(0, 5))
}
console.error('===================\n')


    const holidaySet = new Set(holidays.map((holiday) => toIsoDate(holiday.date)))
    const existingPayrollMap = new Map(existingPayroll.map((record) => [record.employeeId, record]))
    const totalDaysInMonth = new Date(Date.UTC(yearNumber, monthNumber, 0)).getUTCDate()

    let created = 0
    let updated = 0
    let skipped = 0
    let sandwichAppliedCount = 0
    let coEarnedDaysTotal = 0
    let coUsedDaysTotal = 0
    let insufficientLeaveFallbackCount = 0

    for (const employee of employees) {
      const existing = existingPayrollMap.get(employee.id)
      if (existing?.status === PayrollStatus.PAID) {
        skipped += 1
        continue
      }

      const employeeAttendance = attendanceByEmployee.get(employee.id) ?? new Map<string, AttendanceForCalc>()
      const dayStatuses = new Map<number, AttendanceStatus | undefined>()
      let presentDays = 0
      let remoteDays = 0
      let halfDays = 0
      let leaveDays = 0
      let elDays = 0
      let slDays = 0
      let coDays = 0
      let missingWorkingDays = 0
      let absentDays = 0
      let sandwichDays = 0
      let coEarned = 0
      let coUsed = 0
      let payableUnits = 0
      let unpaidUnits = 0
      const holidayWorkAttendanceRefs: Array<{ attendanceId: string; sourceDate: Date; earnedDays: number }> = []

      const isNonWorkingDay = (day: number) => {
        const isoDate = toIsoDate(toUtcDate(yearNumber, monthNumber, day))
        return isSunday(yearNumber, monthNumber, day) || holidaySet.has(isoDate)
      }

      for (let day = 1; day <= totalDaysInMonth; day += 1) {
        const isoDate = toIsoDate(toUtcDate(yearNumber, monthNumber, day))
        dayStatuses.set(day, employeeAttendance.get(isoDate)?.status)
      }

      const findNearestWorkingStatus = (fromDay: number, direction: -1 | 1): AttendanceStatus | undefined => {
        let cursor = fromDay + direction
        while (cursor >= 1 && cursor <= totalDaysInMonth) {
          if (!isNonWorkingDay(cursor)) return dayStatuses.get(cursor)
          cursor += direction
        }
        return undefined
      }

      for (let day = 1; day <= totalDaysInMonth; day += 1) {
        const isoDate = toIsoDate(toUtcDate(yearNumber, monthNumber, day))
        const attendance = employeeAttendance.get(isoDate)
        const status = attendance?.status
        const nonWorking = isNonWorkingDay(day)

        if (nonWorking) {
          if (status && HOLIDAY_WORK_STATUSES.has(status)) {
            const earned = status === AttendanceStatus.HALF_DAY ? 0.5 : 1
            payableUnits += earned
            coEarned += earned
            if (status === AttendanceStatus.HALF_DAY) halfDays += 1
            if (status === AttendanceStatus.PRESENT) presentDays += 1
            if (status === AttendanceStatus.REMOTE) remoteDays += 1
            if (attendance?.id) {
              holidayWorkAttendanceRefs.push({
                attendanceId: attendance.id,
                sourceDate: toUtcDate(yearNumber, monthNumber, day),
                earnedDays: earned,
              })
            }
          } else {
            const previousWorkingStatus = findNearestWorkingStatus(day, -1)
            const nextWorkingStatus = findNearestWorkingStatus(day, 1)
            const isSandwich =
              previousWorkingStatus !== undefined &&
              nextWorkingStatus !== undefined &&
              TRIGGER_STATUSES.has(previousWorkingStatus) &&
              TRIGGER_STATUSES.has(nextWorkingStatus)

            if (isSandwich) {
              sandwichDays += 1
              unpaidUnits += 1
            } else {
              payableUnits += 1
            }
          }
          continue
        }

        if (!status) {
          missingWorkingDays += 1
          unpaidUnits += 1
          continue
        }

        if (status === AttendanceStatus.ABSENT) {
          absentDays += 1
          unpaidUnits += 1
          continue
        }

        if (status === AttendanceStatus.HALF_DAY) {
          halfDays += 1
          payableUnits += 0.5
          unpaidUnits += 0.5
          continue
        }

        if (status === AttendanceStatus.PRESENT) presentDays += 1
        if (status === AttendanceStatus.REMOTE) remoteDays += 1
        if (status === AttendanceStatus.LEAVE) leaveDays += 1
        if (status === AttendanceStatus.EL) elDays += 1
        if (status === AttendanceStatus.SL) slDays += 1
        if (status === AttendanceStatus.CO) {
          coDays += 1
          coUsed += 1
        }

        payableUnits += 1
      }

      await prisma.$transaction(async (tx) => {
        const refs = holidayWorkAttendanceRefs.map((entry) => entry.attendanceId)
        const existingRefs = refs.length > 0
          ? await tx.compOffLedger.findMany({
              where: { referenceAttendanceId: { in: refs } },
              select: { referenceAttendanceId: true },
            })
          : []

        const existingRefSet = new Set(
          existingRefs
            .map((entry) => entry.referenceAttendanceId)
            .filter(Boolean) as string[]
        )

        const newLedgerEntries = holidayWorkAttendanceRefs
          .filter((entry) => !existingRefSet.has(entry.attendanceId))
          .map((entry) => {
            const expiresOn = new Date(entry.sourceDate)
            expiresOn.setUTCDate(expiresOn.getUTCDate() + 90)
            return {
              employeeId: employee.id,
              sourceDate: entry.sourceDate,
              earnedDays: entry.earnedDays,
              usedDays: 0,
              expiresOn,
              status: 'OPEN' as const,
              referenceAttendanceId: entry.attendanceId,
            }
          })

        if (newLedgerEntries.length > 0) {
          await tx.compOffLedger.createMany({ data: newLedgerEntries })
        }

        await tx.compOffLedger.updateMany({
          where: {
            employeeId: employee.id,
            status: { in: ['OPEN', 'PARTIALLY_USED'] },
            expiresOn: { lt: new Date() },
          },
          data: { status: 'EXPIRED' },
        })

        const openLedgers = await tx.compOffLedger.findMany({
          where: {
            employeeId: employee.id,
            status: { in: ['OPEN', 'PARTIALLY_USED'] },
            expiresOn: { gte: new Date() },
          },
          select: { earnedDays: true, usedDays: true },
        })
        const coBalance = round2(
          openLedgers.reduce((sum, ledger) => sum + getRemainingCompOff(ledger.earnedDays, ledger.usedDays), 0)
        )

        const grossBase = employee.grossSalary ?? employee.netSalary ?? 0
        const netBase = employee.netSalary ?? grossBase
        const perDayGross = totalDaysInMonth > 0 ? grossBase / totalDaysInMonth : 0
        const perDayNet = totalDaysInMonth > 0 ? netBase / totalDaysInMonth : 0

        const grossAmount = Math.round(perDayGross * payableUnits)
        const netAmount = Math.round(perDayNet * payableUnits)
        const deductions = Math.round(perDayNet * unpaidUnits)

        const breakdown = {
          payableUnits: round2(payableUnits),
          unpaidUnits: round2(unpaidUnits),
          presentDays,
          remoteDays,
          halfDays,
          leaveDays,
          elDays,
          slDays,
          coDays,
          absentDays,
          missingWorkingDays,
          sandwichDays,
          coEarned: round2(coEarned),
          coUsed: round2(coUsed),
          holidayWorkedCount: holidayWorkAttendanceRefs.length,
        }

        await tx.payrollRecord.upsert({
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
            calculationBreakdown: breakdown as Prisma.InputJsonValue,
          },
          update: {
            grossAmount,
            netAmount,
            deductions,
            calculationBreakdown: breakdown as Prisma.InputJsonValue,
          },
        })

        await tx.employee.update({
          where: { id: employee.id },
          data: {
            coBalance,
            lastCompOffAccrual: newLedgerEntries.length > 0 ? new Date() : undefined,
          },
        })
      })

      sandwichAppliedCount += sandwichDays
      coEarnedDaysTotal += coEarned
      coUsedDaysTotal += coUsed
      insufficientLeaveFallbackCount += 0

      if (existing) updated += 1
      else created += 1
    }

    return NextResponse.json({
      success: true,
      summary: {
        created,
        updated,
        skipped,
        processed: created + updated,
        sandwichAppliedCount: round2(sandwichAppliedCount),
        coEarnedDaysTotal: round2(coEarnedDaysTotal),
        coUsedDaysTotal: round2(coUsedDaysTotal),
        insufficientLeaveFallbackCount,
      },
    })
  } catch (error) {
    console.error('Failed to generate payroll', error)
    return NextResponse.json({ success: false, error: 'Failed to generate payroll' }, { status: 500 })
  }
}
