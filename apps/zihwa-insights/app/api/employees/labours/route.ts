import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { getRouteAuth, getCompanyWhereFilter } from '@/lib/auth'

/**
 * GET: List all labours
 * Professional standard: Includes relation for company and returns a formatted object.
 */
export async function GET() {
  try {
    const { user, dbUser } = await getRouteAuth()
    if (!user || !dbUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const scopeFilter = await getCompanyWhereFilter(dbUser)
    
    const labours = await prisma.labour.findMany({
      where: { ...scopeFilter },
      orderBy: { labourId: 'asc' }, 
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

     const formatted = labours.map((labour) => ({
      id: labour.id,
      labourId: labour.labourId,
      employeeId: labour.labourId, // Alias for frontend compatibility
      firstName: labour.firstName,
      lastName: labour.lastName,
      fullName: `${labour.firstName} ${labour.lastName}`.trim(),
      designation: labour.designation,
      status: labour.status,
      phone: labour.phone,      
      dob: labour.dob,           
      netSalary: labour.netSalary,
      grossSalary: labour.grossSalary,
      company: labour.company,
      createdAt: labour.createdAt,
    }))

    return NextResponse.json({ success: true, data: formatted })
  } catch (error) {
    console.error('API_LABOURS_GET_ERROR', error)
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

/**
 * POST: Add a new labourer
 */
export async function POST(request: Request) {
  try {
     const { user } = await getRouteAuth()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const {
      labourId,
      firstName,
      lastName,
      companyId,
      designation,
      salary, // coming from frontend state 'netSalary'
      status
    } = body

    // 1. Validation
    if (!labourId || !firstName || !lastName || !companyId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: ID, Name, and Company' },
        { status: 400 }
      )
    }

    // 2. Check for duplicates (composite unique constraint in your schema)
    const existing = await prisma.labour.findFirst({
      where: { companyId, labourId },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Labour ID already exists for this company' },
        { status: 409 }
      )
    }

    // 3. Create in Database
    const labour = await prisma.labour.create({
      data: {
        labourId,
        firstName,
        lastName,
        companyId,
        designation: designation || null,
        netSalary: salary ? Number(salary) : null,
        status: status || 'ACTIVE',
      },
      include: {
        company: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json({ success: true, data: labour }, { status: 201 })
  } catch (error) {
    console.error('API_LABOURS_POST_ERROR', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create labourer record' },
      { status: 500 }
    )
  }
}
export async function PATCH(request: Request) {
  try {
     const { user } = await getRouteAuth()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const { id, firstName, lastName, designation, phone, dob, netSalary, status } = body

    if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })

    const updated = await prisma.labour.update({
      where: { id },
      data: {
        firstName,
        lastName,
        designation,
        phone,
        dob: dob ? new Date(dob) : null,
        netSalary: netSalary ? Number(netSalary) : null,
        status,
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('LABOUR_UPDATE_ERROR', error)
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 })
  }
}
/**
 * DELETE: Remove a labourer
 */
export async function DELETE(request: Request) {
  try {
    const { user } = await getRouteAuth()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })
    }

    await prisma.labour.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API_LABOURS_DELETE_ERROR', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete record' },
      { status: 500 }
    )
  }
}