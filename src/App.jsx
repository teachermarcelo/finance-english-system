import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import DashboardPage from './pages/DashboardPage'
import StudentsPage from './pages/StudentsPage'
import PaymentsPage from './pages/PaymentsPage'
import FinancePage from './pages/FinancePage'
import LinksPage from './pages/LinksPage'
import LoginPage from './pages/LoginPage'
import AppLayout from './layouts/AppLayout'

function ProtectedRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/alunos" element={<StudentsPage />} />
        <Route path="/mensalidades" element={<PaymentsPage />} />
        <Route path="/financeiro" element={<FinancePage />} />
        <Route path="/links" element={<LinksPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <p className="text-lg font-semibold text-slate-700">Carregando sistema...</p>
        </div>
      </div>
    )
  }

  return user ? <ProtectedRoutes /> : <LoginPage />
}
