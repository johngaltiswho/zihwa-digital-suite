'use client'

import { useEffect, useMemo, useState } from 'react'
import type { AttendanceStatus, EmployeeStatus, PayrollStatus } from '@prisma/client'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock3,
  CreditCard,
  Loader2,
  Search,
  TrendingUp,
  Upload,
  UserPlus,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type CompanyOption = { id: string; name: string }
type CompanyApiResponse = CompanyOption

type EmployeeRow = {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  fullName: string
  designation?: string | null
  department?: string | null
  status: EmployeeStatus
  email?: string | null
  phone?: string | null
  netSalary?: number | null
  grossSalary?: number | null
  joiningDate?: string | Date | null
  company?: CompanyOption | null
  bankAccountNumber?: string | null
  ifscCode?: string | null
  elBalance?: number | null
  slBalance?: number | null
  stats?: {
    attendance: number
    payrollRuns: number
  }
  recentAttendance?: AttendanceRecordWithEmployee[]
  recentPayrolls?: PayrollRecordWithEmployee[]
}

type AttendanceRecordWithEmployee = {
  id: string
  employeeId: string
  date: string | Date
  status: AttendanceStatus
  checkIn?: string | Date | null
  checkOut?: string | Date | null
  notes?: string | null
  employee: {
    id: string
    employeeId: string
    firstName: string
    lastName: string
    department?: string | null
  }
}

type PayrollRecordWithEmployee = {
  id: string
  employeeId: string
  month: number
  year: number
  grossAmount: number
  netAmount: number
  bonus?: number | null
  deductions?: number | null
  status: PayrollStatus
  processedAt?: string | Date | null
  notes?: string | null
  employee: {
    id: string
    employeeId: string
    firstName: string
    lastName: string
    department?: string | null
    companyId?: string | null
    company?: {
      id: string
      name: string
    } | null
  }
}

type BulkUploadSummary = {
  totalRows: number
  processedRows: number
  created: number
  updated: number
  failed: number
  company: string
}

type BulkFailedRow = {
  rowNumber: number
  errors: string[]
}

type Tab = 'employees' | 'attendance' | 'payroll'

const ATTENDANCE_OPTIONS: AttendanceStatus[] = ['PRESENT', 'ABSENT', 'REMOTE', 'LEAVE']
const ATTENDANCE_CODES: { value: AttendanceStatus; code: string; label: string }[] = [
  { value: 'PRESENT', code: 'P', label: 'Present' },
  { value: 'ABSENT', code: 'A', label: 'Absent' },
  { value: 'REMOTE', code: 'PH', label: 'Present on Holiday' },
  { value: 'LEAVE', code: 'H', label: 'Holiday' },
  { value: 'EL', code: 'EL', label: 'Earned Leave' },
  { value: 'SL', code: 'SL', label: 'Sick Leave' },
]
const EMPLOYEE_STATUSES: EmployeeStatus[] = ['ACTIVE', 'INACTIVE', 'TERMINATED']
const ATTENDANCE_KEY_DELIMITER = '__@__'

const buildAttendanceKey = (employeeId: string, isoDate: string) => `${employeeId}${ATTENDANCE_KEY_DELIMITER}${isoDate}`
const parseAttendanceKey = (key: string) => {
  const [id, isoDate] = key.split(ATTENDANCE_KEY_DELIMITER)
  return { employeeId: id, date: isoDate }
}

