import { Sidebar } from '@/components/dashboard/Sidebar'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex min-h-screen bg-navy-900">
      <Sidebar />
      <main className="flex-1 ml-60 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}
