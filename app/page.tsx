'use client'
import Link from 'next/link'
import { useLang } from '@/lib/lang-context'
import { LangToggle } from '@/components/ui/LangToggle'
import { useState } from 'react'
import { calculateRentIncrease } from '@/lib/tal-calculator'
import { Home, Calculator, Shield, Clock, ArrowRight, Check } from 'lucide-react'

export default function LandingPage() {
  const { lang } = useLang()
  const [rent, setRent] = useState('')
  const [result, setResult] = useState<any>(null)

  const fr = lang === 'fr'
  const fmt = (n: number) => n.toLocaleString(fr ? 'fr-CA' : 'en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2 })

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rent) return
    const res = calculateRentIncrease({ currentRent: parseFloat(rent), isHeated: false, taxIncrease: 0, insuranceIncrease: 0, renovationCost: 0, renovationUnits: 1, year: 2026 })
    setResult(res)
  }

  const features = fr ? [
    { icon: Calculator, title: 'Calculateur TAL officiel', desc: 'Calcul instantané selon les paramètres 2026 du Tribunal administratif du logement.' },
    { icon: Clock, title: 'Suivi des délais', desc: 'Alertes automatiques pour les avis de renouvellement et délais de réponse.' },
    { icon: Shield, title: 'Avis PDF légaux', desc: 'Générez les avis de modification de bail avec toutes les mentions légales requises.' },
    { icon: Home, title: 'Gestion complète', desc: 'Propriétés, logements, locataires et baux dans une seule interface bilingue.' },
  ] : [
    { icon: Calculator, title: 'Official TAL Calculator', desc: 'Instant calculation based on the 2026 Tribunal administratif du logement parameters.' },
    { icon: Clock, title: 'Deadline tracking', desc: 'Automatic alerts for renewal notices and tenant response deadlines.' },
    { icon: Shield, title: 'Legal PDF notices', desc: 'Generate lease modification notices with all required legal mentions.' },
    { icon: Home, title: 'Complete management', desc: 'Properties, units, tenants and leases in one bilingual interface.' },
  ]

  const plans = [
    { name: fr ? 'Gratuit' : 'Free', price: 0, features: fr ? ['1 propriété · 3 logements', 'Calculateur TAL', 'Accès de base'] : ['1 property · 3 units', 'TAL Calculator', 'Basic access'] },
    { name: fr ? 'Débutant' : 'Starter', price: 29, popular: false, features: fr ? ['3 propriétés · 15 logements', 'Avis PDF', 'Suivi renouvellements', 'Support email'] : ['3 properties · 15 units', 'PDF notices', 'Renewal tracking', 'Email support'] },
    { name: 'Pro', price: 79, popular: true, features: fr ? ['Illimité', 'Documents', 'Rappels automatiques', 'Support prioritaire'] : ['Unlimited', 'Documents', 'Automatic reminders', 'Priority support'] },
  ]

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Nav */}
      <nav className="border-b border-navy-700 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <Home size={16} className="text-navy-900" />
          </div>
          <span className="font-bold text-white text-xl">BailFacile</span>
        </div>
        <div className="flex items-center gap-3">
          <LangToggle />
          <Link href="/login" className="btn-ghost">{fr ? 'Connexion' : 'Sign in'}</Link>
          <Link href="/signup" className="btn-primary">{fr ? 'Essayer gratuitement' : 'Try for free'}</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
          <span className="text-xs text-teal-300 font-medium">
            {fr ? 'Nouveau taux TAL 2026 : 3.1% — Calculez maintenant' : 'New TAL 2026 rate: 3.1% — Calculate now'}
          </span>
        </div>
        <h1 className="text-5xl font-bold text-white leading-tight mb-6">
          {fr ? (<>Gestion locative<br /><span className="text-teal-400">québécoise simplifiée</span></>) : (<>Quebec rental management<br /><span className="text-teal-400">made simple</span></>)}
        </h1>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          {fr ? 'Calculez vos augmentations de loyer TAL, suivez vos renouvellements et générez des avis légaux — en français et en anglais.' : 'Calculate TAL rent increases, track your renewals, and generate legal notices — in French and English.'}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-6 py-3 flex items-center gap-2">
            {fr ? 'Commencer gratuitement' : 'Start for free'} <ArrowRight size={16} />
          </Link>
          <a href="#calculateur" className="btn-secondary text-base px-6 py-3">
            {fr ? 'Essayer le calculateur' : 'Try the calculator'}
          </a>
        </div>
      </section>

      {/* Free Calculator */}
      <section id="calculateur" className="max-w-2xl mx-auto px-6 pb-20">
        <div className="card border-teal-500/20">
          <div className="flex items-center gap-2 mb-5">
            <Calculator size={18} className="text-teal-400" />
            <h2 className="font-bold text-white">{fr ? 'Calculateur TAL 2026 — Gratuit' : 'TAL 2026 Calculator — Free'}</h2>
          </div>
          <form onSubmit={handleCalc} className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input type="number" className="input pl-7" placeholder={fr ? 'Loyer actuel' : 'Current rent'}
                value={rent} onChange={e => setRent(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary px-6 whitespace-nowrap">
              {fr ? 'Calculer' : 'Calculate'}
            </button>
          </form>
          {result && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-navy-700 rounded-xl p-4">
                <p className="text-xs text-slate-400">{fr ? 'Augmentation' : 'Increase'}</p>
                <p className="text-xl font-bold text-teal-400">+{fmt(result.totalIncrease)}</p>
                <p className="text-xs text-slate-400">{(result.totalIncreasePct * 100).toFixed(2)}%</p>
              </div>
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4">
                <p className="text-xs text-slate-400">{fr ? 'Nouveau loyer' : 'New rent'}</p>
                <p className="text-xl font-bold text-white">{fmt(result.newRent)}</p>
                <p className="text-xs text-slate-400">{fr ? 'par mois' : 'per month'}</p>
              </div>
            </div>
          )}
          <p className="text-xs text-slate-500 mt-3">
            {fr ? '✓ Basé sur le taux IPC officiel du TAL · Calcul instantané · Aucune inscription requise' : '✓ Based on official TAL CPI rate · Instant calculation · No signup required'}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          {fr ? 'Tout ce dont vous avez besoin' : 'Everything you need'}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card hover:border-teal-500/30 transition-colors">
              <div className="w-9 h-9 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                <Icon size={16} className="text-teal-400" />
              </div>
              <h3 className="font-semibold text-white mb-2 text-sm">{title}</h3>
              <p className="text-slate-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">{fr ? 'Tarifs simples' : 'Simple pricing'}</h2>
        <div className="grid grid-cols-3 gap-5">
          {plans.map(p => (
            <div key={p.name} className={`card ${p.popular ? 'border-teal-500/40 bg-teal-500/5 relative' : ''}`}>
              {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-green px-3">{fr ? 'Populaire' : 'Popular'}</span>}
              <p className="font-bold text-white">{p.name}</p>
              <p className="text-3xl font-bold text-white mt-2">${p.price}<span className="text-sm font-normal text-slate-400">/mois</span></p>
              <ul className="mt-4 space-y-2 mb-6">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check size={13} className="text-teal-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className={`block text-center text-sm font-medium py-2.5 rounded-lg transition-colors ${p.popular ? 'btn-primary' : 'btn-secondary'}`}>
                {fr ? 'Commencer' : 'Get started'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-700 px-6 py-8 max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center">
            <Home size={11} className="text-navy-900" />
          </div>
          <span className="font-bold text-white">BailFacile</span>
        </div>
        <p className="text-xs text-slate-500">
          {fr ? '© 2026 BailFacile · Gestion locative québécoise' : '© 2026 BailFacile · Quebec rental management'}
        </p>
        <div className="flex gap-4">
          <LangToggle />
        </div>
      </footer>
    </div>
  )
}
