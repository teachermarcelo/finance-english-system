import { useState } from 'react'
import Modal from './Modal'
import { supabase } from '../lib/supabase'
import { useToast } from '../contexts/ToastContext'

const emptyForm = {
  title: '',
  url: '',
  description: '',
}

export default function LinkForm({ open, onClose, current, onSaved }) {
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
        title: form.title.trim(),
        url: form.url.trim(),
        description: form.description || null,
      }

      const query = current?.id
        ? supabase.from('useful_links').update(payload).eq('id', current.id)
        : supabase.from('useful_links').insert([payload])

      const { error } = await query
      if (error) throw error

      showToast(current?.id ? 'Link atualizado com sucesso.' : 'Link salvo com sucesso.')
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
    <Modal open={open} title={current?.id ? 'Editar link' : 'Novo link'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div>
          <label className="label">Título</label>
          <input className="input" value={form.title} onChange={(e) => update('title', e.target.value)} required />
        </div>
        <div>
          <label className="label">URL</label>
          <input className="input" type="url" value={form.url} onChange={(e) => update('url', e.target.value)} required />
        </div>
        <div>
          <label className="label">Descrição</label>
          <textarea className="input min-h-32" value={form.description} onChange={(e) => update('description', e.target.value)} />
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar link'}</button>
        </div>
      </form>
    </Modal>
  )
}
