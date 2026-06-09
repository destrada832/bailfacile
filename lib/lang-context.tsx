'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { t } from './translations'
import type { Lang } from '@/types'

const LangContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
  tr: typeof t['fr']
}>({ lang: 'fr', setLang: () => {}, tr: t.fr })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr')
  useEffect(() => {
    const stored = localStorage.getItem('bf_lang') as Lang
    if (stored) setLangState(stored)
  }, [])
  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('bf_lang', l)
  }
  return (
    <LangContext.Provider value={{ lang, setLang, tr: t[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
