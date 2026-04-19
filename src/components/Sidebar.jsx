import { BarChart3, BookUser, CreditCard, LayoutDashboard, Link2, LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const items = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/alunos', label: 'Alunos', icon: BookUser },
  { to: '/mensalidades', label: 'Mensalidades', icon: CreditCard },
  { to: '/financeiro', label: 'Financeiro', icon: BarChart3 },
  { to: '/links', label: 'Links', icon: Link2 },
]

export default function Sidebar() {
  return (
    <aside className="card sticky top-6 h-fit p-4">
      <div className="mb-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white">
        <p className="text-sm text-indigo-100">Sistema</p>
        <h2 className="text-xl font-bold">Fluent Finance</h2>
      </div>

      <nav className="space-y-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 font-medium transition ${
                isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => supabase.auth.signOut()}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
      >
        <LogOut size={18} /> Sair
      </button>
    </aside>
  )
}
