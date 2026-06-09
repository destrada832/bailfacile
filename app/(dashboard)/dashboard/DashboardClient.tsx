'use client'
import { useLang } from '@/lib/lang-context'
import { Building2, Home, RefreshCcw, AlertTriangle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { differenceInDays, format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { RentIncrease } from '@/types'

export function DashboardClient({
  totalUnits, totalProperties, activeLeases, rentIncreases
}: {
  totalUnits: number
  totalProperties: number
  activeLeases: number
  rentIncreases: RentIncrease[]
}) {
  const { tr, lang } = useLang()
  const today = new Date()

  const urgent = rentIncreases.filter(ri => {
    if (!ri.lease?.end_date) return false
    const noticeDeadline = new Date(ri.lease.end_date)
    noticeDeadline.setMonth(noticeDeadline.getMonth() - 3)
    return differenceInDays(noticeDeadline, today) <= 60 && ri.status === 'draft'
  })

  const stats = [
    { label: tr.dashboard.totalProperties ?? 'Propriétés', value: totalProperties, icon: Building2, color: 'text-teal-400' },
    { label: tr.dashboard.totalUnits, value: totalUnits, icon: Home, color: 'text-blue-400' },
    { label: tr.dashboard.activeLeases, value: activeLeases, icon: RefreshCcw, color: 'text-purple-400' },
    { label: tr.dashboard.upcomingRenewals, value: urgent.length, icon: AlertTriangle, color: urgent.length > 0 ? 'text-yellow-400' : 'text-slate-400' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{tr.dashboard.title}</h1>
        <p className="text-slate-400 mt-1 text-sm">
          {lang === 'fr' ? `Bonjour 👋 Voici l'état de votre portfolio` : `Good day 👋 Here's your portfolio overview`}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{label}</p>
                <p className="text-3xl font-bold text-white mt-1">{value}</p>
              </div>
              <Icon size={20} className={color} />
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-yellow-400" />
          {tr.dashboard.urgentActions}
        </h2>

        {urgent.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-slate-400 py-4">
            <CheckCircle2 size={16} className="text-teal-400" />
            {tr.dashboard.noUrgentActions}
          </div>
        ) : (
          <div className="space-y-2">
            {urgent.map(ri => {
              const noticeDeadline = new Date(ri.lease!.end_date)
              noticeDeadline.setMonth(noticeDeadline.getMonth() - 3)
              const daysLeft = differenceInDays(noticeDeadline, today)
              const tenant = ri.lease?.tenant
              const unit = ri.lease?.unit
              return (
                <div key={ri.id} className="flex items-center justify-between bg-navy-700 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {unit?.property?.name} — {lang === 'fr' ? 'Unité' : 'Unit'} {unit?.unit_number}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {tenant?.first_name} {tenant?.last_name} · {lang === 'fr' ? 'Bail se termine' : 'Lease ends'} {format(parseISO(ri.lease!.end_date), 'd MMM yyyy', { locale: lang === 'fr' ? fr : undefined })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${daysLeft < 0 ? 'text-red-400' : daysLeft < 30 ? 'text-yellow-400' : 'text-slate-300'}`}>
                      {daysLeft < 0 ? tr.dashboard.overdueNotice : `${tr.dashboard.sendNoticeIn} ${daysLeft} ${tr.dashboard.days}`}
                    </span>
                    <Link href="/renewals" className="btn-primary text-xs py-1.5">
                      {lang === 'fr' ? 'Agir' : 'Act'}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
