import { NextResponse } from 'next/server'
import { AttendanceStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

const STATUS_MAP: Record<string, AttendanceStatus> = {
  'P': 'PRESENT', 'A': 'ABSENT', 'H': 'LEAVE', 'PH': 'PRESENT',
  'W/O': 'LEAVE', 'CO/FD': 'REMOTE', 'CO/HD': 'PRESENT',
  'DN': 'PRESENT', 'D/N': 'PRESENT', 'H/D': 'PRESENT',
  'L': 'LEAVE', 'EL': 'EL', 'SL': 'SL',
}
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred'
}
// ✅ Type defined at file scope so it's available everywhere below
type AttendanceRecordInput = {
  employeeId: string
  date: Date
  status: AttendanceStatus
  notes: string
}
// Handles Case-Insensitivity, Dots, and Spacing
const clean = (val: unknown) => {
  return String(val || "").toLowerCase()
    .replace(/\./g, ' ')        // Remove dots
    .replace(/[^a-z0-9\s]/g, '') // Remove symbols
    .replace(/\s+/g, ' ')        // Collapse multiple spaces
    .trim()
}

const leaveConsumption = (status?: AttendanceStatus | null) => {
  return { el: status === 'EL' ? 1 : 0, sl: status === 'SL' ? 1 : 0 }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const monthValue = formData.get('month') as string 

    if (!file || !monthValue) return NextResponse.json({ error: 'Missing file/month' }, { status: 400 })

    const [year, month] = monthValue.split('-').map(Number)
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const allRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false }) as unknown[][]
    
    const headerRowIndex = allRows.findIndex(row => 
      row.some(cell => clean(cell) === 'employee no')
    )
    
    if (headerRowIndex === -1) return NextResponse.json({ error: 'Header row not found' }, { status: 400 })

    const headers = allRows[headerRowIndex].map(h => String(h || "").trim())
    const empNoIdx = headers.indexOf('Employee No')
    const nameIdx = headers.indexOf('Name')
    const dataRows = allRows.slice(headerRowIndex + 1)

    const allDbEmployees = await prisma.employee.findMany()
    const employeeMap = new Map<string, typeof allDbEmployees[0]>()
    
    // MATCH EMPLOYEES (Priority: Fuzzy Name Match)
    for (const row of dataRows) {
      const excelId = String(row[empNoIdx] || "").trim()
      const excelName = String(row[nameIdx] || "").trim()
      if (!excelName || clean(excelName) === 'name' || excelName.length <= 3) continue

      const targetName = clean(excelName)
      
      // Look for the person in the DB by cleaning their name first
      const employee = allDbEmployees.find(emp => {
          const dbFull = clean(`${emp.firstName} ${emp.lastName}`)
          return dbFull === targetName || dbFull.includes(targetName) || targetName.includes(dbFull)
      })

      if (employee) employeeMap.set(`${excelId}|${excelName}`, employee)
    }

    const startDate = new Date(Date.UTC(year, month - 1, 1))
    const endDate = new Date(Date.UTC(year, month, 0))
    const existingAttendance = await prisma.attendanceRecord.findMany({
      where: { date: { gte: startDate, lte: endDate } }
    })
    const attendanceMap = new Map(existingAttendance.map(r => [`${r.employeeId}|${r.date.toISOString()}`, r]))

   const attendanceRecords: AttendanceRecordInput[] = []
    const employeeBalanceUpdates = new Map<string, { el: number, sl: number }>()

    // PREPARE DATA
    for (const row of dataRows) {
      const excelId = String(row[empNoIdx] || "").trim()
      const excelName = String(row[nameIdx] || "").trim()
      const employee = employeeMap.get(`${excelId}|${excelName}`)
      if (!employee) continue

      if (!employeeBalanceUpdates.has(employee.id)) {
        employeeBalanceUpdates.set(employee.id, { el: employee.elBalance ?? 0, sl: employee.slBalance ?? 0 })
      }
      const balances = employeeBalanceUpdates.get(employee.id)!

      for (let i = 0; i < headers.length; i++) {
        const h = headers[i]
        if (!h.match(/^\d{2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/i)) continue 

        const day = parseInt(h.split('-')[0])
        const rawVal = String(row[i] || "").trim().toUpperCase()
        if (!rawVal || rawVal === '-' || rawVal === '') continue

        let status: AttendanceStatus = STATUS_MAP[rawVal] || 'PRESENT'
        if (rawVal.includes('EL')) status = 'EL'
        else if (rawVal.includes('SL')) status = 'SL'
        else if (rawVal === 'L' || rawVal === 'A') status = 'ABSENT'
        else if (rawVal === 'W/O' || rawVal === 'H') status = 'LEAVE'

        const date = new Date(Date.UTC(year, month - 1, day))
        const existing = attendanceMap.get(`${employee.id}|${date.toISOString()}`)
        
        if (existing) {
          const ref = leaveConsumption(existing.status)
          balances.el += ref.el; balances.sl += ref.sl
        }

        const cons = leaveConsumption(status)
        balances.el -= cons.el; balances.sl -= cons.sl

        attendanceRecords.push({ employeeId: employee.id, date, status, notes: `${rawVal}` })
      }
    }

    // SEQUENTIAL UPDATE (No Transaction - Prevents Timeouts & Uniqueness Errors)
    let totalUpdated = 0
    for (const record of attendanceRecords) {
        await prisma.attendanceRecord.upsert({
            where: { employeeId_date: { employeeId: record.employeeId, date: record.date } },
            update: { status: record.status, notes: record.notes },
            create: record
        })
        totalUpdated++
    }

    // UPDATE FINAL BALANCES
    for (const [id, bal] of employeeBalanceUpdates.entries()) {
        await prisma.employee.update({ 
            where: { id }, 
            data: { elBalance: bal.el, slBalance: bal.sl } 
        })
    }

    return NextResponse.json({ success: true, count: totalUpdated })
  } catch (error: unknown) {
    console.error('Import failure:', error)
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 })
  }
}