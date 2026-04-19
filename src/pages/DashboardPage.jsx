import { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/PageHeader'
import StatsCard from '../components/StatsCard'
import { currency, monthKey, paymentStatus } from '../lib/utils'

export default function DashboardPage() {
  const [students, setStudents] = useState([])
  const [payments, setPayments] = useState([])
  const [entries, setEntries] = useState([])

  useEffect(() => {
    Promise.all([
      supabase.from('students').select('*'),
      supabase.from('payments').select('*'),
      supabase.from('financial_entries').select('*'),
    ]).then(([studentRes, paymentRes, entryRes]) => {
      setStudents(studentRes.data || [])
      setPayments(paymentRes.data || [])
      setEntries(entryRes.data || [])
    })
  }, [])

  const metrics = useMemo(() => {
    const received = payments.filter((p) => p.status === 'pago').reduce((sum, item) => sum + Number(item.amount || 0), 0)
    const pending = payments.filter((p) => paymentStatus(p.status, p.due_date, p.payment_date) !== 'pago').reduce((sum, item) => sum + Number(item.amount || 0), 0)
    const income = entries.filter((e) => e.type === 'entrada').reduce((sum, item) => sum + Number(item.amount || 0), 0)
    const expenses = entries.filter((e) => e.type === 'saida').reduce((sum, item) => sum + Number(item.amount || 0), 0)
    return {
      received,
      pending,
      expenses,
      balance: received + income - expenses,
      activeStudents: students.filter((student) => student.status === 'ativo').length,
    }
  }, [students, payments, entries])

  const monthlyData = useMemo(() => {
    const map = new Map()
    const pushMonth = (key) => {
      if (!map.has(key)) map.set(key, { month: key, entradas: 0, saidas: 0, recebimentos: 0 })
      return map.get(key)
    }

    payments.forEach((item) => {
      const row = pushMonth(monthKey(item.due_date))
      if (item.status === 'pago') row.recebimentos += Number(item.amount || 0)
    })

    entries.forEach((item) => {
      const row = pushMonth(monthKey(item.entry_date))
      if (item.type === 'entrada') row.entradas += Number(item.amount || 0)
      if (item.type === 'saida') row.saidas += Number(item.amount || 0)
    })

    return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month)).slice(-6)
  }, [payments, entries])

  const paymentPie = useMemo(() => {
    const paid = payments.filter((p) => p.status === 'pago').length
    const pending = payments.filter((p) => paymentStatus(p.status, p.due_date, p.payment_date) === 'pendente').length
    const overdue = payments.filter((p) => paymentStatus(p.status, p.due_date, p.payment_date) === 'atrasado').length
    return [
      { name: 'Pago', value: paid },
      { name: 'Pendente', value: pending },
      { name: 'Atrasado', value: overdue },
    ]
  }, [payments])

  return (
    <>
      <PageHeader title="Dashboard financeiro" subtitle="Tenha visão rápida do caixa, da inadimplência e da saúde financeira da escola." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatsCard title="Recebido" value={currency(metrics.received)} />
        <StatsCard title="Pendente" value={currency(metrics.pending)} />
        <StatsCard title="Despesas" value={currency(metrics.expenses)} />
        <StatsCard title="Lucro líquido" value={currency(metrics.balance)} />
        <StatsCard title="Alunos ativos" value={String(metrics.activeStudents)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="card p-5">
          <h2 className="mb-4 text-xl font-bold text-slate-800">Fluxo por mês</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => currency(value)} />
                <Legend />
                <Line type="monotone" dataKey="recebimentos" stroke="#4f46e5" strokeWidth={3} />
                <Line type="monotone" dataKey="entradas" stroke="#16a34a" strokeWidth={3} />
                <Line type="monotone" dataKey="saidas" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 text-xl font-bold text-slate-800">Status das mensalidades</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentPie} dataKey="value" nameKey="name" outerRadius={110} label>
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card mt-6 p-5">
        <h2 className="mb-4 text-xl font-bold text-slate-800">Resumo comparativo</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => currency(value)} />
              <Legend />
              <Bar dataKey="recebimentos" fill="#4f46e5" />
              <Bar dataKey="saidas" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}
