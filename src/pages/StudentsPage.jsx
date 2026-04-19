import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import CardSection from '../components/CardSection'
import EmptyState from '../components/EmptyState'
import LoadingTable from '../components/LoadingTable'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import StudentForm from '../components/StudentForm'
import { useCrud } from '../hooks/useCrud'
import { formatCurrency, formatDate } from '../utils/formatters'

export default function StudentsPage() {
  const students = useCrud('students')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return students.data
    return students.data.filter((student) =>
      [student.name, student.phone, student.email].some((value) => value?.toLowerCase().includes(term)),
    )
  }, [students.data, search])

  const handleCreate = () => {
    setEditing(null)
    setOpen(true)
  }

  const handleEdit = (item) => {
    setEditing(item)
    setOpen(true)
  }

  const handleSubmit = async (values) => {
    setSubmitting(true)
    try {
      if (editing) {
        await students.updateRow(editing.id, values, 'Aluno atualizado com sucesso!')
      } else {
        await students.insertRow(values, 'Aluno cadastrado com sucesso!')
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
    if (!window.confirm('Deseja realmente remover este aluno?')) return
    try {
      await students.deleteRow(id, 'Aluno removido com sucesso!')
    } catch (error) {
      toast.error('Erro ao remover aluno.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cadastro de alunos"
        description="Adicione, edite e acompanhe todos os alunos da sua escola de inglês com histórico financeiro integrado."
        action={
          <button onClick={handleCreate} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-md transition hover:scale-[1.02]">
            <Plus className="h-4 w-4" /> Novo aluno
          </button>
        }
      />

      <CardSection
        title="Lista de alunos"
        subtitle="Use a busca para localizar rapidamente qualquer cadastro."
        actions={
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar aluno" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
          </div>
        }
      >
        {students.loading ? (
          <LoadingTable />
        ) : filteredStudents.length === 0 ? (
          <EmptyState title="Nenhum aluno encontrado" description="Cadastre um novo aluno para começar a controlar mensalidades." />
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-4">Aluno</th>
                    <th className="px-4 py-4">Contato</th>
                    <th className="px-4 py-4">Mensalidade</th>
                    <th className="px-4 py-4">Matrícula</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <p className="font-bold text-slate-900">{student.name}</p>
                        <p className="text-sm text-slate-500">Vence todo dia {student.due_day}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        <p>{student.phone || '-'}</p>
                        <p>{student.email || '-'}</p>
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-900">{formatCurrency(student.monthly_fee)}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{formatDate(student.enrollment_date)}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${student.status === 'ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(student)} className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(student.id)} className="rounded-2xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardSection>

      <Modal open={open} title={editing ? 'Editar aluno' : 'Novo aluno'} onClose={() => setOpen(false)}>
        <StudentForm initialValues={editing} onSubmit={handleSubmit} submitting={submitting} />
      </Modal>
    </div>
  )
}
