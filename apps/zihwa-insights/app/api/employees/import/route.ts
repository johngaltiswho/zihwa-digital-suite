import { NextResponse } from 'next/server'
import { EmployeeStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

type ParsedEmployee = {
  employeeId:        string
  firstName:         string
  lastName:          string
  designation:       string | null
  grossSalary:       number | null
  netSalary:         number | null
  basicSalary:       number | null
  hra:               number | null
  conveyance:        number | null
  specialAllowance:  number | null
  pfAmount:          number | null
  pfApplicable:      boolean
  ptAmount:          number | null
  totalDeductions:   number | null
  companyId:         string
  bankAccountNumber: string | null
  ifscCode:          string | null
}

type RowResult =
  | { rowNumber: number; data: ParsedEmployee; errors: null }
  | { rowNumber: number; data: null; errors: string[] }

const MAX_ROWS = 1000

// PREFIX MAP — employee ID prefix → company name fragment in DB
// Your 6 companies:
//   AACP Infrastructure Systems Pvt Ltd.  → A   (A8, A37)
//   Zihwa Insights (OPC) Pvt Ltd          → ZI  (ZI35, ZI10)
//   Zihwa Foods Pvt Ltd                   → ZF  (ZF01)
//   Stalks N Spice                        → SS  (SS23, SS32)
//   Pars Optima Enterprises LLP           → PO  (PO01) ← rename your Pars Optima employees to PO prefix
//   Fluvium                               → FL  (FL01) ← rename your Fluvium employees to FL prefix
const COMPANY_PREFIX_MAP: Record<string, string> = {
  ZI: 'Zihwa Insights',
  ZF: 'Zihwa Foods',
  SS: 'Stalks',
  PO: 'Pars Optima',
  FL: 'Fluvium',
  A:  'AACP',
}

const splitFullName = (value: string) => {
  const parts = value.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { first: '', last: '' }
  if (parts.length === 1) return { first: parts[0], last: '' }
  return { first: parts[0], last: parts.slice(1).join(' ') }
}

const toNum = (val: unknown): number | null => {
  if (val === null || val === undefined || val === '') return null
  const n = Number(val)
  return isNaN(n) ? null : Math.round(n)
}

const toStr = (val: unknown): string =>
  val === null || val === undefined ? '' : String(val).trim()

const detectCompanyId = (
  employeeId: string,
  companyMap: Map<string, string>
): string | null => {
  const id = employeeId.toUpperCase()
  const sorted = Object.entries(COMPANY_PREFIX_MAP).sort((a, b) => b[0].length - a[0].length)
  for (const [prefix, nameFragment] of sorted) {
    if (!id.startsWith(prefix)) continue
    const afterPrefix = id.slice(prefix.length)
    if (!afterPrefix || isNaN(Number(afterPrefix[0]))) continue
    for (const [dbName, dbId] of companyMap.entries()) {
      if (dbName.toLowerCase().includes(nameFragment.toLowerCase())) return dbId
    }
  }
  return null
}

const parseRow = (
  row: Record<string, unknown>,
  companyMap: Map<string, string>,
  rowNumber: number
): RowResult => {
  const errors: string[] = []

  const rawId = toStr(
    row['Employee No'] ?? row['Employee ID'] ?? row['Emp Code'] ?? row['Sno'] ?? ''
  ).replace(/\s+/g, '')

  if (!rawId) {
    errors.push('Employee No is required.')
    return { rowNumber, data: null, errors }
  }

  const fullName = toStr(row['Name'] ?? row['Full Name'] ?? row['Employee Name'] ?? '')
  const { first, last } = splitFullName(fullName)
  if (!first) {
    errors.push('Name is required.')
    return { rowNumber, data: null, errors }
  }

  let companyId = detectCompanyId(rawId, companyMap)

  if (!companyId) {
    const companyCol = toStr(row['Company'] ?? '')
    if (companyCol) {
      for (const [dbName, dbId] of companyMap.entries()) {
        if (dbName.toLowerCase().includes(companyCol.toLowerCase())) {
          companyId = dbId
          break
        }
      }
    }
  }

  if (!companyId) {
    errors.push(
      `Cannot determine company for "${rawId}". ` +
      `Add a "Company" column or update COMPANY_PREFIX_MAP in the import route.`
    )
    return { rowNumber, data: null, errors }
  }

  const grossSalary      = toNum(row['GROSS']             ?? row['Gross Salary']     ?? null)
  const netSalary        = toNum(row['NET PAY']           ?? row['Net Salary']       ?? null)
  const basicSalary      = toNum(row['BASIC']             ?? row['Basic Salary']     ?? null)
  const hra              = toNum(row['HRA']               ?? null)
  const conveyance       = toNum(row['CONVEYANCE']        ?? null)
  const specialAllowance = toNum(row['SPECIAL ALLOWANCE'] ?? null)
  const pfAmount         = toNum(row['PF Employee']       ?? row['PF EMPLOYEE']      ?? null)
  const ptAmount         = toNum(row['PROF TAX']          ?? row['Professional Tax'] ?? null)
  const totalDeductions  = toNum(row['TOTAL DEDUCTIONS']  ?? row['Total Deductions'] ?? null)
  const pfApplicable     = pfAmount !== null && pfAmount > 0
  const designation      = toStr(row['Designation'] ?? row['Designation '] ?? '') || null
  const bankAccountNumber = toStr(row['Bank Account Number'] ?? row['Account Number'] ?? '') || null
  const ifscCode          = toStr(row['IFSC Code'] ?? row['IFSC'] ?? '') || null

  return {
    rowNumber,
    data: {
      employeeId: rawId, firstName: first, lastName: last, designation,
      grossSalary, netSalary, basicSalary, hra, conveyance, specialAllowance,
      pfAmount, pfApplicable, ptAmount, totalDeductions,
      companyId, bankAccountNumber, ifscCode,
    },
    errors: null,
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'File is required.' }, { status: 400 })
    }

    const fileName = file.name.toLowerCase()
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls')
    const isCsv   = fileName.endsWith('.csv')

    if (!isExcel && !isCsv) {
      return NextResponse.json(
        { success: false, error: 'Only .xlsx, .xls, or .csv files are supported.' },
        { status: 400 }
      )
    }

    const allCompanies = await prisma.company.findMany({ select: { id: true, name: true } })
    if (allCompanies.length === 0) {
      return NextResponse.json({ success: false, error: 'No companies found in system.' }, { status: 404 })
    }
    const companyMap = new Map<string, string>(allCompanies.map((c) => [c.name, c.id]))

    const buffer = Buffer.from(await file.arrayBuffer())
    let rows: Record<string, unknown>[] = []
    let dataStartRow = 2

    if (isExcel) {
      const wb = XLSX.read(buffer, { type: 'buffer' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const raw = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: null })

      let headerIdx = 0
      for (let i = 0; i < Math.min(6, raw.length); i++) {
        const vals = (raw[i] as unknown[]).map((v) => String(v ?? '').trim().toLowerCase())
        if (vals.includes('employee no') || vals.includes('name')) {
          headerIdx = i
          break
        }
      }

      const headers = (raw[headerIdx] as unknown[]).map((h) => String(h ?? '').trim())
      dataStartRow = headerIdx + 2

      for (let i = headerIdx + 1; i < raw.length; i++) {
        const rawRow = raw[i] as unknown[]
        if (!rawRow || rawRow.every((v) => v === null || v === undefined || v === '')) continue
        const empNoIdx = headers.findIndex((h) => h.toLowerCase() === 'employee no')
        if (empNoIdx >= 0) {
          const empNoVal = rawRow[empNoIdx]
          if (empNoVal === null || empNoVal === undefined || String(empNoVal).trim() === '') continue
        }
        const obj: Record<string, unknown> = {}
        headers.forEach((h, idx) => { if (h) obj[h] = rawRow[idx] ?? null })
        rows.push(obj)
      }
    } else {
      const { parse } = await import('csv-parse/sync')
      const text = buffer.toString('utf-8')
      if (!text.trim()) {
        return NextResponse.json({ success: false, error: 'File is empty.' }, { status: 400 })
      }
      rows = parse(text, { skip_empty_lines: true, columns: true, trim: true })
    }

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'No data rows found in file.' }, { status: 400 })
    }
    if (rows.length > MAX_ROWS) {
      return NextResponse.json({ success: false, error: `Max ${MAX_ROWS} rows allowed.` }, { status: 400 })
    }

    const parsedRows: RowResult[] = rows.map((row, idx) =>
      parseRow(row, companyMap, dataStartRow + idx)
    )

    const failedRows = parsedRows.filter(
      (r): r is { rowNumber: number; data: null; errors: string[] } => r.data === null
    )
    const successfulRows = parsedRows
      .filter((r): r is { rowNumber: number; data: ParsedEmployee; errors: null } => r.data !== null)
      .map((r) => r.data)

    if (successfulRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'All rows failed validation.', failed: failedRows },
        { status: 422 }
      )
    }

    const existing = await prisma.employee.findMany({
      where: { OR: successfulRows.map((r) => ({ companyId: r.companyId, employeeId: r.employeeId })) },
      select: { employeeId: true, companyId: true },
    })
    const existingSet = new Set(existing.map((e) => `${e.companyId}::${e.employeeId}`))
    const actions = successfulRows.map((r) =>
      existingSet.has(`${r.companyId}::${r.employeeId}`) ? 'update' : 'create'
    )

    await prisma.$transaction(
      successfulRows.map((row) =>
        prisma.employee.upsert({
          where: { companyId_employeeId: { companyId: row.companyId, employeeId: row.employeeId } },
          create: {
            employeeId: row.employeeId, companyId: row.companyId,
            firstName: row.firstName, lastName: row.lastName, designation: row.designation,
            grossSalary: row.grossSalary, netSalary: row.netSalary,
            basicSalary: row.basicSalary, hra: row.hra,
            conveyance: row.conveyance, specialAllowance: row.specialAllowance,
            pfAmount: row.pfAmount, pfApplicable: row.pfApplicable,
            ptAmount: row.ptAmount, totalDeductions: row.totalDeductions,
            bankAccountNumber: row.bankAccountNumber, ifscCode: row.ifscCode,
            status: EmployeeStatus.ACTIVE,
          },
          update: {
            firstName: row.firstName, lastName: row.lastName, designation: row.designation,
            grossSalary: row.grossSalary, netSalary: row.netSalary,
            basicSalary: row.basicSalary, hra: row.hra,
            conveyance: row.conveyance, specialAllowance: row.specialAllowance,
            pfAmount: row.pfAmount, pfApplicable: row.pfApplicable,
            ptAmount: row.ptAmount, totalDeductions: row.totalDeductions,
            bankAccountNumber: row.bankAccountNumber, ifscCode: row.ifscCode,
          },
        })
      )
    )

    const byCompany: Record<string, { created: number; updated: number }> = {}
    successfulRows.forEach((row, idx) => {
      const name = allCompanies.find((c) => c.id === row.companyId)?.name ?? row.companyId
      if (!byCompany[name]) byCompany[name] = { created: 0, updated: 0 }
      if (actions[idx] === 'create') byCompany[name].created++
      else byCompany[name].updated++
    })

    return NextResponse.json({
      success: true,
      summary: {
        totalRows: rows.length, processedRows: successfulRows.length,
        created: actions.filter((a) => a === 'create').length,
        updated: actions.filter((a) => a === 'update').length,
        failed: failedRows.length, byCompany,
      },
      failed: failedRows,
    })
  } catch (error) {
    console.error('Employee import failed', error)
    return NextResponse.json({ success: false, error: 'Failed to import employees.' }, { status: 500 })
  }
}