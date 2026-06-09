import { createServerSupabaseClient } from '@/lib/supabase-server'
import { PropertiesClient } from './PropertiesClient'

export default async function PropertiesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: properties } = await supabase
    .from('properties')
    .select('*, units(*, leases(*, tenant:tenants(*)))')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return <PropertiesClient properties={properties ?? []} />
}
