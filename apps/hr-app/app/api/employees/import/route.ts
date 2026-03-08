import { NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { EmployeeStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

type CsvRecord = Record<string, string>

type ParsedEmployee = {
  employeeId: string
  firstName: string
  lastName: string
  grossSalary: number | null
  netSalary: number | null
  companyId: string
  bankAccountNumber: string | null
  ifscCode: string | null
}

type RowResult =
  | { rowNumber: number; data: ParsedEmployee; errors: null }
  | { rowNumber: number; data: null; errors: string[] }

const MAX_ROWS = 1000

const HEADER_MAP: Record<string, string[]> = {
  employeeId: ['Sno', 'S.No.', 'Employee ID', 'Emp Code'],
  fullName: ['Full Name', 'Employee Name', 'Name'],
  netSalary: ['Net Salary'],
  grossSalary: ['Gross Salary'],
  bankAccountNumber: ['Bank Account Number', 'Account Number'],
  ifscCode: ['IFSC Code', 'IFSC'],
}

const getValue = (record: CsvRecord, possibleHeaders: string[]) => {
  for (const header of possibleHeaders) {
    const value = record[header]
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }
  return ''
}

const splitFullName = (value: string) => {
  const parts = value.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { first: '', last: '' }
  if (parts.length === 1) return { first: parts[0], last: '' }
  return { first: parts[0], last: parts.slice(1).join(' ') }
}

const parseAmount = (raw?: string) => {
  if (!raw) return null
  const cleaned = raw.replace(/[^0-9.]/g, '')
  if (!cleaned) return null
  const amount = Number(cleaned)
  if (Number.isNaN(amount)) return null
  return amount
}

const parseRow = (record: CsvRecord, companyId: string, rowIndex: number): RowResult => {
  const rowNumber = rowIndex + 2 // + header row
  const errors: string[] = []

  const employeeId = getValue(record, HEADER_MAP.employeeId)
  const fullNameValue = getValue(record, HEADER_MAP.fullName)
  const derivedName = splitFullName(fullNameValue)
  const finalFirstName = derivedName.first
  const finalLastName = derivedName.last

  if (!employeeId) errors.push('Employee code is required.')
  if (!finalFirstName) errors.push('Full name is required.')

  const netSalaryValue = getValue(record, HEADER_MAP.netSalary)
  const grossSalaryValue = getValue(record, HEADER_MAP.grossSalary)
  const netSalaryNumber = parseAmount(netSalaryValue)
  const grossSalaryNumber = parseAmount(grossSalaryValue)

  if (errors.length > 0) {
    return { rowNumber, data: null, errors }
  }

  return {
    rowNumber,
    data: {
      employeeId,
      firstName: finalFirstName,
      lastName: finalLastName,
      grossSalary: grossSalaryNumber !== null ? Math.round(grossSalaryNumber) : null,
      netSalary: netSalaryNumber !== null ? Math.round(netSalaryNumber) : null,
      companyId,
      bankAccountNumber: getValue(record, HEADER_MAP.bankAccountNumber) || null,
      ifscCode: getValue(record, HEADER_MAP.ifscCode) || null,
    },
    errors: null,
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const companyId = formData.get('companyId')
    const file = formData.get('file')

    if (!companyId || typeof companyId !== 'string') {
      return NextResponse.json({ success: false, error: 'companyId is required.' }, { status: 400 })
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'CSV file is required.' }, { status: 400 })
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, name: true },
    })

    if (!company) {
      return NextResponse.json({ success: false, error: 'Company not found.' }, { status: 404 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const text = buffer.toString('utf-8')

    if (!text.trim()) {
      return NextResponse.json({ success: false, error: 'Uploaded file is empty.' }, { status: 400 })
    }

    let records: CsvRecord[] = []
    try {
      records = parse(text, {
        skip_empty_lines: true,
        columns: true,
        trim: true,
      })
    } catch (error) {
      console.error('CSV parse failed', error)
      return NextResponse.json({ success: false, error: 'Unable to parse CSV file.' }, { status: 400 })
    }

    if (records.length === 0) {
      return NextResponse.json({ success: false, error: 'No rows detected in the file.' }, { status: 400 })
    }

    if (records.length > MAX_ROWS) {
      return NextResponse.json(
        { success: false, error: `Upload up to ${MAX_ROWS} rows at once.` },
        { status: 400 }
      )
    }

    const parsedRows = records.map((record, index) => parseRow(record, companyId, index))
    const failedRows = parsedRows.filter((row): row is { rowNumber: number; data: null; errors: string[] } => row.data === null)
    const successfulRows = parsedRows
      .filter((row): row is { rowNumber: number; data: ParsedEmployee; errors: null } => row.data !== null)
      .map((row) => row.data)

    if (successfulRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'All rows failed validation.', failed: failedRows },
        { status: 422 }
      )
    }

    const employeeIds = successfulRows.map((row) => row.employeeId)
    const existing = await prisma.employee.findMany({
      where: {
        companyId,
        employeeId: { in: employeeIds },
      },
      select: { employeeId: true },
    })
    const existingIds = new Set(existing.map((employee) => employee.employeeId))

    const actions = successfulRows.map((row) => (existingIds.has(row.employeeId) ? 'update' : 'create'))

    await prisma.$transaction(
      successfulRows.map((row) =>
        prisma.employee.upsert({
          where: { companyId_employeeId: { companyId, employeeId: row.employeeId } },
          create: {
            employeeId: row.employeeId,
            companyId: row.companyId,
            firstName: row.firstName,
            lastName: row.lastName,
            grossSalary: row.grossSalary,
            netSalary: row.netSalary,
            bankAccountNumber: row.bankAccountNumber,
            ifscCode: row.ifscCode,
            status: EmployeeStatus.ACTIVE,
          },
          update: {
            firstName: row.firstName,
            lastName: row.lastName,
            grossSalary: row.grossSalary,
            netSalary: row.netSalary,
            bankAccountNumber: row.bankAccountNumber,
            ifscCode: row.ifscCode,
          },
        })
      )
    )

    const summary = {
      totalRows: records.length,
      processedRows: successfulRows.length,
      created: actions.filter((action) => action === 'create').length,
      updated: actions.filter((action) => action === 'update').length,
      failed: failedRows.length,
      company: company.name,
    }

    return NextResponse.json({
      success: true,
      summary,
      failed: failedRows,
    })
  } catch (error) {
    console.error('Employee import failed', error)
    return NextResponse.json({ success: false, error: 'Failed to import employees.' }, { status: 500 })
  }
}
