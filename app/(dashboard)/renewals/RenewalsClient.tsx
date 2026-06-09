'use client'
import { useState } from 'react'
import { useLang } from '@/lib/lang-context'
import { createClient } from '@/lib/supabase'
import { differenceInDays, format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { RefreshCcw, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import type { RentIncrease, RentIncreaseStatus } from '@/types'

const STATUS_CONFIG = {
  draft: { color: 'badge-slate', icon: Clock },
  notice_sent: { color: 'badge-yellow', icon: Clock },
  accepted: { color: 'badge-green', icon: CheckCircle2 },
  refused: { color: 'badge-red', icon: AlertCircle },
  tal_filed: { color: 'badge-green', icon: CheckCircle2 },
}

export function RenewalsClient({ rentIncreases: initial }: { rentIncreases: RentIncrease[] }) {
  const { tr, lang } = useLang()
  const [rentIncreases, setRentIncreases] = useState(initial)
  const supabase = createClient()
  const today = new Date()
  const dateFmt = (d: string) => format(parseISO(d), 'd MMM yyyy', { locale: lang === 'fr' ? fr : undefined })
  const daysLabel = (d: string) => {
    const days = differenceInDays(parseISO(d), today)
    if (days < 0) return { label: lang === 'fr' ? `${Math.abs(days)}j retard` : `${Math.abs(days)}d late`, urgent: true }
    if (days === 0) return { label: lang === 'fr' ? 'Aujourd\'hui' : 'Today', urgent: true }
    return { label: `${days}j`, urgent: days < 14 }
  }

  const updateStatus = async (id: string, status: RentIncreaseStatus, extra: Record<string, any> = {}) => {
    const updates: any = { status, ...extra }
    if (status === 'notice_sent' && !extra.notice_sent_date) {
      updates.notice_sent_date = new Date().toISOString().split('T')[0]
      const deadline = new Date()
      deadline.setDate(deadline.getDate() + 30)
      updates.tenant_response_deadline = deadline.toISOString().split('T')[0]
    }
    if (status === 'refused') {
      const talDeadline = new Date()
      talDeadline.setDate(talDeadline.getDate() + 30)
      updates.tal_filing_deadline = talDeadline.toISOString().split('T')[0]
      updates.tenant_response_date = new Date().toISOString().split('T')[0]
    }
    const { error } = await supabase.from('rent_increases').update(updates).eq('id', id)
    if (error) return toast.error(tr.common.error)
    setRentIncreases(rentIncreases.map(ri => ri.id === id ? { ...ri, ...updates } : ri))
    toast.success(tr.common.success)
  }

  if (rentIncreases.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">{tr.renewals.title}</h1>
        <div className="card text-center py-16">
          <RefreshCcw size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">
            {lang === 'fr' ? 'Aucun renouvellement. Calculez une augmentation de loyer pour commencer.' : 'No renewals yet. Calculate a rent increase to get started.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">{tr.renewals.title}</h1>
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-700">
                {[tr.renewals.unit, tr.renewals.tenant, tr.renewals.leaseEnd, tr.renewals.noticeDeadline, tr.renewals.responseDeadline, tr.renewals.status, tr.renewals.actions].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700">
              {rentIncreases.map(ri => {
                const unit = ri.lease?.unit
                const tenant = ri.lease?.tenant
                const leaseEnd = ri.lease?.end_date
                const noticeDeadline = leaseEnd ? new Date(new Date(leaseEnd).setMonth(new Date(leaseEnd).getMonth() - 3)).toISOString() : null
                const { color, icon: StatusIcon } = STATUS_CONFIG[ri.status]
                return (
                  <tr key={ri.id} className="hover:bg-navy-700/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-white">{unit?.property?.name}</p>
                        <p className="text-xs text-slate-400">{lang === 'fr' ? 'Unité' : 'Unit'} {unit?.unit_number}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-300">
                      {tenant?.first_name} {tenant?.last_name}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-300">
                      {leaseEnd ? dateFmt(leaseEnd) : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      {noticeDeadline ? (
                        <div>
                          <p className="text-sm text-slate-300">{dateFmt(noticeDeadline)}</p>
                          {ri.status === 'draft' && (() => { const { label, urgent } = daysLabel(noticeDeadline); return <p className={`text-xs font-medium ${urgent ? 'text-red-400' : 'text-slate-400'}`}>{label}</p> })()}
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-300">
                      {ri.tenant_response_deadline ? dateFmt(ri.tenant_response_deadline) : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={color}><StatusIcon size={11} className="inline mr-1" />{tr.status[ri.status]}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {ri.status === 'draft' && (
                          <button onClick={() => updateStatus(ri.id, 'notice_sent')} className="btn-primary text-xs py-1">{tr.renewals.markSent}</button>
                        )}
                        {ri.status === 'notice_sent' && (<>
                          <button onClick={() => updateStatus(ri.id, 'accepted')} className="btn-primary text-xs py-1">{tr.renewals.markAccepted}</button>
                          <button onClick={() => updateStatus(ri.id, 'refused')} className="btn-secondary text-xs py-1">{tr.renewals.markRefused}</button>
                        </>)}
                        {ri.status === 'refused' && (
                          <button onClick={() => updateStatus(ri.id, 'tal_filed', { tal_filed_date: new Date().toISOString().split('T')[0] })} className="btn-primary text-xs py-1">{tr.renewals.markFiled}</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
