'use client'
import { useState } from 'react'
import { calculateRentIncrease } from '@/lib/tal-calculator'
import { useLang } from '@/lib/lang-context'
import { LangToggle } from '@/components/ui/LangToggle'
import { Calculator, Home, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

export default function PublicCalculatorPage() {
  const { lang } = useLang()
  const fr = lang === 'fr'
  const [form, setForm] = useState({ currentRent: '', isHeated: false, taxIncrease: '', insuranceIncrease: '', renovationCost: '', renovationUnits: '1' })
  const [result, setResult] = useState<ReturnType<typeof calculateRentIncrease> | null>(null)
  const [showAdv, setShowAdv] = useState(false)

  const fmt = (n: number) => n.toLocaleString(fr ? 'fr-CA' : 'en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2 })

  const calc = (e: React.FormEvent) => {
    e.preventDefault()
    setResult(calculateRentIncrease({
      currentRent: parseFloat(form.currentRent || '0'),
      isHeated: form.isHeated,
      taxIncrease: parseFloat(form.taxIncrease || '0'),
      insuranceIncrease: parseFloat(form.insuranceIncrease || '0'),
      renovationCost: parseFloat(form.renovationCost || '0'),
      renovationUnits: parseInt(form.renovationUnits || '1'),
      year: 2026,
    }))
  }

  return (
    <div className="min-h-screen bg-navy-900">
      <nav className="border-b border-navy-700 px-6 py-4 flex items-center justify-between max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-teal-500 rounded-md flex items-center justify-center">
            <Home size={13} className="text-navy-900" />
          </div>
          <span className="font-bold text-white">BailFacile</span>
        </Link>
        <div className="flex items-center gap-3">
          <LangToggle />
          <Link href="/signup" className="btn-primary text-xs">{fr ? 'Gérer mes logements' : 'Manage my units'}</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 mb-5">
            <Calculator size={13} className="text-teal-400" />
            <span className="text-xs text-teal-300 font-medium">{fr ? 'Taux TAL 2026 : 3.1%' : 'TAL 2026 rate: 3.1%'}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            {fr ? 'Calculateur d\'augmentation de loyer Québec 2026' : 'Quebec 2026 Rent Increase Calculator'}
          </h1>
          <p className="text-slate-400">
            {fr ? 'Calcul officiel basé sur les paramètres du Tribunal administratif du logement (TAL)' : 'Official calculation based on Tribunal administratif du logement (TAL) parameters'}
          </p>
        </div>

        <div className="card mb-6">
          <form onSubmit={calc} className="space-y-4">
            <div>
              <label className="label">{fr ? 'Loyer mensuel actuel' : 'Current monthly rent'} *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input type="number" min="0" step="0.01" className="input pl-7" required
                  value={form.currentRent} onChange={e => setForm({...form, currentRent: e.target.value})} placeholder="1000.00" />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.isHeated} onChange={e => setForm({...form, isHeated: e.target.checked})} className="w-4 h-4 accent-teal-500" />
              <span className="text-sm text-slate-300">{fr ? 'Chauffage inclus dans le loyer' : 'Heat included in rent'}</span>
            </label>

            <button type="button" onClick={() => setShowAdv(!showAdv)} className="flex items-center gap-2 text-xs text-slate-400 hover:text-teal-400">
              {showAdv ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {fr ? 'Ajouter taxes, assurances ou travaux majeurs' : 'Add taxes, insurance or major renovations'}
            </button>

            {showAdv && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-navy-600">
                {[
                  { label: fr ? 'Hausse taxes annuelle ($)' : 'Annual tax increase ($)', key: 'taxIncrease' },
                  { label: fr ? 'Hausse assurance annuelle ($)' : 'Annual insurance increase ($)', key: 'insuranceIncrease' },
                  { label: fr ? 'Coût travaux majeurs ($)' : 'Major renovation cost ($)', key: 'renovationCost' },
                  { label: fr ? 'Logements touchés' : 'Units affected', key: 'renovationUnits' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="label text-xs">{label}</label>
                    <div className="relative">
                      {key !== 'renovationUnits' && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>}
                      <input type="number" min="0" className={`input ${key !== 'renovationUnits' ? 'pl-7' : ''}`}
                        value={(form as any)[key]} onChange={e => setForm({...form, [key]: e.target.value})} placeholder="0" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className="btn-primary w-full py-3">{fr ? 'Calculer l\'augmentation' : 'Calculate increase'}</button>
          </form>
        </div>

        {result && (
          <div className="card border-teal-500/30 mb-8">
            <h2 className="font-bold text-white mb-4">{fr ? 'Résultat du calcul TAL 2026' : 'TAL 2026 Calculation Result'}</h2>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-navy-700 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">{fr ? 'Augmentation mensuelle' : 'Monthly increase'}</p>
                <p className="text-2xl font-bold text-teal-400">+{fmt(result.totalIncrease)}</p>
                <p className="text-xs text-slate-400">{(result.totalIncreasePct * 100).toFixed(2)}%</p>
              </div>
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">{fr ? 'Nouveau loyer' : 'New rent'}</p>
                <p className="text-2xl font-bold text-white">{fmt(result.newRent)}</p>
                <p className="text-xs text-slate-400">{fr ? 'par mois' : 'per month'}</p>
              </div>
            </div>
            {result.breakdown.map((b, i) => (
              <div key={i} className="flex justify-between text-sm py-2 border-b border-navy-700 last:border-0">
                <span className="text-slate-400">{fr ? b.label : b.labelEn}</span>
                <span className="text-white font-medium">+{fmt(b.amount)}</span>
              </div>
            ))}
            <div className="mt-5 p-4 bg-navy-700 rounded-xl">
              <p className="text-xs text-slate-400 mb-2">{fr ? 'Gérez tous vos logements avec BailFacile' : 'Manage all your units with BailFacile'}</p>
              <Link href="/signup" className="btn-primary text-sm flex items-center gap-2 w-fit">
                {fr ? 'Créer un compte gratuit' : 'Create free account'} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        <div className="card prose-sm text-slate-400 space-y-3">
          <h3 className="font-semibold text-white text-base">
            {fr ? 'Comment fonctionne le calcul TAL 2026?' : 'How does the TAL 2026 calculation work?'}
          </h3>
          <p className="text-sm">{fr ? 'Depuis janvier 2026, le Tribunal administratif du logement (TAL) utilise une nouvelle méthode basée sur l\'Indice des prix à la consommation (IPC) moyen sur 3 ans. Le taux de base pour 2026 est de 3,1%.' : 'Since January 2026, the Tribunal administratif du logement (TAL) uses a new method based on the 3-year average Consumer Price Index (CPI). The base rate for 2026 is 3.1%.'}</p>
          <p className="text-sm">{fr ? 'Des ajustements supplémentaires sont possibles pour les hausses de taxes municipales, d\'assurance, et les travaux majeurs (5% amorti sur 20 ans).' : 'Additional adjustments are possible for municipal tax increases, insurance, and major renovations (5% amortized over 20 years).'}</p>
        </div>
      </div>
    </div>
  )
}
