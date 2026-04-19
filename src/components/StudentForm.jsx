import { useState } from 'react'
import Modal from './Modal'
import { supabase } from '../lib/supabase'
import { todayIso } from '../lib/utils'
import { useToast } from '../contexts/ToastContext'

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  enrollment_date: todayIso(),
  monthly_fee: '',
  due_day: '10',
  status: 'ativo',
  notes: '',
}

export default function StudentForm({ open, onClose, current, onSaved }) {
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
        name: form.name.trim(),
        phone: form.phone || null,
        email: form.email || null,
        enrollment_date: form.enrollment_date,
        monthly_fee: Number(form.monthly_fee || 0),
        due_day: Number(form.due_day || 1),
        status: form.status,
        notes: form.notes || null,
      }

      const query = current?.id
        ? supabase.from('students').update(payload).eq('id', current.id)
        : supabase.from('students').insert([payload])

      const { error } = await query
      if (error) throw error

      showToast(current?.id ? 'Aluno atualizado com sucesso.' : 'Aluno salvo com sucesso.')
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
    <Modal open={open} title={current?.id ? 'Editar aluno' : 'Novo aluno'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label">Nome do aluno</label>
          <input className="input" value={form.name} onChange={(e) => update('name', e.target.value)} required />
        </div>
        <div>
          <label className="label">Telefone</label>
          <input className="input" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </div>
        <div>
          <label className="label">E-mail</label>
          <input className="input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
        </div>
        <div>
          <label className="label">Data de matrícula</label>
          <input className="input" type="date" value={form.enrollment_date} onChange={(e) => update('enrollment_date', e.target.value)} />
        </div>
        <div>
          <label className="label">Valor da mensalidade</label>
          <input className="input" type="number" min="0" step="0.01" value={form.monthly_fee} onChange={(e) => update('monthly_fee', e.target.value)} required />
        </div>
        <div>
          <label className="label">Dia do vencimento</label>
          <input className="input" type="number" min="1" max="31" value={form.due_day} onChange={(e) => update('due_day', e.target.value)} required />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={(e) => update('status', e.target.value)}>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="label">Observações</label>
          <textarea className="input min-h-32" value={form.notes} onChange={(e) => update('notes', e.target.value)} />
        </div>
        <div className="md:col-span-2 flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar aluno'}</button>
        </div>
      </form>
    </Modal>
  )
}
