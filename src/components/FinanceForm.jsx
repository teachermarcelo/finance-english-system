import { useState } from 'react'
import Modal from './Modal'
import { supabase } from '../lib/supabase'
import { todayIso } from '../lib/utils'
import { useToast } from '../contexts/ToastContext'

const emptyForm = {
  type: 'entrada',
  category: '',
  description: '',
  amount: '',
  entry_date: todayIso(),
  notes: '',
}

export default function FinanceForm({ open, onClose, current, onSaved }) {
  const [form, setForm] = useState(current || emptyForm)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado.')

      const payload = {
        user_id: user.id,
        type: form.type,
        category: form.category.trim(),
        description: form.description.trim(),
        amount: Number(form.amount || 0),
        entry_date: form.entry_date,
        notes: form.notes || null,
      }

      const query = current?.id
        ? supabase.from('financial_entries').update(payload).eq('id', current.id)
        : supabase.from('financial_entries').insert([payload])

      const { error } = await query
      if (error) throw error

      showToast(current?.id ? 'Lançamento atualizado com sucesso.' : 'Lançamento salvo com sucesso.')
      onSaved()
      onClose()
    } catch (error) {
      console.error(error)
      showToast(error.message || 'Não foi possível salvar.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} title={current?.id ? 'Editar lançamento' : 'Novo lançamento'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label">Tipo</label>
          <select className="input" value={form.type} onChange={(e) => update('type', e.target.value)}>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </div>
        <div>
          <label className="label">Categoria</label>
          <input className="input" value={form.category} onChange={(e) => update('category', e.target.value)} required />
        </div>
        <div className="md:col-span-2">
          <label className="label">Descrição</label>
          <input className="input" value={form.description} onChange={(e) => update('description', e.target.value)} required />
        </div>
        <div>
          <label className="label">Valor</label>
          <input className="input" type="number" min="0" step="0.01" value={form.amount} onChange={(e) => update('amount', e.target.value)} required />
        </div>
        <div>
          <label className="label">Data</label>
          <input className="input" type="date" value={form.entry_date} onChange={(e) => update('entry_date', e.target.value)} required />
        </div>
        <div className="md:col-span-2">
          <label className="label">Observações</label>
          <textarea className="input min-h-32" value={form.notes} onChange={(e) => update('notes', e.target.value)} />
        </div>
        <div className="md:col-span-2 flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar lançamento'}</button>
        </div>
      </form>
    </Modal>
  )
}
