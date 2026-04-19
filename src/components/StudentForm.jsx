import { useEffect, useState } from 'react'
import { FormField, inputClassName } from './FormField'

const initialState = {
  name: '',
  phone: '',
  email: '',
  enrollment_date: new Date().toISOString().slice(0, 10),
  monthly_fee: '',
  due_day: 5,
  status: 'ativo',
  notes: '',
}

export default function StudentForm({ initialValues, onSubmit, submitting }) {
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
      monthly_fee: Number(form.monthly_fee || 0),
      due_day: Number(form.due_day || 1),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <FormField label="Nome do aluno">
        <input className={inputClassName()} name="name" value={form.name} onChange={handleChange} required />
      </FormField>
      <FormField label="Telefone">
        <input className={inputClassName()} name="phone" value={form.phone} onChange={handleChange} />
      </FormField>
      <FormField label="E-mail">
        <input className={inputClassName()} type="email" name="email" value={form.email} onChange={handleChange} />
      </FormField>
      <FormField label="Data de matrícula">
        <input className={inputClassName()} type="date" name="enrollment_date" value={form.enrollment_date} onChange={handleChange} />
      </FormField>
      <FormField label="Valor da mensalidade">
        <input className={inputClassName()} type="number" min="0" step="0.01" name="monthly_fee" value={form.monthly_fee} onChange={handleChange} required />
      </FormField>
      <FormField label="Dia do vencimento">
        <input className={inputClassName()} type="number" min="1" max="31" name="due_day" value={form.due_day} onChange={handleChange} required />
      </FormField>
      <FormField label="Status">
        <select className={inputClassName()} name="status" value={form.status} onChange={handleChange}>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </FormField>
      <div className="sm:col-span-2">
        <FormField label="Observações">
          <textarea className={inputClassName()} rows="4" name="notes" value={form.notes} onChange={handleChange} />
        </FormField>
      </div>
      <div className="sm:col-span-2 flex justify-end">
        <button type="submit" disabled={submitting} className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60">
          {submitting ? 'Salvando...' : 'Salvar aluno'}
        </button>
      </div>
    </form>
  )
}
