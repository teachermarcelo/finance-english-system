import { Link, useLocation } from 'react-router-dom'
import { BarChart3, BookUser, CreditCard, Landmark, Link2, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const navigation = [
  { to: '/', label: 'Dashboard', icon: BarChart3 },
  { to: '/alunos', label: 'Alunos', icon: BookUser },
  { to: '/mensalidades', label: 'Mensalidades', icon: CreditCard },
  { to: '/financeiro', label: 'Financeiro', icon: Landmark },
  { to: '/links', label: 'Links', icon: Link2 },
]

export default function AppLayout({ children }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white p-6 shadow-xl transition lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center gap-3">
            <div className="rounded-3xl bg-gradient-to-br from-sky-500 via-indigo-600 to-violet-600 p-3 text-white shadow-lg">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Escola de inglês</p>
              <h2 className="text-xl font-black">Finance Manager</h2>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => {
              const active = location.pathname === item.to
              const Icon = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 rounded-3xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Usuário conectado</p>
            <p className="mt-2 text-sm font-bold text-slate-900">{user?.email}</p>
            <button
              type="button"
              onClick={signOut}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          />
        ) : null}

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:hidden">
            <div>
              <p className="text-sm font-semibold text-slate-500">Painel financeiro</p>
              <p className="text-lg font-black text-slate-900">Escola de inglês</p>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-2xl border border-slate-200 p-3 text-slate-600"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
