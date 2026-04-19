import { useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { FormField, inputClassName } from '../components/FormField'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    const action = mode === 'login'
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password })

    const { error } = await action
    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success(mode === 'login' ? 'Login realizado com sucesso!' : 'Conta criada. Verifique seu e-mail se a confirmação estiver ativada.')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.24),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(6,182,212,0.22),_transparent_30%),#f8fafc] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-slate-200 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-gradient-to-br from-sky-600 via-indigo-700 to-violet-700 p-8 text-white sm:p-10">
          <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/90">
            Sistema financeiro
          </p>
          <h1 className="mt-6 text-4xl font-black tracking-tight">Controle sua escola de inglês com clareza.</h1>
          <p className="mt-4 max-w-lg text-base text-white/85">
            Cadastre alunos, acompanhe mensalidades, registre entradas e saídas e enxergue tudo em um dashboard moderno, colorido e responsivo.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {['Dashboard com gráficos', 'Mensalidades pagas e pendentes', 'CRUD completo', 'Links e observações extras'].map((item) => (
              <div key={item} className="rounded-3xl border border-white/15 bg-white/10 p-4 text-sm font-semibold">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900">{mode === 'login' ? 'Entrar no sistema' : 'Criar conta'}</h2>
            <p className="mt-2 text-sm text-slate-500">Use seu e-mail e senha para acessar seu painel financeiro.</p>
          </div>

          <div className="mb-6 inline-flex rounded-2xl bg-slate-100 p-1">
            <button type="button" onClick={() => setMode('login')} className={`rounded-2xl px-4 py-2 text-sm font-semibold ${mode === 'login' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>
              Login
            </button>
            <button type="button" onClick={() => setMode('register')} className={`rounded-2xl px-4 py-2 text-sm font-semibold ${mode === 'register' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>
              Cadastro
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="E-mail">
              <input className={inputClassName()} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </FormField>
            <FormField label="Senha">
              <input className={inputClassName()} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} />
            </FormField>
            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60">
              {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
