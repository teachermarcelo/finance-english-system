import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import { useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import StudentsPage from './pages/StudentsPage'
import PaymentsPage from './pages/PaymentsPage'
import FinancePage from './pages/FinancePage'
import LinksPage from './pages/LinksPage'

function PrivateRoutes() {
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
    return <div className="flex min-h-screen items-center justify-center text-lg font-semibold text-slate-600">Carregando...</div>
  }

  return user ? <PrivateRoutes /> : <LoginPage />
}
