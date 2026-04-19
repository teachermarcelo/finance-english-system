import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import CardSection from '../components/CardSection'
import EmptyState from '../components/EmptyState'
import LoadingTable from '../components/LoadingTable'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import PaymentForm from '../components/PaymentForm'
import { useCrud } from '../hooks/useCrud'
import { formatCurrency, formatDate, getCurrentMonth, monthKeyFromDate } from '../utils/formatters'

export default function PaymentsPage() {
  const students = useCrud('students')
  const payments = useCrud('payments', '*, students(name)', 'due_date', false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [monthFilter, setMonthFilter] = useState(getCurrentMonth())

  const filteredPayments = useMemo(() => {
    return payments.data.filter((payment) => {
      const matchesSearch = !search || [payment.students?.name, payment.competence, payment.payment_method]
        .some((value) => value?.toLowerCase().includes(search.toLowerCase()))
      const matchesStatus = statusFilter === 'todos' || payment.status === statusFilter
      const matchesMonth = !monthFilter || monthKeyFromDate(payment.due_date) === monthFilter
      return matchesSearch && matchesStatus && matchesMonth
    })
  }, [payments.data, search, statusFilter, monthFilter])

  const handleCreate = () => {
    setEditing(null)
    setOpen(true)
  }

  const handleEdit = (item) => {
    setEditing(item)
    setOpen(true)
  }

  const handleSubmit = async (values) => {
    setSubmitting(true)
    try {
      if (editing) {
        await payments.updateRow(editing.id, values, 'Mensalidade atualizada com sucesso!')
      } else {
        await payments.insertRow(values, 'Mensalidade cadastrada com sucesso!')
      }
      setOpen(false)
      setEditing(null)
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente remover esta mensalidade?')) return
    try {
      await payments.deleteRow(id, 'Mensalidade removida com sucesso!')
    } catch (error) {
      toast.error('Erro ao remover mensalidade.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Controle de mensalidades"
        description="Registre pagamentos, acompanhe vencimentos e filtre rapidamente por aluno, status ou mês."
        action={
          <button onClick={handleCreate} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-md transition hover:scale-[1.02]">
            <Plus className="h-4 w-4" /> Nova mensalidade
          </button>
        }
      />

      <CardSection title="Filtros" subtitle="Organize sua visão financeira por período e situação.">
        <div className="grid gap-4 md:grid-cols-4">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por aluno ou competência" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
            <option value="todos">Todos os status</option>
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
            <option value="atrasado">Atrasado</option>
          </select>
          <input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
          <button onClick={() => { setSearch(''); setStatusFilter('todos'); setMonthFilter('') }} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Limpar filtros</button>
        </div>
      </CardSection>

      <CardSection title="Mensalidades registradas" subtitle="Lista completa com ações de edição e exclusão.">
        {payments.loading ? (
          <LoadingTable />
        ) : filteredPayments.length === 0 ? (
          <EmptyState title="Nenhuma mensalidade encontrada" description="Cadastre sua primeira cobrança ou revise os filtros aplicados." />
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-4">Aluno</th>
                    <th className="px-4 py-4">Competência</th>
                    <th className="px-4 py-4">Valor</th>
                    <th className="px-4 py-4">Vencimento</th>
                    <th className="px-4 py-4">Pagamento</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-bold text-slate-900">{payment.students?.name || '-'}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{payment.competence}</td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-900">{formatCurrency(payment.amount)}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{formatDate(payment.due_date)}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{formatDate(payment.payment_date)}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${payment.status === 'pago' ? 'bg-emerald-100 text-emerald-700' : payment.status === 'pendente' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(payment)} className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => handleDelete(payment.id)} className="rounded-2xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardSection>

      <Modal open={open} title={editing ? 'Editar mensalidade' : 'Nova mensalidade'} onClose={() => setOpen(false)}>
        <PaymentForm initialValues={editing} students={students.data} onSubmit={handleSubmit} submitting={submitting} />
      </Modal>
    </div>
  )
}
