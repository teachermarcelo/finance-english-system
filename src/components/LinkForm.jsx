import { useEffect, useState } from 'react'
import { FormField, inputClassName } from './FormField'

const initialState = {
  title: '',
  url: '',
  description: '',
}

export default function LinkForm({ initialValues, onSubmit, submitting }) {
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
    await onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <FormField label="Título">
        <input className={inputClassName()} name="title" value={form.title} onChange={handleChange} required />
      </FormField>
      <FormField label="URL">
        <input className={inputClassName()} type="url" name="url" value={form.url} onChange={handleChange} required />
      </FormField>
      <FormField label="Descrição">
        <textarea className={inputClassName()} rows="4" name="description" value={form.description} onChange={handleChange} />
      </FormField>
      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60">
          {submitting ? 'Salvando...' : 'Salvar link'}
        </button>
      </div>
    </form>
  )
}
