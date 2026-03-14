/**
 * lib/salary-utils.ts
 * Place at: lib/salary-utils.ts
 */

const PF_RATE      = 0.12
const PF_BASIC_CAP = 15_000

export function computePF(
  basicSalary:  number | null | undefined,
  pfApplicable  = true,
  pfOverride?:  number | null,
): number {
  if (!pfApplicable) return 0
  if (pfOverride != null && pfOverride >= 0) return pfOverride
  const basic = basicSalary ?? 0
  return Math.round(Math.min(basic, PF_BASIC_CAP) * PF_RATE)
}

// PT is manual only — set explicitly per employee, never auto-calculated
export function computePT(
  _grossSalary: number | null | undefined,
  ptOverride?: number | null,
): number {
  if (ptOverride != null && ptOverride > 0) return ptOverride
  return 0
}

export type CTCBreakdown = {
  basic:            number
  hra:              number
  allowances:       number
  conveyance:       number
  specialAllowance: number
  employeePF:       number
  professionalTax:  number
  totalDeductions:  number
  netSalary:        number
  employerPF:       number
  annualCTC:        number
}

export function computeCTCBreakdown(p: {
  grossSalary:              number | null | undefined
  basicSalary:              number | null | undefined
  hra:                      number | null | undefined
  pfApplicable:             boolean
  pfAmount?:                number | null
  ptAmount?:                number | null
  totalDeductionsOverride?: number | null
  annualCTCOverride?:       number | null
  conveyance?:              number | null
  specialAllowance?:        number | null
}): CTCBreakdown {
  const gross            = p.grossSalary     ?? 0
  const basic            = p.basicSalary     ?? 0
  const hra              = p.hra             ?? 0
  const conveyance       = p.conveyance      ?? 0
  const specialAllowance = p.specialAllowance ?? 0

  // allowances = remainder after known components
  const allowances      = Math.max(gross - basic - hra - conveyance - specialAllowance, 0)
  const employeePF      = computePF(basic, p.pfApplicable, p.pfAmount)
  const professionalTax = computePT(gross, p.ptAmount)
  const totalDeductions = p.totalDeductionsOverride != null
    ? p.totalDeductionsOverride
    : employeePF + professionalTax
  const netSalary  = Math.max(gross - totalDeductions, 0)
  const employerPF = employeePF
  const annualCTC  = p.annualCTCOverride != null
    ? p.annualCTCOverride
    : (gross + employerPF) * 12

  return {
    basic,
    hra,
    allowances,
    conveyance,
    specialAllowance,
    employeePF,
    professionalTax,
    totalDeductions,
    netSalary,
    employerPF,
    annualCTC,
  }
}