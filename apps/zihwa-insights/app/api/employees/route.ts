import { NextResponse } from 'next/server'
import { EmployeeStatus, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

// GET /api/employees - list employees with lightweight relations
export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        attendanceRecords: {
          orderBy: { date: 'desc' },
          take: 5,
        },
        payrollRecords: {
          orderBy: [{ year: 'desc' }, { month: 'desc' }],
          take: 3,
        },
        _count: {
          select: {
            attendanceRecords: true,
            payrollRecords: true,
          },
        },
      },
    })

    const formatted = employees.map((employee) => ({
      id: employee.id,
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      fullName: `${employee.firstName} ${employee.lastName}`.trim(),
      designation: employee.designation,
      department: employee.department,
      status: employee.status,
      email: employee.email,
      phone: employee.phone,
      netSalary: employee.netSalary,
      grossSalary: employee.grossSalary,
      bankAccountNumber: employee.bankAccountNumber,
      ifscCode: employee.ifscCode,
      elBalance: employee.elBalance,
      slBalance: employee.slBalance,
      joiningDate: employee.joiningDate,
      company: employee.company,
      stats: {
        attendance: employee._count.attendanceRecords,
        payrollRuns: employee._count.payrollRecords,
      },
      recentAttendance: employee.attendanceRecords,
      recentPayrolls: employee.payrollRecords,
      createdAt: employee.createdAt,
    }))

    return NextResponse.json({ success: true, data: formatted })
  } catch (error) {
    console.error('Failed to fetch employees', error)

    if (error instanceof Prisma.PrismaClientKnownRequestError && (error.code === 'P2021' || error.code === 'P2022')) {
      try {
        const fallbackEmployees = await prisma.employee.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        })

        const fallbackFormatted = fallbackEmployees.map((employee) => ({
          id: employee.id,
          employeeId: employee.employeeId,
          firstName: employee.firstName,
          lastName: employee.lastName,
          fullName: `${employee.firstName} ${employee.lastName}`.trim(),
          designation: employee.designation,
          department: employee.department,
          status: employee.status,
          email: employee.email,
          phone: employee.phone,
          netSalary: employee.netSalary,
          grossSalary: employee.grossSalary,
          bankAccountNumber: employee.bankAccountNumber,
          ifscCode: employee.ifscCode,
          elBalance: employee.elBalance,
          slBalance: employee.slBalance,
          joiningDate: employee.joiningDate,
          company: employee.company,
          stats: {
            attendance: 0,
            payrollRuns: 0,
          },
          recentAttendance: [],
          recentPayrolls: [],
          createdAt: employee.createdAt,
        }))

        return NextResponse.json({
          success: true,
          data: fallbackFormatted,
          warning: 'Attendance/payroll tables missing, showing basic data only.',
        })
      } catch (fallbackError) {
        console.error('Fallback employee fetch failed', fallbackError)
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch employees',
    })
  }
}

// POST /api/employees - add a new employee
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      employeeId,
      firstName,
      lastName,
      companyId,
      email,
      phone,
      designation,
      department,
      salary,
      joiningDate,
      status,
    } = body

    if (!employeeId || !firstName || !lastName || !companyId) {
      return NextResponse.json(
        { success: false, error: 'employeeId, firstName, lastName and companyId are required' },
        { status: 400 }
      )
    }

    const existing = await prisma.employee.findFirst({
      where: { companyId, employeeId },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Employee ID already exists for this company' },
        { status: 409 }
      )
    }

    const data: Prisma.EmployeeUncheckedCreateInput = {
      employeeId,
      firstName,
      lastName,
      companyId,
      email: email || null,
      phone: phone || null,
      designation: designation || null,
      department: department || null,
      netSalary: typeof salary === 'number' ? salary : salary ? Number(salary) : null,
      joiningDate: joiningDate ? new Date(joiningDate) : null,
    }

    if (status && Object.values(EmployeeStatus).includes(status)) {
      data.status = status
    }

    const employee = await prisma.employee.create({
      data,
      include: {
        company: {
          select: { id: true, name: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: employee }, { status: 201 })
  } catch (error) {
    console.error('Failed to create employee', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      firstName,
      lastName,
      designation,
      department,
      netSalary,
      grossSalary,
      bankAccountNumber,
      ifscCode,
      status,
    } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Employee id is required' }, { status: 400 })
    }

    const data: Prisma.EmployeeUncheckedUpdateInput = {}
    if (firstName !== undefined) data.firstName = firstName
    if (lastName !== undefined) data.lastName = lastName
    if (designation !== undefined) data.designation = designation || null
    if (department !== undefined) data.department = department || null
    if (netSalary !== undefined) data.netSalary = netSalary === null ? null : Number(netSalary)
    if (grossSalary !== undefined) data.grossSalary = grossSalary === null ? null : Number(grossSalary)
    if (bankAccountNumber !== undefined) data.bankAccountNumber = bankAccountNumber || null
    if (ifscCode !== undefined) data.ifscCode = ifscCode || null
    if (status && Object.values(EmployeeStatus).includes(status)) {
      data.status = status
    }

    const updated = await prisma.employee.update({
      where: { id },
      data,
      include: {
        company: {
          select: { id: true, name: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Failed to update employee', error)
    return NextResponse.json({ success: false, error: 'Failed to update employee' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Employee id is required' }, { status: 400 })
    }

    await prisma.employee.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete employee', error)
    return NextResponse.json({ success: false, error: 'Failed to delete employee' }, { status: 500 })
  }
}
