import type { Metadata } from 'next'
import './globals.css'
import { LangProvider } from '@/lib/lang-context'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'BailFacile — Gestion locative Québec',
  description: 'Calculateur TAL, renouvellements de bail et gestion locative pour propriétaires québécois. Bilingue français/anglais.',
  keywords: 'calcul augmentation loyer Quebec, TAL, renouvellement bail, gestion locative',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <LangProvider>
          {children}
          <Toaster position="top-right" toastOptions={{
            style: { background: '#162338', color: '#E8EDF4', border: '1px solid #2A3F5C' },
            success: { iconTheme: { primary: '#00D4A8', secondary: '#0F1C2E' } },
          }} />
        </LangProvider>
      </body>
    </html>
  )
}
