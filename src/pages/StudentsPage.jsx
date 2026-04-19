import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/PageHeader'
import StudentForm from '../components/StudentForm'
import ConfirmDialog from '../components/ConfirmDialog'
import { currency, formatDate, statusBadgeClass } from '../lib/utils'
import { useToast } from '../contexts/ToastContext'

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [openForm, setOpenForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [removeId, setRemoveId] = useState(null)
  const { showToast } = useToast()

  const loadStudents = async () => {
    const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false })
    if (!error) setStudents(data || [])
  }

  useEffect(() => { loadStudents() }, [])

  const handleDelete = async () => {
    const { error } = await supabase.from('students').delete().eq('id', removeId)
    if (error) return showToast(error.message, 'error')
    showToast('Aluno excluído com sucesso.')
    setRemoveId(null)
    loadStudents()
  }

  return (
    <>
      <PageHeader
        title="Alunos"
        subtitle="Gerencie matrículas, mensalidades e status da sua base de alunos."
        action={<button className="btn-primary" onClick={() => { setSelected(null); setOpenForm(true) }}><Plus size={18} /> Novo aluno</button>}
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                {['Nome', 'Telefone', 'E-mail', 'Matrícula', 'Mensalidade', 'Vencimento', 'Status', 'Ações'].map((head) => (
                  <th key={head} className="px-5 py-4 font-semibold">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t border-slate-100 text-sm text-slate-700">
                  <td className="px-5 py-4 font-semibold">{student.name}</td>
                  <td className="px-5 py-4">{student.phone || '-'}</td>
                  <td className="px-5 py-4">{student.email || '-'}</td>
                  <td className="px-5 py-4">{formatDate(student.enrollment_date)}</td>
                  <td className="px-5 py-4">{currency(student.monthly_fee)}</td>
                  <td className="px-5 py-4">Dia {student.due_day}</td>
                  <td className="px-5 py-4"><span className={`badge ${statusBadgeClass(student.status)}`}>{student.status}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="btn-secondary p-3" onClick={() => { setSelected(student); setOpenForm(true) }}><Pencil size={16} /></button>
                      <button className="btn-secondary p-3" onClick={() => setRemoveId(student.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!students.length && (
                <tr><td colSpan="8" className="px-5 py-12 text-center text-slate-500">Nenhum aluno cadastrado ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StudentForm key={selected?.id || 'new'} open={openForm} onClose={() => setOpenForm(false)} current={selected} onSaved={loadStudents} />
      <ConfirmDialog open={!!removeId} message="Tem certeza que deseja excluir este aluno?" onCancel={() => setRemoveId(null)} onConfirm={handleDelete} />
    </>
  )
}
