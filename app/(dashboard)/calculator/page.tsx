'use client'
import { useState } from 'react'
import { useLang } from '@/lib/lang-context'
import { calculateRentIncrease } from '@/lib/tal-calculator'
import { Calculator, ChevronDown, ChevronUp, TrendingUp, Download } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CalculatorPage() {
  const { tr, lang } = useLang()
  const [form, setForm] = useState({
    currentRent: '',
    isHeated: true,
    taxIncrease: '',
    insuranceIncrease: '',
    renovationCost: '',
    renovationUnits: '1',
    year: 2026,
  })
  const [result, setResult] = useState<ReturnType<typeof calculateRentIncrease> | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.currentRent) return toast.error(lang === 'fr' ? 'Entrez le loyer actuel' : 'Enter current rent')
    const res = calculateRentIncrease({
      currentRent: parseFloat(form.currentRent),
      isHeated: form.isHeated,
      taxIncrease: parseFloat(form.taxIncrease || '0'),
      insuranceIncrease: parseFloat(form.insuranceIncrease || '0'),
      renovationCost: parseFloat(form.renovationCost || '0'),
      renovationUnits: parseInt(form.renovationUnits || '1'),
      year: form.year,
    })
    setResult(res)
  }

  const fmt = (n: number) => n.toLocaleString(lang === 'fr' ? 'fr-CA' : 'en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2 })
  const fmtPct = (n: number) => (n * 100).toFixed(2) + '%'

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Calculator size={24} className="text-teal-400" />
          {tr.calculator.title}
        </h1>
        <p className="text-slate-400 mt-1 text-sm">{tr.calculator.subtitle}</p>
        <div className="mt-2 inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/20 rounded-lg px-3 py-1.5">
          <TrendingUp size={13} className="text-teal-400" />
          <span className="text-xs text-teal-300 font-medium">
            {lang === 'fr' ? `Taux TAL 2026: 3.1% (IPC moyen 3 ans)` : `TAL 2026 rate: 3.1% (3-year avg CPI)`}
          </span>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label className="label">{tr.calculator.currentRent}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              <input type="number" min="0" step="0.01" className="input pl-7" required
                value={form.currentRent} onChange={e => setForm({...form, currentRent: e.target.value})}
                placeholder="1000.00" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="heated" checked={form.isHeated}
              onChange={e => setForm({...form, isHeated: e.target.checked})}
              className="w-4 h-4 accent-teal-500" />
            <label htmlFor="heated" className="text-sm text-slate-300 cursor-pointer">
              {tr.calculator.isHeated}
            </label>
          </div>

          <button type="button" onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-teal-400 transition-colors">
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {lang === 'fr' ? 'Ajustements optionnels (taxes, assurances, travaux)' : 'Optional adjustments (taxes, insurance, renovations)'}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-navy-600">
              <div>
                <label className="label text-xs">{tr.calculator.taxIncrease}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input type="number" min="0" className="input pl-7" value={form.taxIncrease}
                    onChange={e => setForm({...form, taxIncrease: e.target.value})} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="label text-xs">{tr.calculator.insuranceIncrease}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input type="number" min="0" className="input pl-7" value={form.insuranceIncrease}
                    onChange={e => setForm({...form, insuranceIncrease: e.target.value})} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="label text-xs">{tr.calculator.renovationCost}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input type="number" min="0" className="input pl-7" value={form.renovationCost}
                    onChange={e => setForm({...form, renovationCost: e.target.value})} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="label text-xs">{tr.calculator.renovationUnits}</label>
                <input type="number" min="1" className="input" value={form.renovationUnits}
                  onChange={e => setForm({...form, renovationUnits: e.target.value})} />
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary w-full py-3 text-base">
            {tr.calculator.calculate}
          </button>
        </form>
      </div>

      {result && (
        <div className="card border-teal-500/30">
          <h2 className="text-base font-semibold text-white mb-4">{tr.calculator.result}</h2>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-navy-700 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">{tr.calculator.increase}</p>
              <p className="text-2xl font-bold text-teal-400">+{fmt(result.totalIncrease)}</p>
              <p className="text-xs text-slate-400 mt-0.5">{fmtPct(result.totalIncreasePct)} · {tr.calculator.perMonth}</p>
            </div>
            <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">{tr.calculator.newRent}</p>
              <p className="text-2xl font-bold text-white">{fmt(result.newRent)}</p>
              <p className="text-xs text-slate-400 mt-0.5">{tr.calculator.perMonth}</p>
            </div>
          </div>

          {result.breakdown.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                {lang === 'fr' ? 'Détail du calcul' : 'Calculation breakdown'}
              </p>
              {result.breakdown.map((b, i) => (
                <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-navy-700 last:border-0">
                  <span className="text-slate-300">{lang === 'fr' ? b.label : b.labelEn}</span>
                  <span className="font-medium text-white">+{fmt(b.amount)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 flex gap-2">
            <button
              onClick={() => toast.success(lang === 'fr' ? 'Fonctionnalité bientôt disponible' : 'Coming soon')}
              className="btn-primary flex items-center gap-2 flex-1 justify-center"
            >
              <Download size={14} />
              {tr.calculator.generateNotice}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
