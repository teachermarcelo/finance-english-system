import { useEffect, useState } from 'react'
import { FormField, inputClassName } from './FormField'

const initialState = {
  type: 'entrada',
  category: '',
  description: '',
  amount: '',
  entry_date: new Date().toISOString().slice(0, 10),
  notes: '',
}

export default function FinanceEntryForm({ initialValues, onSubmit, submitting }) {
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
    await onSubmit({ ...form, amount: Number(form.amount || 0) })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <FormField label="Tipo">
        <select className={inputClassName()} name="type" value={form.type} onChange={handleChange}>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
      </FormField>
      <FormField label="Categoria">
        <input className={inputClassName()} name="category" value={form.category} onChange={handleChange} placeholder="Ex: Material, aluguel, bônus..." required />
      </FormField>
      <FormField label="Descrição">
        <input className={inputClassName()} name="description" value={form.description} onChange={handleChange} required />
      </FormField>
      <FormField label="Valor">
        <input className={inputClassName()} type="number" min="0" step="0.01" name="amount" value={form.amount} onChange={handleChange} required />
      </FormField>
      <FormField label="Data">
        <input className={inputClassName()} type="date" name="entry_date" value={form.entry_date} onChange={handleChange} required />
      </FormField>
      <div className="sm:col-span-2">
        <FormField label="Observações">
          <textarea className={inputClassName()} rows="4" name="notes" value={form.notes} onChange={handleChange} />
        </FormField>
      </div>
      <div className="sm:col-span-2 flex justify-end">
        <button type="submit" disabled={submitting} className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60">
          {submitting ? 'Salvando...' : 'Salvar lançamento'}
        </button>
      </div>
    </form>
  )
}
