'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useLang } from '@/lib/lang-context'
import { LangToggle } from '@/components/ui/LangToggle'
import Link from 'next/link'
import { Home } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { tr } = useLang()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { toast.error(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <Home size={16} className="text-navy-900" />
            </div>
            <span className="font-bold text-white text-xl">BailFacile</span>
          </Link>
          <LangToggle />
        </div>

        <div className="card">
          <h1 className="text-xl font-bold text-white mb-6">{tr.auth.login}</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">{tr.auth.email}</label>
              <input type="email" className="input" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div>
              <label className="label">{tr.auth.password}</label>
              <input type="password" className="input" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
              {loading ? tr.common.loading : tr.auth.loginBtn}
            </button>
          </form>
          <p className="text-sm text-slate-400 mt-4 text-center">
            {tr.auth.noAccount}{' '}
            <Link href="/signup" className="text-teal-400 hover:underline">{tr.auth.signup}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
