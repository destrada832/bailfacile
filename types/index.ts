export type Lang = 'fr' | 'en'
export type Plan = 'free' | 'starter' | 'pro'
export type RentIncreaseStatus = 'draft' | 'notice_sent' | 'accepted' | 'refused' | 'tal_filed'

export interface Property {
  id: string
  user_id: string
  name: string
  civic_number: string
  street: string
  city: string
  postal_code: string
  building_type: string
  notes?: string
  created_at: string
  units?: Unit[]
}

export interface Unit {
  id: string
  property_id: string
  unit_number: string
  bedrooms: number
  is_heated: boolean
  is_furnished: boolean
  created_at: string
  leases?: Lease[]
}

export interface Tenant {
  id: string
  unit_id: string
  user_id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  is_active: boolean
  created_at: string
}

export interface Lease {
  id: string
  unit_id: string
  tenant_id: string
  start_date: string
  end_date: string
  current_rent: number
  is_heated_included: boolean
  is_active: boolean
  notes?: string
  created_at: string
  tenant?: Tenant
  unit?: Unit & { property?: Property }
}

export interface RentIncrease {
  id: string
  lease_id: string
  user_id: string
  calculation_year: number
  current_rent: number
  base_rate_pct: number
  tax_increase_amount: number
  insurance_increase_amount: number
  renovation_cost: number
  renovation_units_affected: number
  proposed_increase_amount: number
  proposed_increase_pct: number
  new_rent: number
  status: RentIncreaseStatus
  notice_sent_date?: string
  tenant_response_deadline?: string
  tenant_response?: string
  tenant_response_date?: string
  tal_filing_deadline?: string
  tal_filed_date?: string
  notes?: string
  created_at: string
  lease?: Lease
}
