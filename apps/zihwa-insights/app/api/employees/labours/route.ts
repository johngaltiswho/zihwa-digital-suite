import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

/**
 * GET: List all labours
 * Professional standard: Includes relation for company and returns a formatted object.
 */
export async function GET() {
  try {
    // 1. Fetch from Database using Prisma
    // Note: Ensure 'labour' model exists in your schema.prisma
    const labours = await prisma.labour.findMany({
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

    // 2. Format data for the frontend
    const formatted = labours.map((labour) => ({
      id: labour.id,
      labourId: labour.labourId,
      firstName: labour.firstName,
      lastName: labour.lastName,
      fullName: `${labour.firstName} ${labour.lastName}`.trim(),
      designation: labour.designation,
      status: labour.status,
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
    const body = await request.json()
    const {
      labourId,
      firstName,
      lastName,
      companyId,
      designation,
      salary,
      status
    } = body

    // Validation
    if (!labourId || !firstName || !lastName || !companyId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check for duplicates
    const existing = await prisma.labour.findFirst({
      where: { companyId, labourId },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Labour ID already exists for this company' },
        { status: 409 }
      )
    }

    // Create in Supabase/Postgres
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
      { success: false, error: 'Failed to create labourer' },
      { status: 500 }
    )
  }
}

/**
 * DELETE: Remove a labourer
 */
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await prisma.labour.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}