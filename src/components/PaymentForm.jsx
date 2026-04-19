import { useState } from 'react'
import Modal from './Modal'
import { supabase } from '../lib/supabase'
import { todayIso } from '../lib/utils'
import { useToast } from '../contexts/ToastContext'

const emptyForm = {
  student_id: '',
  competence: '',
  amount: '',
  due_date: todayIso(),
  payment_date: '',
  status: 'pendente',
  payment_method: '',
  notes: '',
}

export default function PaymentForm({ open, onClose, current, students, onSaved }) {
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
        student_id: form.student_id,
        competence: form.competence.trim(),
        amount: Number(form.amount || 0),
        due_date: form.due_date,
        payment_date: form.payment_date || null,
        status: form.status,
        payment_method: form.payment_method || null,
        notes: form.notes || null,
      }

      const query = current?.id
        ? supabase.from('payments').update(payload).eq('id', current.id)
        : supabase.from('payments').insert([payload])

      const { error } = await query
      if (error) throw error

      showToast(current?.id ? 'Mensalidade atualizada com sucesso.' : 'Mensalidade salva com sucesso.')
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
    <Modal open={open} title={current?.id ? 'Editar mensalidade' : 'Nova mensalidade'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label">Aluno</label>
          <select className="input" value={form.student_id} onChange={(e) => update('student_id', e.target.value)} required>
            <option value="">Selecione</option>
            {students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Competência</label>
          <input className="input" value={form.competence} onChange={(e) => update('competence', e.target.value)} placeholder="Ex: abril/2026" required />
        </div>
        <div>
          <label className="label">Valor</label>
          <input className="input" type="number" min="0" step="0.01" value={form.amount} onChange={(e) => update('amount', e.target.value)} required />
        </div>
        <div>
          <label className="label">Vencimento</label>
          <input className="input" type="date" value={form.due_date} onChange={(e) => update('due_date', e.target.value)} required />
        </div>
        <div>
          <label className="label">Data de pagamento</label>
          <input className="input" type="date" value={form.payment_date} onChange={(e) => update('payment_date', e.target.value)} />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={(e) => update('status', e.target.value)}>
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
            <option value="atrasado">Atrasado</option>
          </select>
        </div>
        <div>
          <label className="label">Forma de pagamento</label>
          <input className="input" value={form.payment_method} onChange={(e) => update('payment_method', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Observações</label>
          <textarea className="input min-h-32" value={form.notes} onChange={(e) => update('notes', e.target.value)} />
        </div>
        <div className="md:col-span-2 flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar mensalidade'}</button>
        </div>
      </form>
    </Modal>
  )
}
