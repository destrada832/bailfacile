import { createServerSupabaseClient } from '@/lib/supabase-server'
import { DashboardClient } from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: properties }, { data: leases }, { data: rentIncreases }] = await Promise.all([
    supabase.from('properties').select('*, units(*)').eq('user_id', user!.id),
    supabase.from('leases').select('*, unit:units(*, property:properties(*)), tenant:tenants(*)').eq('is_active', true),
    supabase.from('rent_increases').select('*, lease:leases(*, unit:units(*, property:properties(*)), tenant:tenants(*))').eq('user_id', user!.id).neq('status', 'accepted'),
  ])

  const totalUnits = (properties ?? []).reduce((sum, p) => sum + (p.units?.length ?? 0), 0)

  return (
    <DashboardClient
      totalUnits={totalUnits}
      totalProperties={properties?.length ?? 0}
      activeLeases={leases?.length ?? 0}
      rentIncreases={rentIncreases ?? []}
    />
  )
}
