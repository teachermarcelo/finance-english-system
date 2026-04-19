import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import CardSection from './CardSection'
import { formatCurrency } from '../utils/formatters'

const pieColors = ['#22c55e', '#f59e0b', '#ef4444']

export function CashflowChart({ data }) {
  return (
    <CardSection title="Visão financeira dos últimos meses" subtitle="Recebimentos, pendências e fluxo geral.">
      <div className="h-80 w-full">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="receivedGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="pendingGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Area type="monotone" dataKey="recebido" stroke="#2563eb" fill="url(#receivedGradient)" />
            <Area type="monotone" dataKey="pendente" stroke="#f97316" fill="url(#pendingGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardSection>
  )
}

export function EntryExitChart({ data }) {
  return (
    <CardSection title="Entradas e saídas" subtitle="Acompanhe o caixa por mês.">
      <div className="h-80 w-full">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="entradas" name="Entradas" radius={[8, 8, 0, 0]} fill="#14b8a6" />
            <Bar dataKey="saidas" name="Saídas" radius={[8, 8, 0, 0]} fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardSection>
  )
}

export function StatusPieChart({ data }) {
  return (
    <CardSection title="Status das mensalidades" subtitle="Distribuição por situação de pagamento.">
      <div className="h-80 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={4}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </CardSection>
  )
}
