'use client'
import { useLang } from '@/lib/lang-context'
import { CreditCard, User, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { tr, lang } = useLang()

  const plans = [
    { key: 'free', name: tr.pricing.free, price: 0, features: [lang === 'fr' ? '1 propriété, 3 logements' : '1 property, 3 units', lang === 'fr' ? 'Calculateur TAL' : 'TAL Calculator'], current: true },
    { key: 'starter', name: tr.pricing.starter, price: 29, popular: false, features: [lang === 'fr' ? '3 propriétés, 15 logements' : '3 properties, 15 units', lang === 'fr' ? 'Avis PDF' : 'PDF notices', lang === 'fr' ? 'Suivi renouvellements' : 'Renewal tracking'] },
    { key: 'pro', name: tr.pricing.pro, price: 79, popular: true, features: [lang === 'fr' ? 'Illimité' : 'Unlimited', lang === 'fr' ? 'Documents' : 'Document storage', lang === 'fr' ? 'Rappels email' : 'Email reminders', lang === 'fr' ? 'Support prioritaire' : 'Priority support'] },
  ]

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-white">{tr.nav.settings}</h1>

      <div className="card space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2"><CreditCard size={16} className="text-teal-400" />{lang === 'fr' ? 'Plan & Facturation' : 'Plan & Billing'}</h2>
        <div className="grid grid-cols-3 gap-4">
          {plans.map(plan => (
            <div key={plan.key} className={`rounded-xl p-4 border ${plan.popular ? 'border-teal-500/40 bg-teal-500/5' : plan.current ? 'border-navy-600 bg-navy-700' : 'border-navy-600'}`}>
              {plan.popular && <span className="badge-green text-xs mb-2 inline-block">{tr.pricing.popular}</span>}
              <p className="font-bold text-white">{plan.name}</p>
              <p className="text-2xl font-bold text-white mt-1">${plan.price}<span className="text-sm font-normal text-slate-400">{tr.pricing.perMonth}</span></p>
              <ul className="mt-3 space-y-1.5">
                {plan.features.map(f => (
                  <li key={f} className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span className="text-teal-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <span className="mt-4 block text-center text-xs text-slate-500">{lang === 'fr' ? 'Plan actuel' : 'Current plan'}</span>
              ) : (
                <button onClick={() => toast.success(lang === 'fr' ? 'Bientôt disponible' : 'Coming soon')}
                  className={`mt-4 w-full text-xs py-2 rounded-lg font-medium transition-colors ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>
                  {tr.pricing.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
