'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useLang } from '@/lib/lang-context'
import { LangToggle } from '@/components/ui/LangToggle'
import Link from 'next/link'
import { Home } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const { tr, lang } = useLang()
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { first_name: form.firstName, last_name: form.lastName } }
    })
    if (error) { toast.error(error.message); setLoading(false); return }
    toast.success(lang === 'fr' ? 'Compte créé! Vérifiez votre courriel.' : 'Account created! Check your email.')
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
          <h1 className="text-xl font-bold text-white mb-6">{tr.auth.signup}</h1>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">{tr.auth.firstName}</label>
                <input type="text" className="input" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
              </div>
              <div>
                <label className="label">{tr.auth.lastName}</label>
                <input type="text" className="input" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="label">{tr.auth.email}</label>
              <input type="email" className="input" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label className="label">{tr.auth.password}</label>
              <input type="password" className="input" required minLength={8} value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
              {loading ? tr.common.loading : tr.auth.signupBtn}
            </button>
          </form>
          <p className="text-sm text-slate-400 mt-4 text-center">
            {tr.auth.hasAccount}{' '}
            <Link href="/login" className="text-teal-400 hover:underline">{tr.auth.login}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
