import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/PageHeader'
import FinanceForm from '../components/FinanceForm'
import ConfirmDialog from '../components/ConfirmDialog'
import { currency, formatDate, statusBadgeClass } from '../lib/utils'
import { useToast } from '../contexts/ToastContext'

export default function FinancePage() {
  const [entries, setEntries] = useState([])
  const [openForm, setOpenForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [removeId, setRemoveId] = useState(null)
  const [filters, setFilters] = useState({ month: '', type: '' })
  const { showToast } = useToast()

  const loadEntries = async () => {
    const { data } = await supabase.from('financial_entries').select('*').order('entry_date', { ascending: false })
    setEntries(data || [])
  }

  useEffect(() => { loadEntries() }, [])

  const filtered = entries.filter((item) => {
    const monthOk = !filters.month || item.entry_date?.startsWith(filters.month)
    const typeOk = !filters.type || item.type === filters.type
    return monthOk && typeOk
  })

  const handleDelete = async () => {
    const { error } = await supabase.from('financial_entries').delete().eq('id', removeId)
    if (error) return showToast(error.message, 'error')
    showToast('Lançamento excluído com sucesso.')
    setRemoveId(null)
    loadEntries()
  }

  return (
    <>
      <PageHeader
        title="Financeiro"
        subtitle="Registre entradas e saídas fora das mensalidades e acompanhe o caixa."
        action={<button className="btn-primary" onClick={() => { setSelected(null); setOpenForm(true) }}><Plus size={18} /> Novo lançamento</button>}
      />

      <div className="card mb-6 grid gap-4 p-4 md:grid-cols-2">
        <input className="input" type="month" value={filters.month} onChange={(e) => setFilters((prev) => ({ ...prev, month: e.target.value }))} />
        <select className="input" value={filters.type} onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}>
          <option value="">Todos os tipos</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                {['Tipo', 'Categoria', 'Descrição', 'Valor', 'Data', 'Ações'].map((head) => <th key={head} className="px-5 py-4 font-semibold">{head}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className="border-t border-slate-100 text-sm text-slate-700">
                  <td className="px-5 py-4"><span className={`badge ${statusBadgeClass(entry.type)}`}>{entry.type}</span></td>
                  <td className="px-5 py-4 font-semibold">{entry.category}</td>
                  <td className="px-5 py-4">{entry.description}</td>
                  <td className="px-5 py-4">{currency(entry.amount)}</td>
                  <td className="px-5 py-4">{formatDate(entry.entry_date)}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="btn-secondary p-3" onClick={() => { setSelected(entry); setOpenForm(true) }}><Pencil size={16} /></button>
                      <button className="btn-secondary p-3" onClick={() => setRemoveId(entry.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan="6" className="px-5 py-12 text-center text-slate-500">Nenhum lançamento encontrado.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <FinanceForm key={selected?.id || 'new'} open={openForm} onClose={() => setOpenForm(false)} current={selected} onSaved={loadEntries} />
      <ConfirmDialog open={!!removeId} message="Tem certeza que deseja excluir este lançamento?" onCancel={() => setRemoveId(null)} onConfirm={handleDelete} />
    </>
  )
}
