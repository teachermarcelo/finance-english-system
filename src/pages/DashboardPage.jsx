import { DollarSign, Wallet, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { useCrud } from '../hooks/useCrud'
import { calculateDashboardMetrics, getMonthlyOverview, getStatusChart } from '../utils/dashboard'
import { formatCurrency, formatDate, getCurrentMonth } from '../utils/formatters'
import { CashflowChart, EntryExitChart, StatusPieChart } from '../components/DashboardCharts'
import CardSection from '../components/CardSection'

export default function DashboardPage() {
  const students = useCrud('students')
  const payments = useCrud('payments', '*, students(name)', 'due_date', false)
  const entries = useCrud('financial_entries', '*', 'entry_date', false)
  const monthFilter = getCurrentMonth()

  const metrics = useMemo(
    () => calculateDashboardMetrics(payments.data, entries.data, students.data, monthFilter),
    [payments.data, entries.data, students.data, monthFilter],
  )

  const monthlyOverview = useMemo(() => getMonthlyOverview(payments.data, entries.data), [payments.data, entries.data])
  const statusData = useMemo(() => getStatusChart(payments.data, monthFilter), [payments.data, monthFilter])

  const upcomingPayments = payments.data
    .filter((payment) => payment.status !== 'pago')
    .slice(0, 6)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard financeiro"
        description="Acompanhe recebimentos, pendências, despesas e o desempenho financeiro da sua escola em um só lugar."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Recebido no mês" value={formatCurrency(metrics.totalReceived)} icon={DollarSign} accent="from-emerald-500 to-green-600" />
        <StatCard title="Pendente no mês" value={formatCurrency(metrics.totalPending)} icon={Wallet} accent="from-amber-500 to-orange-600" />
        <StatCard title="Despesas no mês" value={formatCurrency(metrics.totalExpenses)} icon={TrendingDown} accent="from-rose-500 to-red-600" />
        <StatCard title="Lucro líquido" value={formatCurrency(metrics.netProfit)} icon={TrendingUp} accent="from-sky-500 to-indigo-600" />
        <StatCard title="Alunos ativos" value={metrics.activeStudents} icon={Users} accent="from-violet-500 to-purple-600" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CashflowChart data={monthlyOverview} />
        <EntryExitChart data={monthlyOverview} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <StatusPieChart data={statusData} />
        <CardSection title="Próximos vencimentos" subtitle="Mensalidades ainda não quitadas.">
          <div className="space-y-3">
            {upcomingPayments.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma mensalidade pendente no momento.</p>
            ) : (
              upcomingPayments.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{item.students?.name || 'Aluno sem nome'}</p>
                    <p className="text-sm text-slate-500">{item.competence} • Vence em {formatDate(item.due_date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${item.status === 'atrasado' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      {item.status}
                    </span>
                    <span className="text-sm font-black text-slate-900">{formatCurrency(item.amount)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardSection>
      </div>
    </div>
  )
}
