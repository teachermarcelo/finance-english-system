import { useEffect, useState } from 'react'
import { FormField, inputClassName } from './FormField'

const initialState = {
  student_id: '',
  competence: '',
  amount: '',
  due_date: new Date().toISOString().slice(0, 10),
  payment_date: '',
  status: 'pendente',
  payment_method: '',
  notes: '',
}

export default function PaymentForm({ initialValues, students, onSubmit, submitting }) {
  const [form, setForm] = useState(initialState)

  useEffect(() => {
    if (initialValues) {
      setForm({ ...initialState, ...initialValues })
    } else {
      setForm(initialState)
    }
  }, [initialValues])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit({
      ...form,
      amount: Number(form.amount || 0),
      payment_date: form.payment_date || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <FormField label="Aluno">
        <select className={inputClassName()} name="student_id" value={form.student_id} onChange={handleChange} required>
          <option value="">Selecione um aluno</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Competência">
        <input className={inputClassName()} name="competence" value={form.competence} onChange={handleChange} placeholder="Ex: Abril/2026" required />
      </FormField>
      <FormField label="Valor">
        <input className={inputClassName()} type="number" min="0" step="0.01" name="amount" value={form.amount} onChange={handleChange} required />
      </FormField>
      <FormField label="Vencimento">
        <input className={inputClassName()} type="date" name="due_date" value={form.due_date} onChange={handleChange} required />
      </FormField>
      <FormField label="Data do pagamento">
        <input className={inputClassName()} type="date" name="payment_date" value={form.payment_date || ''} onChange={handleChange} />
      </FormField>
      <FormField label="Status">
        <select className={inputClassName()} name="status" value={form.status} onChange={handleChange}>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
          <option value="atrasado">Atrasado</option>
        </select>
      </FormField>
      <FormField label="Forma de pagamento">
        <input className={inputClassName()} name="payment_method" value={form.payment_method} onChange={handleChange} placeholder="Pix, dinheiro, cartão..." />
      </FormField>
      <div className="sm:col-span-2">
        <FormField label="Observações">
          <textarea className={inputClassName()} rows="4" name="notes" value={form.notes} onChange={handleChange} />
        </FormField>
      </div>
      <div className="sm:col-span-2 flex justify-end">
        <button type="submit" disabled={submitting} className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60">
          {submitting ? 'Salvando...' : 'Salvar mensalidade'}
        </button>
      </div>
    </form>
  )
}
