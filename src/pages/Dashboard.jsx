import { useState, useEffect } from 'react';
import { supabase, formatCurrency } from '../services/supabase';
import { calculateMonthlyData } from '../utils/helpers';
import StatCard from '../components/UI/Card';
import LineChart from '../components/Charts/LineChart';
import BarChart from '../components/Charts/BarChart';
import { TrendingUp, TrendingDown, DollarSign, Users, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState({ payments: [], financialEntries: [], students: [] });
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [paymentsRes, financialRes, studentsRes] = await Promise.all([
        supabase.from('es_payments').select('*, es_students(name)').order('due_date', { ascending: false }),
        supabase.from('es_financial_entries').select('*').order('date', { ascending: false }),
        supabase.from('es_students').select('*').order('created_at', { ascending: false })
      ]);

      if (paymentsRes.error) throw paymentsRes.error;
      if (financialRes.error) throw financialRes.error;
      if (studentsRes.error) throw studentsRes.error;

      const payments = paymentsRes.data || [];
      const financialEntries = financialRes.data || [];
      const students = studentsRes.data || [];

      const totalReceived = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
      const totalPending = payments.filter(p => p.status !== 'paid').reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
      const totalExpenses = financialEntries.filter(e => e.type === 'expense').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
      const totalIncome = financialEntries.filter(e => e.type === 'income').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
      
      const netProfit = totalReceived - totalExpenses;
      setData({ payments, financialEntries, students });
      
      const calculatedMonthly = calculateMonthlyData(payments, financialEntries, 6);
      setMonthlyData(calculatedMonthly);
      setStats({ totalReceived, totalPending, totalExpenses, netProfit, activeStudents: students.length });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Recebido" value={formatCurrency(stats.totalReceived)} subtitle="Mensalidades pagas" icon={TrendingUp} color="green" />
        <StatCard title="Total Pendente" value={formatCurrency(stats.totalPending)} subtitle="Mensalidades a receber" icon={AlertCircle} color="yellow" />
        <StatCard title="Total Despesas" value={formatCurrency(stats.totalExpenses)} subtitle="Gastos do período" icon={TrendingDown} color="red" />
        <StatCard title="Lucro Líquido" value={formatCurrency(stats.netProfit)} subtitle="Recebido - Despesas" icon={DollarSign} color="purple" />
        <StatCard title="Alunos Ativos" value={stats.activeStudents} subtitle="Cadastrados no sistema" icon={Users} color="blue" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recebimentos vs Pendências</h3>
          <LineChart data={monthlyData} lines={[{ dataKey: 'recebido', name: 'Recebido', color: '#22c55e' }, { dataKey: 'pendente', name: 'Pendente', color: '#eab308' }]} />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Entradas vs Despesas</h3>
          <BarChart data={monthlyData} bars={[{ dataKey: 'entradas', name: 'Entradas', color: '#3b82f6' }, { dataKey: 'despesas', name: 'Despesas', color: '#ef4444' }]} />
        </div>
      </div>
    </div>
  );
}
