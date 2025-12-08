import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { prisma } from '@/lib/prisma'

type ExportFormat = 'csv' | 'xlsx'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { vendors, format = 'csv' } = body as {
      vendors: { id: string; amount?: number | string }[]
      format?: ExportFormat
    }

    if (!Array.isArray(vendors) || vendors.length === 0) {
      return NextResponse.json({ success: false, error: 'No vendors provided' }, { status: 400 })
    }

    const vendorIds = vendors.map((v) => v.id)
    const amountMap = new Map<string, number>(
      vendors.map((v) => [v.id, Number(v.amount) || 0])
    )

    const vendorRecords = await prisma.vendor.findMany({
      where: { id: { in: vendorIds } },
      orderBy: { name: 'asc' },
    })

    if (vendorRecords.length === 0) {
      return NextResponse.json({ success: false, error: 'No matching vendors found' }, { status: 404 })
    }

    const rows = vendorRecords.map((vendor) => ({
      Name: vendor.name,
      'Bank Name': vendor.bankName,
      'Account Number': vendor.accountNumber,
      IFSC: vendor.ifsc,
      Branch: vendor.branch,
      Description: vendor.description || '',
      Amount: amountMap.get(vendor.id) ?? 0,
    }))

    if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(rows)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments')
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="vendor-payments.xlsx"',
        },
      })
    }

    // Default CSV
    const headers = Object.keys(rows[0])
    const csvLines = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((key) => {
            const value = (row as Record<string, unknown>)[key]
            const str = value === undefined || value === null ? '' : String(value)
            const escaped = str.replace(/"/g, '""')
            return `"${escaped}"`
          })
          .join(',')
      ),
    ]
    const csvContent = csvLines.join('\n')

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="vendor-payments.csv"',
      },
    })
  } catch (error) {
    console.error('Failed to export vendor payments', error)
    return NextResponse.json({ success: false, error: 'Failed to export vendor payments' }, { status: 500 })
  }
}
