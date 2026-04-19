import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import CardSection from '../components/CardSection'
import EmptyState from '../components/EmptyState'
import FinanceEntryForm from '../components/FinanceEntryForm'
import LoadingTable from '../components/LoadingTable'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import { useCrud } from '../hooks/useCrud'
import { formatCurrency, formatDate, getCurrentMonth, monthKeyFromDate } from '../utils/formatters'

export default function FinancePage() {
  const entries = useCrud('financial_entries', '*', 'entry_date', false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [monthFilter, setMonthFilter] = useState(getCurrentMonth())

  const filteredEntries = useMemo(() => {
    return entries.data.filter((entry) => !monthFilter || monthKeyFromDate(entry.entry_date) === monthFilter)
  }, [entries.data, monthFilter])

  const totals = filteredEntries.reduce(
    (acc, entry) => {
      if (entry.type === 'entrada') acc.entrada += Number(entry.amount || 0)
      else acc.saida += Number(entry.amount || 0)
      return acc
    },
    { entrada: 0, saida: 0 },
  )

  const handleSubmit = async (values) => {
    setSubmitting(true)
    try {
      if (editing) {
        await entries.updateRow(editing.id, values, 'Lançamento atualizado com sucesso!')
      } else {
        await entries.insertRow(values, 'Lançamento criado com sucesso!')
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
    if (!window.confirm('Deseja realmente excluir este lançamento?')) return
    try {
      await entries.deleteRow(id, 'Lançamento removido com sucesso!')
    } catch (error) {
      toast.error('Erro ao remover lançamento.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Entradas e saídas"
        description="Registre despesas, receitas extras e acompanhe seu caixa mensal com praticidade."
        action={
          <button onClick={() => { setEditing(null); setOpen(true) }} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-md transition hover:scale-[1.02]">
            <Plus className="h-4 w-4" /> Novo lançamento
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">Entradas do mês</p>
          <p className="mt-3 text-2xl font-black text-emerald-600">{formatCurrency(totals.entrada)}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">Saídas do mês</p>
          <p className="mt-3 text-2xl font-black text-rose-600">{formatCurrency(totals.saida)}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">Saldo do mês</p>
          <p className="mt-3 text-2xl font-black text-indigo-600">{formatCurrency(totals.entrada - totals.saida)}</p>
        </div>
      </div>

      <CardSection title="Lançamentos financeiros" subtitle="Filtre por mês e organize entradas e despesas.">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
          <button onClick={() => setMonthFilter('')} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Mostrar tudo</button>
        </div>

        {entries.loading ? (
          <LoadingTable />
        ) : filteredEntries.length === 0 ? (
          <EmptyState title="Nenhum lançamento encontrado" description="Cadastre receitas ou despesas para acompanhar seu caixa." />
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-4">Tipo</th>
                    <th className="px-4 py-4">Categoria</th>
                    <th className="px-4 py-4">Descrição</th>
                    <th className="px-4 py-4">Data</th>
                    <th className="px-4 py-4">Valor</th>
                    <th className="px-4 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${entry.type === 'entrada' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {entry.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{entry.category}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{entry.description}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{formatDate(entry.entry_date)}</td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-900">{formatCurrency(entry.amount)}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setEditing(entry); setOpen(true) }} className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => handleDelete(entry.id)} className="rounded-2xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
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

      <Modal open={open} title={editing ? 'Editar lançamento' : 'Novo lançamento'} onClose={() => setOpen(false)}>
        <FinanceEntryForm initialValues={editing} onSubmit={handleSubmit} submitting={submitting} />
      </Modal>
    </div>
  )
}
