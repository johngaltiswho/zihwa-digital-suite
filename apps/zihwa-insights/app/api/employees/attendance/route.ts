import { NextResponse } from 'next/server'
import { AttendanceStatus, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

const normalizeDate = (value: string | Date) => {
  if (typeof value === 'string') {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(Date.UTC(year, month - 1, day))
  }
  const date = new Date(value)
  date.setUTCHours(0, 0, 0, 0)
  return date
}

const leaveConsumption = (status?: AttendanceStatus | null) => {
  return {
    el: status === 'EL' ? 1 : 0,
    sl: status === 'SL' ? 1 : 0,
  }
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
    const records = await prisma.attendanceRecord.findMany({
      where: {
        date: {
          gte: start,
          lt: end,
        },
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
        records,
      },
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      // Attendance tables not present yet – respond gracefully
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
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch attendance records',
    }, { status: 500 })
  }
}

// POST /api/employees/attendance - create/update a record for a day
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { employeeId, date, status, checkIn, checkOut, notes } = body

    if (!employeeId || !date) {
      return NextResponse.json(
        { success: false, error: 'employeeId and date are required' },
        { status: 400 }
      )
    }

    let parsedStatus: AttendanceStatus | undefined = undefined
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

    const createData: Prisma.AttendanceRecordUncheckedCreateInput = {
      employeeId,
      date: normalizedDate,
      checkIn: checkIn ? new Date(checkIn) : null,
      checkOut: checkOut ? new Date(checkOut) : null,
      notes: notes || null,
    }

    const updateData: Prisma.AttendanceRecordUncheckedUpdateInput = {
      checkIn: checkIn ? new Date(checkIn) : null,
      checkOut: checkOut ? new Date(checkOut) : null,
      notes: notes || null,
    }

    if (parsedStatus) {
      createData.status = parsedStatus
      updateData.status = parsedStatus
    }

    try {
      const record = await prisma.$transaction(async (tx) => {
        const existingRecord = await tx.attendanceRecord.findUnique({
          where: {
            employeeId_date: {
              employeeId,
              date: normalizedDate,
            },
          },
          select: { status: true },
        })

        const employee = await tx.employee.findUnique({
          where: { id: employeeId },
          select: { elBalance: true, slBalance: true },
        })

        if (!employee) {
          throw new Error('Employee not found')
        }

        let elBalance = employee.elBalance ?? 0
        let slBalance = employee.slBalance ?? 0

        if (existingRecord) {
          const refunds = leaveConsumption(existingRecord.status)
          elBalance += refunds.el
          slBalance += refunds.sl
        }

        if (parsedStatus) {
          const consumption = leaveConsumption(parsedStatus)
          if (consumption.el > 0 && elBalance < consumption.el) {
            throw new Error('INSUFFICIENT_EL')
          }
          if (consumption.sl > 0 && slBalance < consumption.sl) {
            throw new Error('INSUFFICIENT_SL')
          }
          elBalance -= consumption.el
          slBalance -= consumption.sl
        }

        const record = existingRecord
          ? await tx.attendanceRecord.update({
              where: { id: existingRecord.id },
              data: updateData,
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
              data: createData,
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
          },
        })

        return record
      })

      return NextResponse.json({ success: true, data: record })
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'INSUFFICIENT_EL') {
          return NextResponse.json(
            { success: false, error: 'Not enough earned leave balance.' },
            { status: 400 }
          )
        }
        if (error.message === 'INSUFFICIENT_SL') {
          return NextResponse.json(
            { success: false, error: 'Not enough sick leave balance.' },
            { status: 400 }
          )
        }
        if (error.message === 'Employee not found') {
          return NextResponse.json({ success: false, error: error.message }, { status: 404 })
        }
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
