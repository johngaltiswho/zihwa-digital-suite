import { NextResponse } from 'next/server'
import { AttendanceStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

// ---------------------------------------------------------------------------
// CONFIRMED EXCEL STRUCTURE (Attendance_feb_2026.xlsx — production format)
// ---------------------------------------------------------------------------
// Row 1  : Legend row — SKIP (contains "Co/HD", "Comp off half day", "Co/FD", etc.)
// Row 2  : HEADER ROW
//   Col 1  "sl no"
//   Col 2  "Employee No"         ← empNoIdx  (string IDs: A8, ZI35, SS23, PO2, 18, Cons, Intern)
//   Col 3  "Name"                ← nameIdx
//   Col 4  "Designation"
//   Col 5  "Join Date"
//   Col 6  "Notes"
//   Col 7  "Paid Days"
//   Col 8  "Present Days"
//   Col 9  "HD"
//   Col 10 "W-off"
//   Col 11 "Leave"
//   Col 12 "L. Given"
//   Col 13 "C.OFF Given"
//   Col 14 "Comp pff acquired"
//   Col 15-42: date cells, number_format="d-mmm", xlsx raw:false → "1-Feb"…"28-Feb"
//              OR with cellDates:true → JS Date objects
// Row 3  : BLANK separator row — SKIP
// Rows 4+: Employee data rows
// Blank rows 29, 37, 47 = company group separators — filtered automatically
//
// CONFIRMED UNIQUE ATTENDANCE CODES: '-', 'A', 'Co/FD', 'H/D', 'P', 'W/O'
//
// COMPANY PREFIXES (inferred from employeeId):
//   'A'  prefix or plain numeric → AACP Infrastructure Systems Pvt Ltd
//   'ZI' prefix                  → Zihwa Insights (OPC) Pvt Ltd
//   'SS' prefix                  → Stalks N Spice
//   'PO' prefix                  → Pars Optima Enterprises LLP
//   'Cons' / 'Intern' labels     → matched by name, fallback to first company
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Status mapping — exhaustive for this Excel format + future-proofing
// ---------------------------------------------------------------------------
const STATUS_MAP: Record<string, AttendanceStatus> = {
  'P':     'PRESENT',
  'A':     'ABSENT',
  'W/O':   'LEAVE',    // Weekly Off
  'WO':    'LEAVE',
  'CO/FD': 'CO',       // Comp Off Full Day
  'CO/HD': 'HALF_DAY', // Comp Off Half Day
  'H/D':   'HALF_DAY', // Half Day (confirmed in Excel)
  'DN':    'PRESENT',  // Day + Night shift
  'D/N':   'PRESENT',
  'H':     'LEAVE',    // Holiday
  'NH':    'LEAVE',    // National Holiday
  'PH':    'REMOTE',   // Present on Holiday
  'L':     'LEAVE',
  'LV':    'LEAVE',
  'EL':    'EL',       // Earned Leave
  'SL':    'SL',       // Sick Leave
}

const DAY_NAMES = new Set(['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'])

// Employee number values that are role labels — must match by name, not ID
const LABEL_EMP_NOS = new Set(['INTERN', 'CONS', 'CONSULTANT', 'CONTRACT'])

// Common Indian surnames/words that are too generic for reliable name matching
const MATCH_BLOCKLIST = new Set([
  'kumar', 'singh', 'reddy', 'yadav', 'patil', 'sharma', 'verma',
  'gupta', 'nair', 'menon', 'pillai', 'naidu', 'sinha', 'mishra',
  'driver', 'prasad', 'bhuyan', 'kiran', 'babu', 'raju', 'ravi',
])

// ---------------------------------------------------------------------------
// Date-header detection
// xlsx with raw:false + cellDates:false formats "d-mmm" cells as "1-Feb", "2-Feb"
// xlsx with cellDates:true returns JS Date objects (handled separately)
// ---------------------------------------------------------------------------
const DATE_HEADER_SHORT_RE = /^\d{1,2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/i
const DATE_HEADER_EXT_RE   = /^\d{1,2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{2,4}$/i
const DATE_HEADER_ISO_RE   = /^\d{4}-\d{2}-\d{2}$/
const DATE_HEADER_US_RE    = /^\d{1,2}\/\d{1,2}\/\d{4}$/

function isDateHeader(h: unknown): boolean {
  // JS Date object (when cellDates:true is used by some xlsx versions)
  if (h instanceof Date) return !isNaN(h.getTime())
  if (typeof h !== 'string') return false
  return (
    DATE_HEADER_SHORT_RE.test(h) ||
    DATE_HEADER_EXT_RE.test(h)   ||
    DATE_HEADER_ISO_RE.test(h)   ||
    DATE_HEADER_US_RE.test(h)
  )
}

function dayFromHeader(h: unknown): number {
  if (h instanceof Date) return h.getDate()
  if (typeof h !== 'string') return NaN
  if (DATE_HEADER_SHORT_RE.test(h) || DATE_HEADER_EXT_RE.test(h)) return parseInt(h.split('-')[0], 10)
  if (DATE_HEADER_ISO_RE.test(h))  return parseInt(h.split('-')[2], 10)
  if (DATE_HEADER_US_RE.test(h))   return parseInt(h.split('/')[1], 10)
  return NaN
}

function monthFromHeader(h: unknown): number {
  const MONTH_MAP: Record<string, number> = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
  }
  if (h instanceof Date) return h.getMonth() + 1
  if (typeof h !== 'string') return NaN
  if (DATE_HEADER_SHORT_RE.test(h) || DATE_HEADER_EXT_RE.test(h)) {
    const parts = h.split('-')
    return MONTH_MAP[parts[1].toLowerCase()] ?? NaN
  }
  if (DATE_HEADER_ISO_RE.test(h))  return parseInt(h.split('-')[1], 10)
  if (DATE_HEADER_US_RE.test(h))   return parseInt(h.split('/')[0], 10)
  return NaN
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const clean = (val: unknown): string =>
  String(val ?? '')
    .toLowerCase()
    .replace(/\./g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const cellStr = (val: unknown): string => String(val ?? '').trim()

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred'
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/)
  return { firstName: parts[0] ?? fullName.trim(), lastName: parts.slice(1).join(' ') || '' }
}

// Infer company prefix from employee number
function inferCompanyPrefix(employeeNo: string): string {
  const u = employeeNo.trim().toUpperCase()
  if (u.startsWith('ZI')) return 'ZI'
  if (u.startsWith('SS')) return 'SS'
  if (u.startsWith('PO')) return 'PO'
  return 'A' // default: AACP / plain numeric IDs
}

// ---------------------------------------------------------------------------
// Status mapping
// ---------------------------------------------------------------------------

function mapRawToStatus(rawUpper: string): AttendanceStatus | null {
  if (!rawUpper || rawUpper === '-' || rawUpper === '--' || rawUpper === '') return null
  if (DAY_NAMES.has(rawUpper)) return null
  // Skip pure numeric values (formula results, counts, etc.)
  if (/^\d+(\.\d+)?$/.test(rawUpper)) return null

  // Exact matches first (most specific)
  if (rawUpper === 'CO/FD') return 'CO'
  if (rawUpper === 'CO/HD' || rawUpper === 'H/D') return 'HALF_DAY'

  // Partial matches for leave types
  if (rawUpper.includes('EL')) return 'EL'
  if (rawUpper.includes('SL')) return 'SL'

  // Lookup in map
  const mapped = STATUS_MAP[rawUpper]
  if (mapped) return mapped

  // Unknown code — default PRESENT rather than silently dropping
  console.warn(`[attendance-import] Unknown attendance code "${rawUpper}" — defaulting to PRESENT`)
  return 'PRESENT'
}


// ---------------------------------------------------------------------------
// Name-score matching — used for Cons/Intern employees and fallback matching
// ---------------------------------------------------------------------------

function scoreNameMatch(excelName: string, dbFirst: string, dbLast: string): number {
  const ec     = clean(excelName)
  const dbFull = clean(`${dbFirst} ${dbLast}`)
  if (!ec || !dbFull) return 0
  if (ec === dbFull) return 100
  if (dbFull.includes(ec) || ec.includes(dbFull)) return 80
  const ecNS = ec.replace(/\s/g, ''), dbNS = dbFull.replace(/\s/g, '')
  if (ecNS && ecNS === dbNS) return 75

  const ecTok = new Set(ec.split(' ').filter(t => t.length >= 4))
  const dbTok = new Set(dbFull.split(' ').filter(t => t.length >= 4))
  if (ecTok.size === 0 || dbTok.size === 0) {
    const [e0, d0] = [ec.split(' ')[0], dbFull.split(' ')[0]]
    return (e0 && d0 && e0 === d0 && e0.length >= 3) ? 20 : 0
  }
  const shared = new Set([...ecTok].filter(t => dbTok.has(t)))
  if (shared.size === 0) return 0
  // Reject matches that only share blocklisted common words
  if (![...shared].some(t => !MATCH_BLOCKLIST.has(t))) return 0
  if (shared.size === ecTok.size && shared.size === dbTok.size) return 50
  return Math.max(1, Math.floor((shared.size / new Set([...ecTok, ...dbTok]).size) * 40))
}

type DbEmployee = Awaited<ReturnType<typeof prisma.employee.findMany>>[number]

// ---------------------------------------------------------------------------
// Build employee map: Excel row key → DB employee
// Priority: exact ID match → name-score match
// ---------------------------------------------------------------------------
function buildEmployeeMap(
  dataRows: unknown[][],
  empNoIdx: number,
  nameIdx: number,
  allDbEmployees: DbEmployee[],
): { map: Map<string, DbEmployee>; unmatchedKeys: Set<string> } {
  // Build lookup by exact employeeId (uppercase, trimmed)
  const dbById = new Map<string, DbEmployee>()
  for (const emp of allDbEmployees) {
    dbById.set(emp.employeeId.trim().toUpperCase(), emp)
  }

  const map            = new Map<string, DbEmployee>()
  const usedDbIds      = new Set<string>()
  const allKeys        = new Set<string>()
  const needsNameMatch: { excelKey: string; excelName: string }[] = []

  for (const row of dataRows) {
    const excelId   = cellStr(row[empNoIdx])
    const excelName = cellStr(row[nameIdx])
    if (!excelName || excelName.length <= 2) continue
    if (!excelId) continue

    const excelKey = `${excelId}|${excelName}`
    allKeys.add(excelKey)

    // Label IDs (Intern, Cons) must always match by name
    if (LABEL_EMP_NOS.has(excelId.toUpperCase())) {
      needsNameMatch.push({ excelKey, excelName })
      continue
    }

    const dbEmp = dbById.get(excelId.trim().toUpperCase())
    if (dbEmp && !usedDbIds.has(dbEmp.id)) {
      map.set(excelKey, dbEmp)
      usedDbIds.add(dbEmp.id)
    } else {
      // ID not found or already used → fall back to name matching
      needsNameMatch.push({ excelKey, excelName })
    }
  }

  // Score-based name matching for unmatched rows
  type Cand = { excelKey: string; employee: DbEmployee; score: number }
  const candidates: Cand[] = []

  for (const { excelKey, excelName } of needsNameMatch) {
    if (map.has(excelKey)) continue
    for (const emp of allDbEmployees) {
      if (usedDbIds.has(emp.id)) continue
      const score = scoreNameMatch(excelName, emp.firstName, emp.lastName ?? '')
      if (score > 0) candidates.push({ excelKey, employee: emp, score })
    }
  }
  candidates.sort((a, b) => b.score - a.score)

  const usedExcelKeys = new Set<string>(map.keys())
  for (const { excelKey, employee } of candidates) {
    if (usedExcelKeys.has(excelKey) || usedDbIds.has(employee.id)) continue
    map.set(excelKey, employee)
    usedExcelKeys.add(excelKey)
    usedDbIds.add(employee.id)
  }

  const unmatchedKeys = new Set<string>()
  for (const key of allKeys) if (!map.has(key)) unmatchedKeys.add(key)

  return { map, unmatchedKeys }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AttendanceRecordInput = {
  employeeId: string
  date:       Date
  status:     AttendanceStatus
  notes:      string // raw Excel code — used for CO refund on re-import
}

type BalanceDelta = { el: number; sl: number; co: number }

// ---------------------------------------------------------------------------
// POST  /api/employees/attendance/import
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const formData   = await request.formData()
    const file       = formData.get('file') as File | null
    const monthValue = formData.get('month') as string | null

    if (!file || !monthValue) {
      return NextResponse.json({ success: false, error: 'Missing file or month.' }, { status: 400 })
    }

    const [yearStr, monthStr] = monthValue.split('-')
    const year  = Number(yearStr)
    const month = Number(monthStr)

    if (!year || !month || isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json(
        { success: false, error: 'Invalid month format. Expected YYYY-MM.' },
        { status: 400 },
      )
    }

    // -----------------------------------------------------------------------
    // Parse workbook
    // Use raw:false so date-formatted cells become strings like "1-Feb"
    // cellDates:false ensures consistent string output
    // -----------------------------------------------------------------------
    const buffer   = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array', raw: false, cellDates: false })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]

    const allRows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw:    false,
      defval: '',
    }) as unknown[][]

    if (allRows.length < 2) {
      return NextResponse.json({ success: false, error: 'File is empty or has only one row.' }, { status: 400 })
    }

    // -----------------------------------------------------------------------
    // Find the header row — must contain "Employee No" column
    // Skip the legend row (row 1) automatically
    // -----------------------------------------------------------------------
    const headerRowIndex = allRows.findIndex((row) =>
      row.some((cell) => {
        const c = clean(cell)
        return (
          c === 'employee no'     ||
          c === 'emp no'          ||
          c === 'employee number' ||
          c === 'empno'           ||
          c === 'employee id'     ||
          c === 'emp id'
        )
      }),
    )

    if (headerRowIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Header row with "Employee No" not found. ` +
            `First 4 rows: ${allRows.slice(0, 4).map(r => r.slice(0, 5).join('|')).join(' // ')}`,
        },
        { status: 400 },
      )
    }

    const rawHeaders = allRows[headerRowIndex] as unknown[]
    const headers    = rawHeaders.map(h => cellStr(h).trim())

    // -----------------------------------------------------------------------
    // Column indices — text summary columns
    // -----------------------------------------------------------------------
    const findCol = (...candidates: string[]): number =>
      headers.findIndex(h => candidates.includes(clean(h)))

    const empNoIdx    = findCol('employee no', 'emp no', 'employee number', 'empno', 'employee id', 'emp id')
    const nameIdx     = findCol('name', 'employee name', 'emp name', 'full name')
    const desigIdx    = headers.findIndex(h => clean(h).startsWith('designation'))
    const joinDateIdx = headers.findIndex(h => clean(h).includes('join'))

    const paidDaysIdx    = findCol('paid days')
    const presentDaysIdx = findCol('present days')
    const hdIdx          = findCol('hd')
    const woffIdx        = headers.findIndex(h => clean(h).replace(/[-\s]/g, '') === 'woff')
    const leaveIdx       = findCol('leave')
    const lGivenIdx      = headers.findIndex(h => clean(h).replace(/[\s.]/g, '') === 'lgiven')
    const cOffGivenIdx   = headers.findIndex(h => clean(h).replace(/[\s.]/g, '') === 'coffgiven')
    const compOffIdx     = headers.findIndex(h => {
      const c = clean(h)
      return (c.includes('comp') || c.includes('co')) &&
             (c.includes('acqui') || c.includes('earned') || c.includes('pff'))
    })

    if (empNoIdx === -1 || nameIdx === -1) {
      return NextResponse.json(
        {
          success: false,
          error: `Required columns "Employee No" and "Name" not found. Headers found: ${headers.slice(0, 15).join(' | ')}`,
        },
        { status: 400 },
      )
    }

    const toNum = (row: unknown[], idx: number): number =>
      idx !== -1 ? (parseFloat(cellStr(row[idx])) || 0) : 0

    // -----------------------------------------------------------------------
    // Identify date columns
    // The raw headers for date cols are strings like "1-Feb", "2-Feb" (raw:false)
    // Validate each against the selected month/year to prevent wrong-file imports
    // -----------------------------------------------------------------------
    const dateColIndices: { idx: number; day: number }[] = []
    let dateMonthMismatch = 0

    for (let i = 0; i < rawHeaders.length; i++) {
      const h = rawHeaders[i]
      if (!isDateHeader(h)) continue

      const day       = dayFromHeader(h)
      const headerMon = monthFromHeader(h)

      if (isNaN(day) || day < 1 || day > 31) continue

      // Warn if date headers don't match the selected month
      // (allows import to proceed but flags the issue)
      if (!isNaN(headerMon) && headerMon !== month) {
        dateMonthMismatch++
        continue // skip columns that belong to a different month
      }

      dateColIndices.push({ idx: i, day })
    }

    if (dateColIndices.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            `No date columns found for the selected month (${year}-${String(month).padStart(2, '0')}). ` +
            `Headers found: ${headers.slice(0, 20).join(' | ')}. ` +
            `Expected format: "1-Feb", "2-Feb" etc. ` +
            (dateMonthMismatch > 0
              ? `Note: ${dateMonthMismatch} date columns were skipped because they belong to a different month — make sure you selected the correct month.`
              : ''),
        },
        { status: 400 },
      )
    }

    // -----------------------------------------------------------------------
    // Extract data rows
    // Skip: blanks, day-of-week row, header repeats, total rows
    // -----------------------------------------------------------------------
    const dataRows = allRows.slice(headerRowIndex + 1).filter((row) => {
      // Skip fully empty rows (company group separators)
      if (row.every(c => c === '' || c === null || c === undefined)) return false

      const name   = cellStr(row[nameIdx])
      const empNo  = cellStr(row[empNoIdx])

      // Skip rows with no name or very short name
      if (!name || name.length <= 2) return false
      // Skip header repeat rows
      if (clean(name) === 'name') return false
      // Skip day-of-week rows
      if (DAY_NAMES.has(name.toUpperCase())) return false
      // Skip rows where empNo looks like a day name
      if (DAY_NAMES.has(empNo.toUpperCase())) return false
      // Skip total/summary rows
      const lc = name.toLowerCase()
      if (lc.includes('total') || lc.includes('grand total')) return false

      return true
    })

    if (dataRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No employee data rows found after header row.' },
        { status: 400 },
      )
    }

    // -----------------------------------------------------------------------
    // Load all DB data
    // -----------------------------------------------------------------------
    const [allCompanies, allDbEmployees] = await Promise.all([
      prisma.company.findMany({ select: { id: true, name: true } }),
      prisma.employee.findMany(),
    ])

    if (allDbEmployees.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No employees found in the database.' },
        { status: 400 },
      )
    }

    // Build prefix → companyId map from existing employees
    const prefixCompanyMap = new Map<string, string>()
    for (const emp of allDbEmployees) {
      const prefix = inferCompanyPrefix(emp.employeeId)
      if (!prefixCompanyMap.has(prefix)) prefixCompanyMap.set(prefix, emp.companyId)
    }
    const fallbackCompanyId = allCompanies[0]?.id ?? ''

    const getCompanyId = (employeeNo: string): string => {
      if (LABEL_EMP_NOS.has(employeeNo.toUpperCase())) return fallbackCompanyId
      return prefixCompanyMap.get(inferCompanyPrefix(employeeNo)) ?? fallbackCompanyId
    }

    // -----------------------------------------------------------------------
    // Match Excel rows → DB employees
    // -----------------------------------------------------------------------
    const { map: employeeMap, unmatchedKeys } = buildEmployeeMap(
      dataRows, empNoIdx, nameIdx, allDbEmployees,
    )

    // -----------------------------------------------------------------------
    // Auto-create unmatched employees — with duplicate prevention
    // -----------------------------------------------------------------------
    const unmatchedRowMap = new Map<string, unknown[]>()
    for (const row of dataRows) {
      const excelId   = cellStr(row[empNoIdx])
      const excelName = cellStr(row[nameIdx])
      if (!excelName || excelName.length <= 2) continue
      const key = `${excelId}|${excelName}`
      if (unmatchedKeys.has(key) && !unmatchedRowMap.has(key)) {
        unmatchedRowMap.set(key, row)
      }
    }

    let created = 0
    const skippedDuplicates: string[] = []
    const failedCreations:   string[] = []

    for (const [key, row] of unmatchedRowMap.entries()) {
      const excelId   = cellStr(row[empNoIdx])
      const excelName = cellStr(row[nameIdx])
      const rawDesig  = desigIdx    !== -1 ? cellStr(row[desigIdx]).trim()   : ''
      const rawJoin   = joinDateIdx !== -1 ? cellStr(row[joinDateIdx])       : ''
      const { firstName, lastName } = splitName(excelName)
      const companyId  = getCompanyId(excelId)

      // Build the employeeId that would be stored in DB
      const employeeId = LABEL_EMP_NOS.has(excelId.toUpperCase())
        ? `${excelId}-${firstName}`.slice(0, 30)
        : excelId

      // ✅ DUPLICATE PREVENTION:
      // Check if this employeeId already exists in ANY company before creating.
      // This prevents ghost duplicates when the same short code (e.g. "1", "5", "7")
      // exists under a different company than what inferCompanyPrefix guessed.
      const existingAnyCompany = await prisma.employee.findFirst({
        where: { employeeId },
      })
      if (existingAnyCompany) {
        console.warn(
          `[import] Skipping auto-create for [${employeeId}] "${excelName}" — ` +
          `already exists as "${existingAnyCompany.firstName} ${existingAnyCompany.lastName}" ` +
          `(id: ${existingAnyCompany.id}). Mapping to existing employee.`,
        )
        employeeMap.set(key, existingAnyCompany)
        skippedDuplicates.push(`${employeeId} "${excelName}" → mapped to existing "${existingAnyCompany.firstName} ${existingAnyCompany.lastName}"`)
        continue
      }

      let joiningDate: Date | undefined
      if (rawJoin) {
        const p = new Date(rawJoin)
        if (!isNaN(p.getTime())) joiningDate = p
      }

      try {
        const newEmp = await prisma.employee.create({
          data: {
            companyId,
            employeeId,
            firstName,
            lastName,
            designation: rawDesig || null,
            joiningDate,
            status:    'ACTIVE',
            elBalance: 0,
            slBalance: 0,
            coBalance: 0,
          },
        })
        employeeMap.set(key, newEmp)
        created++
        console.log(`[import] Created new employee: [${employeeId}] "${excelName}" in company ${companyId}`)
      } catch (err) {
        // Race condition fallback — try to find by companyId + employeeId
        const existing = await prisma.employee.findFirst({ where: { companyId, employeeId } })
        if (existing) {
          employeeMap.set(key, existing)
          skippedDuplicates.push(`${employeeId} "${excelName}" → found on retry`)
        } else {
          console.error(`[import] Could not create or find employee: ${key}`, err)
          failedCreations.push(`${key}: ${getErrorMessage(err)}`)
        }
      }
    }

    // -----------------------------------------------------------------------
    // Balance snapshot — current DB state before this import
    // -----------------------------------------------------------------------
    const balanceSnapshot = new Map<string, BalanceDelta>()
    for (const emp of allDbEmployees) {
      balanceSnapshot.set(emp.id, {
        el: emp.elBalance ?? 0,
        sl: emp.slBalance ?? 0,
        co: emp.coBalance ?? 0,
      })
    }

    const balanceUpdates = new Map<string, BalanceDelta>()
    const getBalance = (empDbId: string): BalanceDelta => {
      if (!balanceUpdates.has(empDbId)) {
        const snap = balanceSnapshot.get(empDbId) ?? { el: 0, sl: 0, co: 0 }
        balanceUpdates.set(empDbId, { ...snap })
      }
      return balanceUpdates.get(empDbId)!
    }

    // -----------------------------------------------------------------------
    // PASS 1 — Set EL and CO balances from Excel summary columns FIRST
    // These are authoritative values from the Excel, not derived from attendance.
    //
    //   "L. Given"          (col 12) = current EL balance remaining for employee
    //   "C.OFF Given"       (col 13) = comp-off days consumed this month
    //   "Comp pff acquired" (col 14) = comp-off days earned this month
    //
    // elBalance = L.Given  (direct — Excel tracks remaining balance)
    // coBalance = (previous coBalance) + compOffEarned - cOffGiven
    // slBalance = kept from DB (not tracked in this Excel format)
    // -----------------------------------------------------------------------
    for (const row of dataRows) {
      const excelId   = cellStr(row[empNoIdx])
      const excelName = cellStr(row[nameIdx])
      if (!excelName || excelName.length <= 2 || !excelId) continue
      const employee = employeeMap.get(`${excelId}|${excelName}`)
      if (!employee) continue

      const bal = getBalance(employee.id)

      // EL balance — "L. Given" is the authoritative remaining EL balance
      const lGiven = toNum(row, lGivenIdx)
      if (lGivenIdx !== -1 && cellStr(row[lGivenIdx]) !== '') {
        // Only override if Excel explicitly has a value (not blank)
        bal.el = Math.max(0, lGiven)
      }

      // CO balance — previous balance + earned this month - used this month
      const compOffEarned = toNum(row, compOffIdx)
      const cOffGiven     = toNum(row, cOffGivenIdx)
      if (compOffEarned > 0 || cOffGiven > 0) {
        const snap = balanceSnapshot.get(employee.id) ?? { el: 0, sl: 0, co: 0 }
        bal.co = Math.max(0, snap.co + compOffEarned - cOffGiven)
      }

      // SL balance — not present in this Excel format, keep existing DB value
    }

    // -----------------------------------------------------------------------
    // Build attendance records from date columns
    // -----------------------------------------------------------------------
    const attendanceRecords: AttendanceRecordInput[] = []
    const daysInMonth    = new Date(Date.UTC(year, month, 0)).getUTCDate()
    const unmatchedRows: string[] = []

    for (const row of dataRows) {
      const excelId   = cellStr(row[empNoIdx])
      const excelName = cellStr(row[nameIdx])
      if (!excelName || excelName.length <= 2 || !excelId) continue

      const employee = employeeMap.get(`${excelId}|${excelName}`)
      if (!employee) {
        console.warn(`[import] No DB match for [${excelId}] "${excelName}" — skipping attendance`)
        unmatchedRows.push(`[${excelId}] "${excelName}"`)
        continue
      }

      for (const { idx, day } of dateColIndices) {
        if (day > daysInMonth) continue

        const rawVal = cellStr(row[idx]).toUpperCase()
        const status = mapRawToStatus(rawVal)
        if (status === null) continue // '-', blank, day names → skip

        attendanceRecords.push({
          employeeId: employee.id,
          date:       new Date(Date.UTC(year, month - 1, day)),
          status,
          notes:      rawVal,
        })
      }
    }

    // -----------------------------------------------------------------------
    // Persist attendance records (upsert — safe to re-import)
    // -----------------------------------------------------------------------
    let totalUpdated   = 0
    const persistErrors: string[] = []

    for (const record of attendanceRecords) {
      try {
        await prisma.attendanceRecord.upsert({
          where:  { employeeId_date: { employeeId: record.employeeId, date: record.date } },
          update: { status: record.status, notes: record.notes },
          create: {
            employeeId: record.employeeId,
            date:       record.date,
            status:     record.status,
            notes:      record.notes,
          },
        })
        totalUpdated++
      } catch (err) {
        const msg =
          `Upsert failed — empId=${record.employeeId} ` +
          `date=${record.date.toISOString().split('T')[0]}: ${getErrorMessage(err)}`
        console.error(`[import] ${msg}`)
        persistErrors.push(msg)
      }
    }

    // -----------------------------------------------------------------------
    // Persist EL / SL / CO balance updates
    // -----------------------------------------------------------------------
    let balancesUpdated = 0
    for (const [id, bal] of balanceUpdates.entries()) {
      try {
        await prisma.employee.update({
          where: { id },
          data: {
            elBalance: Math.max(0, parseFloat(bal.el.toFixed(2))),
            slBalance: Math.max(0, parseFloat(bal.sl.toFixed(2))),
            coBalance: Math.max(0, parseFloat(bal.co.toFixed(2))),
          },
        })
        balancesUpdated++
      } catch (err) {
        console.error(`[import] Balance update failed — empId=${id}:`, getErrorMessage(err))
      }
    }

    // -----------------------------------------------------------------------
    // Upsert monthly summaries (summary columns from Excel)
    // -----------------------------------------------------------------------
    let summariesUpserted = 0
    for (const row of dataRows) {
      const excelId   = cellStr(row[empNoIdx])
      const excelName = cellStr(row[nameIdx])
      if (!excelName || excelName.length <= 2 || !excelId) continue
      const employee = employeeMap.get(`${excelId}|${excelName}`)
      if (!employee) continue

      const summaryData = {
        paidDays:      toNum(row, paidDaysIdx),
        presentDays:   toNum(row, presentDaysIdx),
        hdCount:       toNum(row, hdIdx),
        woffCount:     toNum(row, woffIdx),
        leaveCount:    toNum(row, leaveIdx),
        lGiven:        toNum(row, lGivenIdx),
        cOffGiven:     toNum(row, cOffGivenIdx),
        compOffEarned: toNum(row, compOffIdx),
      }

      // Skip rows where all summary values are zero
      if (!Object.values(summaryData).some(v => v !== 0)) continue

      try {
        await prisma.attendanceMonthlySummary.upsert({
          where:  { employeeId_year_month: { employeeId: employee.id, year, month } },
          update: summaryData,
          create: { employeeId: employee.id, year, month, ...summaryData },
        })
        summariesUpserted++
      } catch (err) {
        console.error(`[import] Summary upsert failed — empId=${employee.id}:`, getErrorMessage(err))
      }
    }

    // -----------------------------------------------------------------------
    // Response — include full diagnostic info
    // -----------------------------------------------------------------------
    return NextResponse.json({
      success:            true,
      count:              totalUpdated,
      employeesMatched:   employeeMap.size,
      employeesCreated:   created,
      summariesUpserted,
      balancesUpdated,
      dateColumnsFound:   dateColIndices.length,
      dataRowsProcessed:  dataRows.length,
      // Warnings (non-fatal)
      ...(dateMonthMismatch > 0 && {
        warning: `${dateMonthMismatch} date column(s) were skipped because they belong to a different month than selected.`,
      }),
      ...(unmatchedRows.length > 0 && {
        unmatchedEmployees: unmatchedRows,
      }),
      ...(skippedDuplicates.length > 0 && {
        duplicatesPrevented: skippedDuplicates,
      }),
      ...(failedCreations.length > 0 && {
        failedCreations,
      }),
      ...(persistErrors.length > 0 && {
        errors: persistErrors.slice(0, 20),
      }),
    })

  } catch (error: unknown) {
    console.error('[import] Attendance import failure:', error)
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 },
    )
  }
}