import { createServerSupabaseClient } from '@/lib/supabase-server'
import { RenewalsClient } from './RenewalsClient'

export default async function RenewalsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: rentIncreases } = await supabase
    .from('rent_increases')
    .select('*, lease:leases(*, unit:units(*, property:properties(*)), tenant:tenants(*))')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
  return <RenewalsClient rentIncreases={rentIncreases ?? []} />
}
