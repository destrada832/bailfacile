export interface TalCalculationInput {
  currentRent: number
  isHeated: boolean
  taxIncrease: number
  insuranceIncrease: number
  renovationCost: number
  renovationUnits: number
  year: number
}

export interface TalCalculationResult {
  baseIncrease: number
  taxAdjustment: number
  insuranceAdjustment: number
  renovationAdjustment: number
  totalIncrease: number
  totalIncreasePct: number
  newRent: number
  breakdown: { label: string; labelEn: string; amount: number; pct: number }[]
}

const TAL_RATES: Record<number, number> = {
  2024: 0.028,
  2025: 0.045,
  2026: 0.031,
}

export function calculateRentIncrease(input: TalCalculationInput): TalCalculationResult {
  const baseRate = TAL_RATES[input.year] ?? 0.031
  const baseIncrease = input.currentRent * baseRate

  // Tax & insurance adjustments (prorated over 12 months)
  const taxAdjustment = input.taxIncrease / 12
  const insuranceAdjustment = input.insuranceIncrease / 12

  // Renovation: 5% per year amortized over 20 years, per unit
  const renovationAnnual = input.renovationUnits > 0
    ? (input.renovationCost * 0.05) / input.renovationUnits
    : 0
  const renovationAdjustment = renovationAnnual / 12

  const totalMonthlyIncrease = baseIncrease + taxAdjustment + insuranceAdjustment + renovationAdjustment
  const totalIncreasePct = totalMonthlyIncrease / input.currentRent
  const newRent = input.currentRent + totalMonthlyIncrease

  return {
    baseIncrease,
    taxAdjustment,
    insuranceAdjustment,
    renovationAdjustment,
    totalIncrease: totalMonthlyIncrease,
    totalIncreasePct,
    newRent,
    breakdown: [
      { label: `Augmentation de base (${(baseRate * 100).toFixed(1)}% IPC)`, labelEn: `Base increase (${(baseRate * 100).toFixed(1)}% CPI)`, amount: baseIncrease, pct: baseRate },
      { label: 'Ajustement taxes', labelEn: 'Tax adjustment', amount: taxAdjustment, pct: taxAdjustment / input.currentRent },
      { label: 'Ajustement assurances', labelEn: 'Insurance adjustment', amount: insuranceAdjustment, pct: insuranceAdjustment / input.currentRent },
      { label: 'Travaux majeurs (5%/20 ans)', labelEn: 'Major renovations (5%/20 yrs)', amount: renovationAdjustment, pct: renovationAdjustment / input.currentRent },
    ].filter(b => b.amount > 0),
  }
}

export function getNoticeDeadline(leaseEndDate: Date): Date {
  const d = new Date(leaseEndDate)
  d.setMonth(d.getMonth() - 3)
  return d
}

export function getTenantResponseDeadline(noticeSentDate: Date): Date {
  const d = new Date(noticeSentDate)
  d.setDate(d.getDate() + 30)
  return d
}

export function getTalFilingDeadline(tenantRefusalDate: Date): Date {
  const d = new Date(tenantRefusalDate)
  d.setDate(d.getDate() + 30)
  return d
}
