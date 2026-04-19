import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useToast } from '../contexts/ToastContext'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const action = mode === 'login'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password })

      const { error } = await action
      if (error) throw error
      showToast(mode === 'login' ? 'Login realizado com sucesso.' : 'Conta criada com sucesso.')
    } catch (error) {
      showToast(error.message || 'Falha ao autenticar.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="card grid w-full max-w-5xl overflow-hidden md:grid-cols-2">
        <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-8 text-white md:p-12">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-indigo-100">Escola de inglês</p>
          <h1 className="text-4xl font-black leading-tight">Controle sua escola com clareza financeira.</h1>
          <p className="mt-4 max-w-md text-indigo-100">
            Cadastre alunos, acompanhe mensalidades, visualize o fluxo de caixa e mantenha tudo centralizado.
          </p>
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-8 flex rounded-2xl bg-slate-100 p-1">
            <button onClick={() => setMode('login')} className={`flex-1 rounded-2xl px-4 py-3 font-semibold ${mode === 'login' ? 'bg-white shadow' : 'text-slate-500'}`}>Entrar</button>
            <button onClick={() => setMode('register')} className={`flex-1 rounded-2xl px-4 py-3 font-semibold ${mode === 'register' ? 'bg-white shadow' : 'text-slate-500'}`}>Criar conta</button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="label">E-mail</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Senha</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? 'Carregando...' : mode === 'login' ? 'Entrar no sistema' : 'Criar conta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
