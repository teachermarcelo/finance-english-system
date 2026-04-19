import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import CardSection from '../components/CardSection'
import EmptyState from '../components/EmptyState'
import LinkForm from '../components/LinkForm'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import { useCrud } from '../hooks/useCrud'

export default function LinksPage() {
  const links = useCrud('useful_links')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (values) => {
    setSubmitting(true)
    try {
      if (editing) {
        await links.updateRow(editing.id, values, 'Link atualizado com sucesso!')
      } else {
        await links.insertRow(values, 'Link salvo com sucesso!')
      }
      setOpen(false)
      setEditing(null)
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este link?')) return
    try {
      await links.deleteRow(id, 'Link removido com sucesso!')
    } catch (error) {
      toast.error('Erro ao remover link.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Links e observações extras"
        description="Guarde links úteis, materiais, grupos, páginas de cobrança e anotações importantes em um só lugar."
        action={
          <button onClick={() => { setEditing(null); setOpen(true) }} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-md transition hover:scale-[1.02]">
            <Plus className="h-4 w-4" /> Novo link
          </button>
        }
      />

      <CardSection title="Links salvos" subtitle="Use esta área para campos extras personalizáveis e referências rápidas.">
        {links.loading ? (
          <p className="text-sm text-slate-500">Carregando links...</p>
        ) : links.data.length === 0 ? (
          <EmptyState title="Nenhum link salvo" description="Adicione grupos, materiais, cobranças ou observações com URL." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {links.data.map((link) => (
              <div key={link.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{link.title}</h3>
                    <p className="mt-2 text-sm text-slate-500">{link.description || 'Sem descrição adicional.'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(link); setOpen(true) }} className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(link.id)} className="rounded-2xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <a href={link.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100">
                  <ExternalLink className="h-4 w-4" /> Abrir link
                </a>
              </div>
            ))}
          </div>
        )}
      </CardSection>

      <Modal open={open} title={editing ? 'Editar link' : 'Novo link'} onClose={() => setOpen(false)}>
        <LinkForm initialValues={editing} onSubmit={handleSubmit} submitting={submitting} />
      </Modal>
    </div>
  )
}