const formatCurrency = (value?: number | null) => {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

const formatLeaveBalance = (value?: number | null) => {
  if (value === null || value === undefined) return '0'
  const fixed = Number(value).toFixed(1)
  return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed
}

const formatDate = (value?: string | Date | null) => {
  if (!value) return '—'
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getMonthInputValue = (date = new Date()) => {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}`
}

const generateMonthOptions = () => {
  const options = []
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  
  // Generate options for the last 12 months and next 12 months
  for (let i = -12; i <= 12; i++) {
    const targetDate = new Date(currentYear, currentMonth + i, 1)
    const year = targetDate.getFullYear()
    const month = targetDate.getMonth() + 1
    const value = `${year}-${String(month).padStart(2, '0')}`
    const label = targetDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    options.push({ value, label })
  }
  
  return options
}

const getMonthLabel = (year: number, month: number) => {
  const date = new Date(year, month - 1, 1)
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

const formatMonthFilterLabel = (value: string) => {
  if (!value) return ''
  const [year, month] = value.split('-').map(Number)
  if (!year || !month) return ''
  return getMonthLabel(year, month)
}

export default function EmployeesPage() {
  const today = useMemo(() => new Date(), [])
  const defaultMonth = useMemo(() => getMonthInputValue(today), [today])
  const monthOptions = useMemo(() => generateMonthOptions(), [])

  const [tab, setTab] = useState<Tab>('employees')
  const [loading, setLoading] = useState(true)
  const [employeeLoading, setEmployeeLoading] = useState(false)
  const [attendanceLoading, setAttendanceLoading] = useState(false)
  const [payrollLoading, setPayrollLoading] = useState(false)

  const [employees, setEmployees] = useState<EmployeeRow[]>([])
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecordWithEmployee[]>([])
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecordWithEmployee[]>([])

  const [attendanceMonth, setAttendanceMonth] = useState(defaultMonth)
  const [attendanceCompanyFilter, setAttendanceCompanyFilter] = useState('all')
  const [payrollMonth, setPayrollMonth] = useState(defaultMonth)
  const [payrollCompanyFilter, setPayrollCompanyFilter] = useState('all')

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | EmployeeStatus>('all')
  const [companyFilter, setCompanyFilter] = useState('all')

  const [newEmployee, setNewEmployee] = useState({
    companyId: '',
    employeeId: '',
    firstName: '',
    lastName: '',
    designation: '',
    department: '',
    email: '',
    phone: '',
    netSalary: '',
    joiningDate: '',
    status: 'ACTIVE' as EmployeeStatus,
  })
  const [savingEmployee, setSavingEmployee] = useState(false)

  const [bulkCompanyId, setBulkCompanyId] = useState('')
  const [bulkFile, setBulkFile] = useState<File | null>(null)
  const [bulkUploading, setBulkUploading] = useState(false)
  const [bulkResult, setBulkResult] = useState<{ summary: BulkUploadSummary; failed: BulkFailedRow[] } | null>(null)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    designation: '',
    department: '',
    netSalary: '',
    grossSalary: '',
    bankAccountNumber: '',
    ifscCode: '',
    status: 'ACTIVE' as EmployeeStatus,
    elBalance: '',
    slBalance: '',
  })
  const [savingRow, setSavingRow] = useState(false)
  const [deletingRow, setDeletingRow] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAttendanceRow, setEditingAttendanceRow] = useState<string | null>(null)
  const [pendingAttendance, setPendingAttendance] = useState<Map<string, AttendanceStatus>>(new Map())
  const [generatingPayroll, setGeneratingPayroll] = useState(false)

  const fetchEmployees = async () => {
    setEmployeeLoading(true)
    try {
      const res = await fetch('/api/employees')
      const data = await res.json()
      if (data.success) {
        setEmployees(data.data)
      } else {
        throw new Error(data.error || 'Failed to load employees')
      }
    } catch (error) {
      console.error(error)
      alert('Failed to load employees')
    } finally {
      setEmployeeLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/companies')
      const data = (await res.json()) as CompanyApiResponse[]
      if (Array.isArray(data)) {
        setCompanies(data.map((company) => ({ id: company.id, name: company.name })))
      }
    } catch (error) {
      console.error('Failed to load companies', error)
    }
  }

  const fetchAttendance = async (monthValue = attendanceMonth) => {
    setAttendanceLoading(true)
    try {
      const res = await fetch(`/api/employees/attendance?month=${monthValue}`)
      const data = res.headers.get('Content-Type')?.includes('application/json') ? await res.json() : null

      if (res.ok && data?.success) {
        setAttendanceRecords(data.data.records || [])
      } else {
        console.warn('Attendance API unavailable, falling back to empty data')
        setAttendanceRecords([])
      }
    } catch (error) {
      console.error('Failed to load attendance', error)
      setAttendanceRecords([])
    } finally {
      setAttendanceLoading(false)
    }
  }

  const fetchPayroll = async (monthValue = payrollMonth) => {
    if (!monthValue) return
    const [year, month] = monthValue.split('-').map(Number)
    setPayrollLoading(true)
    try {
      const params = new URLSearchParams()
      if (month) params.set('month', String(month))
      if (year) params.set('year', String(year))
      const res = await fetch(`/api/employees/payroll?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setPayrollRecords(data.data || [])
      } else {
        throw new Error(data.error || 'Failed to load payroll')
      }
    } catch (error) {
      console.error(error)
      alert('Failed to load payroll records')
    } finally {
      setPayrollLoading(false)
    }
  }

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true)
      await Promise.all([
        fetchEmployees(),
        fetchCompanies(),
        fetchAttendance(defaultMonth),
        fetchPayroll(defaultMonth),
      ])
      setLoading(false)
    }
    bootstrap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshAll = async () => {
    setLoading(true)
    await Promise.all([fetchEmployees(), fetchAttendance(attendanceMonth), fetchPayroll(payrollMonth)])
    setLoading(false)
  }

  const handleBulkUpload = async () => {
    if (!bulkCompanyId) {
      alert('Select a company for the upload.')
      return
    }
    if (!bulkFile) {
      alert('Choose a CSV file to upload.')
      return
    }
    setBulkUploading(true)
    try {
      const formData = new FormData()
      formData.append('companyId', bulkCompanyId)
      formData.append('file', bulkFile)

      const response = await fetch('/api/employees/import', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to import employees')
      }

      setBulkResult({ summary: data.summary, failed: data.failed || [] })
      setBulkFile(null)
      setFileInputKey((key) => key + 1)
      await fetchEmployees()
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Failed to upload employees')
    } finally {
      setBulkUploading(false)
    }
  }

  const downloadTemplate = () => {
    const headers = [
      'Sno',
      'Full Name',
      'Net Salary',
      'Gross Salary',
      'Bank Account Number',
      'IFSC Code',
    ]
    const sample = ['E-001', 'Ava Shah', '82000', '90000', '123456789012', 'HDFC0001234']
    const csvContent = [headers.join(','), sample.join(',')].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'employee-upload-template.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const startEditingEmployee = (employee: EmployeeRow) => {
    setEditingEmployeeId(employee.id)
    setEditForm({
      firstName: employee.firstName,
      lastName: employee.lastName,
      designation: employee.designation || '',
      department: employee.department || '',
      netSalary: employee.netSalary ? String(employee.netSalary) : '',
      grossSalary: employee.grossSalary ? String(employee.grossSalary) : '',
      bankAccountNumber: employee.bankAccountNumber || '',
      ifscCode: employee.ifscCode || '',
      status: employee.status,
      elBalance: employee.elBalance !== undefined && employee.elBalance !== null ? String(employee.elBalance) : '',
      slBalance: employee.slBalance !== undefined && employee.slBalance !== null ? String(employee.slBalance) : '',
    })
  }

  const handleEditChange = (field: keyof typeof editForm, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const cancelEditingEmployee = () => {
    setEditingEmployeeId(null)
    setSavingRow(false)
  }

  const saveEditingEmployee = async () => {
    if (!editingEmployeeId) return
    setSavingRow(true)
    try {
      const payload = {
        id: editingEmployeeId,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        designation: editForm.designation,
        department: editForm.department,
        netSalary: editForm.netSalary ? Number(editForm.netSalary) : null,
        grossSalary: editForm.grossSalary ? Number(editForm.grossSalary) : null,
        bankAccountNumber: editForm.bankAccountNumber,
        ifscCode: editForm.ifscCode,
        status: editForm.status,
        elBalance: editForm.elBalance === '' ? undefined : Number(editForm.elBalance),
        slBalance: editForm.slBalance === '' ? undefined : Number(editForm.slBalance),
      }
      const response = await fetch('/api/employees', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update employee')
      }
      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === editingEmployeeId
            ? {
                ...employee,
                ...data.data,
                netSalary: data.data.netSalary,
                grossSalary: data.data.grossSalary,
                designation: data.data.designation,
                department: data.data.department,
                elBalance:
                  data.data.elBalance !== undefined && data.data.elBalance !== null
                    ? data.data.elBalance
                    : employee.elBalance,
                slBalance:
                  data.data.slBalance !== undefined && data.data.slBalance !== null
                    ? data.data.slBalance
                    : employee.slBalance,
              }
            : employee
        )
      )
      cancelEditingEmployee()
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Failed to update employee')
    } finally {
      setSavingRow(false)
    }
  }

  const handleDeleteEmployee = async (id: string) => {
    const confirmed = window.confirm('Delete this employee? This action cannot be undone.')
    if (!confirmed) return
    setDeletingRow(id)
    try {
      const response = await fetch('/api/employees', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete employee')
      }
      setEmployees((prev) => prev.filter((employee) => employee.id !== id))
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Failed to delete employee')
    } finally {
      setDeletingRow(null)
    }
  }

  const handleAddEmployee = async () => {
    if (!newEmployee.companyId || !newEmployee.employeeId || !newEmployee.firstName || !newEmployee.lastName) {
      alert('Company, employee ID, first name and last name are required')
      return
    }
    setSavingEmployee(true)
    try {
      const payload = {
        ...newEmployee,
        netSalary: newEmployee.netSalary ? Number(newEmployee.netSalary) : undefined,
        joiningDate: newEmployee.joiningDate || undefined,
      }
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to create employee')
      }
      await fetchEmployees()
      setNewEmployee({
        companyId: '',
        employeeId: '',
        firstName: '',
        lastName: '',
        designation: '',
        department: '',
        email: '',
        phone: '',
        netSalary: '',
        joiningDate: '',
        status: 'ACTIVE',
      })
      setShowAddModal(false)
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Failed to add employee')
    } finally {
      setSavingEmployee(false)
    }
  }

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return employees
      .filter((employee) => {
        if (statusFilter !== 'all' && employee.status !== statusFilter) return false
        if (companyFilter !== 'all' && employee.company?.id !== companyFilter) return false
        if (!term) return true
        const haystack = [
          employee.fullName,
          employee.department || '',
          employee.designation || '',
          employee.employeeId,
          employee.company?.name || '',
        ]
        return haystack.some((value) => value.toLowerCase().includes(term))
      })
      .sort((a, b) => a.fullName.localeCompare(b.fullName))
  }, [employees, searchTerm, statusFilter, companyFilter])

  const attendanceSummary = useMemo(() => {
    return ATTENDANCE_OPTIONS.reduce<Record<AttendanceStatus, number>>((acc, status) => {
      acc[status] = attendanceRecords.filter((record) => record.status === status).length
      return acc
    }, {} as Record<AttendanceStatus, number>)
  }, [attendanceRecords])

  const attendanceMonthParts = useMemo(() => {
    if (!attendanceMonth) return { year: 0, month: 0 }
    const [year, month] = attendanceMonth.split('-').map(Number)
    return { year, month }
  }, [attendanceMonth])

  const attendanceDays = useMemo(() => {
    const { year, month } = attendanceMonthParts
    if (!year || !month) return []
    const daysInMonth = new Date(year, month, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, index) => index + 1)
  }, [attendanceMonthParts])

  const attendanceStatusMap = useMemo(() => {
    const map = new Map<string, AttendanceStatus>()
    attendanceRecords.forEach((record) => {
      const dateKey = new Date(record.date).toISOString().split('T')[0]
      map.set(buildAttendanceKey(record.employeeId, dateKey), record.status)
    })
    return map
  }, [attendanceRecords])

  const filteredAttendanceEmployees = useMemo(() => {
    if (attendanceCompanyFilter === 'all') return filteredEmployees
    return filteredEmployees.filter((employee) => employee.company?.id === attendanceCompanyFilter)
  }, [attendanceCompanyFilter, filteredEmployees])
  const filteredPayrollRecords = useMemo(() => {
    if (payrollCompanyFilter === 'all') return payrollRecords
    return payrollRecords.filter((record) => record.employee?.companyId === payrollCompanyFilter)
  }, [payrollCompanyFilter, payrollRecords])

  const payrollSummary = useMemo(() => {
    const totalGross = filteredPayrollRecords.reduce((sum, record) => sum + record.grossAmount, 0)
    const totalNet = filteredPayrollRecords.reduce((sum, record) => sum + record.netAmount, 0)
    const paid = filteredPayrollRecords.filter((record) => record.status === 'PAID').length
    return { totalGross, totalNet, paid }
  }, [filteredPayrollRecords])

  const statusBadge = (status: EmployeeStatus) => {
    const map: Record<EmployeeStatus, string> = {
      ACTIVE: 'bg-green-50 text-green-700',
      INACTIVE: 'bg-gray-100 text-gray-600',
      TERMINATED: 'bg-red-50 text-red-600',
    }
    return map[status]
  }

  const handleAttendanceDraftChange = (employeeId: string, day: number, status: AttendanceStatus) => {
    if (!attendanceMonthParts.year || !attendanceMonthParts.month) return
    const targetDate = new Date(Date.UTC(attendanceMonthParts.year, attendanceMonthParts.month - 1, day))
    const isoDate = targetDate.toISOString().split('T')[0]
    const key = buildAttendanceKey(employeeId, isoDate)
    setPendingAttendance((prev) => {
      const next = new Map(prev)
      next.set(key, status)
      return next
    })
  }

  const getAttendanceDisplay = (status: AttendanceStatus | undefined) => {
    if (!status) return '—'
    const option = ATTENDANCE_CODES.find((code) => code.value === status)
    return option ? option.code : status
  }

  const startEditingAttendance = (employeeId: string) => {
    setEditingAttendanceRow(employeeId)
    setPendingAttendance(new Map())
  }

  const cancelEditingAttendance = () => {
    setEditingAttendanceRow(null)
    setPendingAttendance(new Map())
  }

  const computeLeaveNetChanges = (employeeId: string) => {
    if (!attendanceMonthParts.year || !attendanceMonthParts.month) {
      return { el: 0, sl: 0 }
    }
    let existingEl = 0
    let existingSl = 0
    let finalEl = 0
    let finalSl = 0

    attendanceDays.forEach((day) => {
      const isoDate = new Date(Date.UTC(attendanceMonthParts.year, attendanceMonthParts.month - 1, day))
        .toISOString()
        .split('T')[0]
      const key = buildAttendanceKey(employeeId, isoDate)
      const existingStatus = attendanceStatusMap.get(key)
      const nextStatus = pendingAttendance.get(key) || existingStatus

      if (existingStatus === 'EL') existingEl += 1
      if (existingStatus === 'SL') existingSl += 1
      if (nextStatus === 'EL') finalEl += 1
      if (nextStatus === 'SL') finalSl += 1
    })

    return {
      el: finalEl - existingEl,
      sl: finalSl - existingSl,
    }
  }

  const saveAttendanceRow = async (employeeId: string) => {
    if (pendingAttendance.size === 0) {
      setEditingAttendanceRow(null)
      return
    }

    const employee = employees.find((emp) => emp.id === employeeId)
    if (!employee) return

    const { el: netElChange, sl: netSlChange } = computeLeaveNetChanges(employeeId)
    if (netElChange > 0 && (employee.elBalance ?? 0) < netElChange) {
      alert('Not enough earned leave balance for this employee.')
      return
    }
    if (netSlChange > 0 && (employee.slBalance ?? 0) < netSlChange) {
      alert('Not enough sick leave balance for this employee.')
      return
    }

    try {
      const updates = Array.from(pendingAttendance.entries())
        .map(([key, status]) => ({ ...parseAttendanceKey(key), status }))
        .filter((entry) => entry.employeeId === employeeId && entry.date)

      await Promise.all(
        updates.map(async ({ date, status }) => {
          const response = await fetch('/api/employees/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              employeeId,
              date,
              status,
            }),
          })
          if (!response.ok) {
            const data = await response.json().catch(() => null)
            const message = data?.error || 'Failed to save attendance record'
            throw new Error(message)
          }
        })
      )
      await fetchAttendance(attendanceMonth)
      setPendingAttendance(new Map())
      setEditingAttendanceRow(null)
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Failed to save attendance changes')
    }
  }

  const handleGeneratePayroll = async () => {
    if (payrollCompanyFilter === 'all') {
      alert('Select a company to generate payroll.')
      return
    }
    if (!payrollMonth) {
      alert('Select a month before generating payroll.')
      return
    }
    const [yearStr, monthStr] = payrollMonth.split('-')
    const monthNumber = Number(monthStr)
    const yearNumber = Number(yearStr)
    if (!monthNumber || !yearNumber) {
      alert('Invalid month selected.')
      return
    }
    setGeneratingPayroll(true)
    try {
      const response = await fetch('/api/employees/payroll/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: payrollCompanyFilter,
          month: monthNumber,
          year: yearNumber,
        }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate payroll')
      }
      await fetchPayroll(payrollMonth)
      alert(
        `Payroll generated. Created: ${data.summary.created}, Updated: ${data.summary.updated}, Skipped: ${data.summary.skipped}.`
      )
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Failed to generate payroll')
    } finally {
      setGeneratingPayroll(false)
    }
  }

  if (loading && employees.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading employee workspace...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-1">
            <Users className="h-4 w-4 text-gray-400" />
            Employee Experience
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">Employee Operations</h1>
          <p className="text-gray-500 mt-1">Keep headcount, attendance, and payroll in sync.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-gray-600" onClick={refreshAll} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Refreshing
              </>
            ) : (
              <>
                <Clock3 className="h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <Button
            onClick={() => {
              setTab('employees')
              setShowAddModal(true)
            }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="h-4 w-4 text-blue-500" />
            Headcount
          </div>
          <div className="mt-3 text-3xl font-semibold text-gray-900">{employees.length}</div>
          <p className="text-xs text-gray-500 mt-1">
            {employees.filter((emp) => emp.status === 'ACTIVE').length} active ·{' '}
            {employees.filter((emp) => emp.status !== 'ACTIVE').length} non-active
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock3 className="h-4 w-4 text-amber-500" />
            Attendance ({formatMonthFilterLabel(attendanceMonth)})
          </div>
          <div className="mt-3 text-3xl font-semibold text-gray-900">{attendanceRecords.length}</div>
          <p className="text-xs text-gray-500 mt-1">
            {attendanceSummary.PRESENT} present · {attendanceSummary.REMOTE} remote
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CreditCard className="h-4 w-4 text-emerald-500" />
            Payroll ({formatMonthFilterLabel(payrollMonth)})
          </div>
          <div className="mt-3 text-3xl font-semibold text-gray-900">{formatCurrency(payrollSummary.totalNet)}</div>
          <p className="text-xs text-gray-500 mt-1">
            {filteredPayrollRecords.length} records · {payrollSummary.paid} paid
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            Avg Monthly Salary
          </div>
          <div className="mt-3 text-3xl font-semibold text-gray-900">
            {employees.length
              ? formatCurrency(
                  Math.round(
                    employees.reduce((sum, emp) => sum + (emp.netSalary || 0), 0) / Math.max(employees.length, 1)
                  )
                )
              : '—'}
          </div>
          <p className="text-xs text-gray-500 mt-1">Based on current employee salary inputs</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-100">
        {[
          { id: 'employees', label: 'Employees', icon: Users },
          { id: 'attendance', label: 'Attendance', icon: Calendar },
          { id: 'payroll', label: 'Payroll', icon: CreditCard },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id as Tab)}
            className={`flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
              tab === id ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'employees' && (
        <section className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, department, company..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="pl-9"
                  />
                </div>
                <select
                  value={companyFilter}
                  onChange={(event) => setCompanyFilter(event.target.value)}
                  className="h-10 rounded-md border border-gray-200 px-3 text-sm text-gray-700 focus:border-gray-300 focus:outline-none"
                >
                  <option value="all">All companies</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as 'all' | EmployeeStatus)}
                  className="h-10 rounded-md border border-gray-200 px-3 text-sm text-gray-700 focus:border-gray-300 focus:outline-none"
                >
                  <option value="all">All statuses</option>
                  {EMPLOYEE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-sm text-gray-500">
                Showing <strong>{filteredEmployees.length}</strong> of {employees.length}
              </span>
            </div>

            <div className="overflow-auto rounded-xl border border-gray-100 bg-white shadow-sm">
              {employeeLoading ? (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading employees
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                  <Users className="mb-3 h-6 w-6 text-gray-300" />
                  <p>No employees match your filters</p>
                  <p className="text-sm">Add a new record or adjust the filters.</p>
                </div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-2 text-left">Employee</th>
                      <th className="px-4 py-2 text-left">Company</th>
                      <th className="px-4 py-2 text-left">Designation</th>
                      <th className="px-4 py-2 text-left">Net salary</th>
                      <th className="px-4 py-2 text-left">Gross salary</th>
                      <th className="px-4 py-2 text-left">Bank account</th>
                      <th className="px-4 py-2 text-left">IFSC
                      </th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => {
                      const isEditing = editingEmployeeId === employee.id
                      return (
                        <tr key={employee.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-3 align-top">
                              {isEditing ? (
                                <div className="space-y-2">
                                  <div className="flex gap-2">
                                    <Input
                                      value={editForm.firstName}
                                    onChange={(event) => handleEditChange('firstName', event.target.value)}
                                    className="h-8"
                                  />
                                  <Input
                                    value={editForm.lastName}
                                    onChange={(event) => handleEditChange('lastName', event.target.value)}
                                    className="h-8"
                                  />
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                      value={editForm.department}
                                      onChange={(event) => handleEditChange('department', event.target.value)}
                                      placeholder="Department"
                                      className="h-8"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.5"
                                      value={editForm.elBalance}
                                      onChange={(event) => handleEditChange('elBalance', event.target.value)}
                                      placeholder="EL balance"
                                      className="h-8"
                                    />
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.5"
                                      value={editForm.slBalance}
                                      onChange={(event) => handleEditChange('slBalance', event.target.value)}
                                      placeholder="SL balance"
                                      className="h-8"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <div className="font-medium text-gray-900">{employee.fullName}</div>
                                  <div className="text-xs text-gray-500">#{employee.employeeId}</div>
                                  <div className="text-xs text-gray-400">{formatDate(employee.joiningDate)}</div>
                                  <div className="text-[11px] text-gray-500">
                                    EL {formatLeaveBalance(employee.elBalance)} · SL {formatLeaveBalance(employee.slBalance)}
                                  </div>
                                </div>
                              )}
                            </td>
                          <td className="px-4 py-3 align-top text-sm text-gray-600">
                            {employee.company?.name || 'Unassigned'}
                          </td>
                          <td className="px-4 py-3 align-top text-sm text-gray-600">
                            {isEditing ? (
                              <Input
                                value={editForm.designation}
                                onChange={(event) => handleEditChange('designation', event.target.value)}
                                placeholder="Designation"
                                className="h-8"
                              />
                            ) : (
                              employee.designation || '—'
                            )}
                          </td>
                          <td className="px-4 py-3 align-top text-sm text-gray-900">
                            {isEditing ? (
                              <Input
                                type="number"
                                value={editForm.netSalary}
                                onChange={(event) => handleEditChange('netSalary', event.target.value)}
                                placeholder="Net"
                                className="h-8"
                              />
                            ) : (
                              formatCurrency(employee.netSalary)
                            )}
                          </td>
                          <td className="px-4 py-3 align-top text-sm text-gray-900">
                            {isEditing ? (
                              <Input
                                type="number"
                                value={editForm.grossSalary}
                                onChange={(event) => handleEditChange('grossSalary', event.target.value)}
                                placeholder="Gross"
                                className="h-8"
                              />
                            ) : (
                              formatCurrency(employee.grossSalary)
                            )}
                          </td>
                          <td className="px-4 py-3 align-top text-sm text-gray-900">
                            {isEditing ? (
                              <Input
                                value={editForm.bankAccountNumber}
                                onChange={(event) => handleEditChange('bankAccountNumber', event.target.value)}
                                placeholder="Account #"
                                className="h-8"
                              />
                            ) : (
                              employee.bankAccountNumber || '—'
                            )}
                          </td>
                          <td className="px-4 py-3 align-top text-sm text-gray-900">
                            {isEditing ? (
                              <Input
                                value={editForm.ifscCode}
                                onChange={(event) => handleEditChange('ifscCode', event.target.value)}
                                placeholder="IFSC"
                                className="h-8"
                              />
                            ) : (
                              employee.ifscCode || '—'
                            )}
                          </td>
                          <td className="px-4 py-3 align-top">
                            {isEditing ? (
                              <select
                                value={editForm.status}
                                onChange={(event) => handleEditChange('status', event.target.value as EmployeeStatus)}
                                className="h-8 w-full rounded-md border border-gray-200 px-2 text-xs text-gray-700 focus:border-gray-300 focus:outline-none"
                              >
                                {EMPLOYEE_STATUSES.map((statusOption) => (
                                  <option key={statusOption} value={statusOption}>
                                    {statusOption}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(employee.status)}`}>
                                {employee.status}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 align-top text-right text-xs">
                            {isEditing ? (
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={saveEditingEmployee}
                                  disabled={savingRow}
                                  className="rounded border border-gray-200 px-2 py-1 font-medium text-gray-900 hover:bg-gray-100 disabled:opacity-50"
                                >
                                  {savingRow ? 'Saving…' : 'Save'}
                                </button>
                                <button
                                  onClick={cancelEditingEmployee}
                                  className="rounded border border-transparent px-2 py-1 text-gray-500 hover:text-gray-900"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => startEditingEmployee(employee)}
                                  className="rounded border border-gray-200 px-2 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteEmployee(employee.id)}
                                  disabled={deletingRow === employee.id}
                                  className="rounded border border-transparent px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                >
                                  {deletingRow === employee.id ? 'Deleting…' : 'Delete'}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Upload className="h-4 w-4 text-gray-500" />
                  Bulk upload
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Upload a CSV and we will assign employees to the selected company automatically.
                </p>
              </div>
              <button
                onClick={downloadTemplate}
                className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-4"
              >
                Download template
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Company</label>
                <select
                  value={bulkCompanyId}
                  onChange={(event) => setBulkCompanyId(event.target.value)}
                  className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-700 focus:border-gray-300 focus:outline-none"
                >
                  <option value="">Select company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">CSV file</label>
                <input
                  key={fileInputKey}
                  type="file"
                  accept=".csv"
                  onChange={(event) => {
                    const nextFile = event.target.files?.[0] || null
                    setBulkFile(nextFile)
                  }}
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-gray-300 focus:outline-none"
                />
                <p className="text-xs text-gray-500">Use UTF-8 CSV with the headers from the template.</p>
              </div>
            </div>

            <Button
              onClick={handleBulkUpload}
              className="mt-4 w-full"
              disabled={bulkUploading || !bulkCompanyId || !bulkFile}
            >
              {bulkUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading
                </>
              ) : (
                'Upload employees'
              )}
            </Button>

            {bulkResult && (
              <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50/80 p-4 text-sm">
                <p className="font-medium text-gray-900">Upload summary</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-gray-700">
                  <span>Total rows: {bulkResult.summary.totalRows}</span>
                  <span>Processed: {bulkResult.summary.processedRows}</span>
                  <span>Created: {bulkResult.summary.created}</span>
                  <span>Updated: {bulkResult.summary.updated}</span>
                  <span>Failed: {bulkResult.summary.failed}</span>
                </div>
                {bulkResult.failed.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Rows with issues
                    </div>
                    <div className="space-y-1 text-xs text-gray-600 max-h-40 overflow-auto">
                      {bulkResult.failed.map((row) => (
                        <div key={row.rowNumber} className="rounded border border-amber-100 bg-white p-2">
                          <span className="font-medium text-gray-900">Row {row.rowNumber}:</span>{' '}
                          {row.errors.join(', ')}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
      {tab === 'attendance' && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm w-full overflow-hidden">
            <div className="space-y-4 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900">Monthly attendance grid</div>
                  <p className="text-sm text-gray-500">Update each day like you would in a spreadsheet.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={attendanceMonth}
                    onChange={async (event) => {
                      const value = event.target.value
                      setAttendanceMonth(value)
                      await fetchAttendance(value)
                    }}
                    className="h-10 rounded-md border border-gray-200 px-3 text-sm text-gray-700 focus:border-gray-300 focus:outline-none"
                  >
                    {monthOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={attendanceCompanyFilter}
                    onChange={(event) => setAttendanceCompanyFilter(event.target.value)}
                    className="h-10 rounded-md border border-gray-200 px-3 text-sm text-gray-700 focus:border-gray-300 focus:outline-none"
                  >
                    <option value="all">All companies</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {ATTENDANCE_OPTIONS.map((status) => (
                  <div key={status} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400">{status}</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{attendanceSummary[status]}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100">
              {attendanceLoading ? (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading attendance grid
                </div>
              ) : (
                <div className="max-h-[65vh] overflow-y-auto">
                  <div className="w-full overflow-x-auto">
                    <table className="min-w-[70rem] text-xs">
                      <thead className="sticky top-0 bg-gray-50">
                        <tr>
                          <th className="sticky left-0 bg-gray-50 px-3 py-2 text-left text-[11px] font-semibold text-gray-500">
                            Employee
                          </th>
                          <th className="bg-gray-50 px-2 py-2 text-center text-[11px] font-semibold text-gray-500">
                            EL
                          </th>
                          <th className="bg-gray-50 px-2 py-2 text-center text-[11px] font-semibold text-gray-500">
                            SL
                          </th>
                          {attendanceDays.map((day) => (
                            <th key={day} className="px-1 py-2 text-[11px] font-semibold text-gray-500">
                              {day}
                            </th>
                          ))}
                          <th className="px-2 py-2 text-right text-[11px] font-semibold text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAttendanceEmployees.map((employee) => {
                          const isEditingAttendance = editingAttendanceRow === employee.id
                          return (
                            <tr key={employee.id} className="border-t border-gray-50">
                              <td className="sticky left-0 bg-white px-3 py-2 text-xs font-medium text-gray-900">
                                {employee.fullName}
                              </td>
                              <td className="px-2 py-2 text-center text-[11px] text-gray-700">
                                {formatLeaveBalance(employee.elBalance)}
                              </td>
                              <td className="px-2 py-2 text-center text-[11px] text-gray-700">
                                {formatLeaveBalance(employee.slBalance)}
                              </td>
                              {attendanceDays.map((day) => {
                                const { year, month } = attendanceMonthParts
                                const date = new Date(Date.UTC(year, month - 1, day)).toISOString().split('T')[0]
                            const key = buildAttendanceKey(employee.id, date)
                            const draft = pendingAttendance.get(key)
                            const existing = attendanceStatusMap.get(key)
                                const status = draft || existing
                                return (
                                  <td key={`${employee.id}-${day}`} className="px-1 py-1 text-center align-middle">
                                    {isEditingAttendance ? (
                                      <select
                                        value={status || ''}
                                        onChange={(event) => {
                                          const next = event.target.value as AttendanceStatus | ''
                                          if (!next) return
                                          handleAttendanceDraftChange(employee.id, day, next)
                                        }}
                                        className="h-7 w-16 rounded-md border border-gray-200 bg-white text-[11px] text-gray-700 focus:border-gray-300 focus:outline-none"
                                      >
                                        <option value="">—</option>
                                        {ATTENDANCE_CODES.map((option) => (
                                          <option key={option.value} value={option.value}>
                                            {option.code}
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      <span className="text-[11px] text-gray-700">{getAttendanceDisplay(status)}</span>
                                    )}
                                  </td>
                                )
                              })}
                              <td className="px-2 py-1 text-right text-[11px]">
                                {isEditingAttendance ? (
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => saveAttendanceRow(employee.id)}
                                      className="rounded border border-gray-200 px-2 py-1 font-medium text-gray-900 hover:bg-gray-100"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={cancelEditingAttendance}
                                      className="rounded border border-transparent px-2 py-1 text-gray-500 hover:text-gray-900"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => startEditingAttendance(employee.id)}
                                    className="rounded border border-gray-200 px-2 py-1 text-gray-600 hover:bg-gray-100"
                                  >
                                    Edit
                                  </button>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-4 border-t border-gray-100 p-4 text-xs text-gray-500">
              {ATTENDANCE_CODES.map((option) => (
                <span key={option.value} className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-gray-200 text-[11px]">
                    {option.code}
                  </span>
                  {option.label}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
      {tab === 'payroll' && (
        <section className="space-y-6">
          <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900">Payroll processing</div>
                  <p className="text-sm text-gray-500">Track gross-to-net per cycle and payout readiness.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={payrollMonth}
                    onChange={async (event) => {
                      const value = event.target.value
                      setPayrollMonth(value)
                      await fetchPayroll(value)
                    }}
                    className="h-10 rounded-md border border-gray-200 px-3 text-sm text-gray-700 focus:border-gray-300 focus:outline-none"
                  >
                    {monthOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={payrollCompanyFilter}
                    onChange={(event) => setPayrollCompanyFilter(event.target.value)}
                    className="h-10 rounded-md border border-gray-200 px-3 text-sm text-gray-700 focus:border-gray-300 focus:outline-none"
                  >
                    <option value="all">All companies</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={handleGeneratePayroll}
                    disabled={payrollCompanyFilter === 'all' || generatingPayroll}
                  >
                    {generatingPayroll ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating
                      </>
                    ) : (
                      'Generate payroll'
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                  <p className="text-xs uppercase text-gray-400">Total gross</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{formatCurrency(payrollSummary.totalGross)}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                  <p className="text-xs uppercase text-gray-400">Total net</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{formatCurrency(payrollSummary.totalNet)}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                  <p className="text-xs uppercase text-gray-400">Paid employees</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {payrollSummary.paid}/{filteredPayrollRecords.length}
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-100">
                <div className="grid grid-cols-5 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <div>Cycle</div>
                  <div>Employee</div>
                  <div className="text-right">Gross</div>
                  <div className="text-right">Net</div>
                  <div>Status</div>
                </div>
                {payrollLoading ? (
                  <div className="flex items-center justify-center py-12 text-gray-500">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading payroll
                  </div>
                ) : filteredPayrollRecords.length === 0 ? (
                  <div className="py-12 text-center text-sm text-gray-500">No payroll records for this cycle.</div>
                ) : (
                  filteredPayrollRecords.map((record) => {
                    const name = `${record.employee.firstName} ${record.employee.lastName}`
                    return (
                      <div key={record.id} className="grid grid-cols-5 border-t border-gray-50 px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">{getMonthLabel(record.year, record.month)}</p>
                          <p className="text-xs text-gray-500">#{record.employee.employeeId}</p>
                        </div>
                        <div>
                          <p className="text-gray-900">{name}</p>
                          <p className="text-xs text-gray-500">{record.employee.department || 'No department'}</p>
                        </div>
                        <div className="text-right font-medium text-gray-900">{formatCurrency(record.grossAmount)}</div>
                        <div className="text-right font-medium text-gray-900">{formatCurrency(record.netAmount)}</div>
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                              record.status === 'PAID'
                                ? 'bg-emerald-50 text-emerald-700'
                                : record.status === 'PROCESSING'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {record.status === 'PAID' && <CheckCircle2 className="h-3.5 w-3.5" />}
                            {record.status}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
          </div>
        </section>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="max-w-3xl w-full rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add employee</h2>
                <p className="text-sm text-gray-500">Capture contract data that powers payroll and compliance.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Company</label>
                  <select
                    value={newEmployee.companyId}
                    onChange={(event) => setNewEmployee((prev) => ({ ...prev, companyId: event.target.value }))}
                    className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-700 focus:border-gray-300 focus:outline-none"
                  >
                    <option value="">Select company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Employee ID</label>
                  <Input
                    value={newEmployee.employeeId}
                    onChange={(event) => setNewEmployee((prev) => ({ ...prev, employeeId: event.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">First name</label>
                  <Input
                    value={newEmployee.firstName}
                    onChange={(event) => setNewEmployee((prev) => ({ ...prev, firstName: event.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Last name</label>
                  <Input
                    value={newEmployee.lastName}
                    onChange={(event) => setNewEmployee((prev) => ({ ...prev, lastName: event.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Designation</label>
                  <Input
                    value={newEmployee.designation}
                    onChange={(event) => setNewEmployee((prev) => ({ ...prev, designation: event.target.value }))}
                    placeholder="Senior Accountant"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Department</label>
                  <Input
                    value={newEmployee.department}
                    onChange={(event) => setNewEmployee((prev) => ({ ...prev, department: event.target.value }))}
                    placeholder="Finance"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input
                    type="email"
                    value={newEmployee.email}
                    onChange={(event) => setNewEmployee((prev) => ({ ...prev, email: event.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <Input
                    value={newEmployee.phone}
                    onChange={(event) => setNewEmployee((prev) => ({ ...prev, phone: event.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Net salary (INR)</label>
                  <Input
                    type="number"
                    value={newEmployee.netSalary}
                    onChange={(event) => setNewEmployee((prev) => ({ ...prev, netSalary: event.target.value }))}
                    placeholder="90000"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Joining date</label>
                  <Input
                    type="date"
                    value={newEmployee.joiningDate}
                    onChange={(event) => setNewEmployee((prev) => ({ ...prev, joiningDate: event.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  value={newEmployee.status}
                  onChange={(event) => setNewEmployee((prev) => ({ ...prev, status: event.target.value as EmployeeStatus }))}
                  className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-700 focus:border-gray-300 focus:outline-none"
                >
                  {EMPLOYEE_STATUSES.map((statusOption) => (
                    <option key={statusOption} value={statusOption}>
                      {statusOption}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEmployee} disabled={savingEmployee}>
                {savingEmployee ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  'Save employee'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
