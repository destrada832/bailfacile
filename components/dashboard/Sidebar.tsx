'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/lib/lang-context'
import { LangToggle } from '@/components/ui/LangToggle'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, Building2, RefreshCcw, Calculator, Settings, LogOut, Home
} from 'lucide-react'

export function Sidebar() {
  const { tr } = useLang()
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const links = [
    { href: '/dashboard', label: tr.nav.dashboard, icon: LayoutDashboard },
    { href: '/properties', label: tr.nav.properties, icon: Building2 },
    { href: '/renewals', label: tr.nav.renewals, icon: RefreshCcw },
    { href: '/calculator', label: tr.nav.calculator, icon: Calculator },
    { href: '/settings', label: tr.nav.settings, icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-60 bg-navy-900 border-r border-navy-700 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-5 border-b border-navy-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-teal-500 rounded-md flex items-center justify-center">
            <Home size={14} className="text-navy-900" />
          </div>
          <span className="font-bold text-white text-lg">BailFacile</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-navy-700 space-y-2">
        <div className="flex justify-between items-center px-2">
          <LangToggle />
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
        >
          <LogOut size={16} />
          {tr.nav.logout}
        </button>
      </div>
    </aside>
  )
}
