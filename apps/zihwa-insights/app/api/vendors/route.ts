import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/vendors - list all vendors
export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, data: vendors })
  } catch (error) {
    console.error('Failed to fetch vendors', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch vendors' }, { status: 500 })
  }
}

// POST /api/vendors - create a vendor
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, bankName, accountNumber, ifsc, branch, description } = body

    if (!name || !bankName || !accountNumber || !ifsc || !branch) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const vendor = await prisma.vendor.create({
      data: {
        name,
        bankName,
        accountNumber,
        ifsc,
        branch,
        description: description || null,
      },
    })

    return NextResponse.json({ success: true, data: vendor }, { status: 201 })
  } catch (error) {
    console.error('Failed to create vendor', error)
    return NextResponse.json({ success: false, error: 'Failed to create vendor' }, { status: 500 })
  }
}
