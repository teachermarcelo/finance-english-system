import { useEffect, useState } from 'react'
import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/PageHeader'
import LinkForm from '../components/LinkForm'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../contexts/ToastContext'

export default function LinksPage() {
  const [links, setLinks] = useState([])
  const [openForm, setOpenForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [removeId, setRemoveId] = useState(null)
  const { showToast } = useToast()

  const loadLinks = async () => {
    const { data } = await supabase.from('useful_links').select('*').order('created_at', { ascending: false })
    setLinks(data || [])
  }

  useEffect(() => { loadLinks() }, [])

  const handleDelete = async () => {
    const { error } = await supabase.from('useful_links').delete().eq('id', removeId)
    if (error) return showToast(error.message, 'error')
    showToast('Link excluído com sucesso.')
    setRemoveId(null)
    loadLinks()
  }

  return (
    <>
      <PageHeader
        title="Links úteis"
        subtitle="Guarde links de reuniões, materiais, pagamentos e páginas importantes."
        action={<button className="btn-primary" onClick={() => { setSelected(null); setOpenForm(true) }}><Plus size={18} /> Novo link</button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {links.map((item) => (
          <div className="card p-5" key={item.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.description || 'Sem descrição'}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary p-3" onClick={() => { setSelected(item); setOpenForm(true) }}><Pencil size={16} /></button>
                <button className="btn-secondary p-3" onClick={() => setRemoveId(item.id)}><Trash2 size={16} /></button>
              </div>
            </div>
            <a href={item.url} target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              Abrir link <ExternalLink size={16} />
            </a>
          </div>
        ))}
        {!links.length && <div className="card p-10 text-center text-slate-500">Nenhum link cadastrado ainda.</div>}
      </div>

      <LinkForm key={selected?.id || 'new'} open={openForm} onClose={() => setOpenForm(false)} current={selected} onSaved={loadLinks} />
      <ConfirmDialog open={!!removeId} message="Tem certeza que deseja excluir este link?" onCancel={() => setRemoveId(null)} onConfirm={handleDelete} />
    </>
  )
}
