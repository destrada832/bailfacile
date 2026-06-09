'use client'
import { useLang } from '@/lib/lang-context'

export function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <button
      onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
      className="text-xs font-medium text-slate-400 hover:text-teal-400 transition-colors border border-navy-600 rounded px-2 py-1"
    >
      {lang === 'fr' ? 'EN' : 'FR'}
    </button>
  )
}
