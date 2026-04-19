import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/PageHeader'
import PaymentForm from '../components/PaymentForm'
import ConfirmDialog from '../components/ConfirmDialog'
import { currency, formatDate, statusBadgeClass } from '../lib/utils'
import { useToast } from '../contexts/ToastContext'

export default function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const [students, setStudents] = useState([])
  const [openForm, setOpenForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [removeId, setRemoveId] = useState(null)
  const [filters, setFilters] = useState({ month: '', status: '', student: '' })
  const { showToast } = useToast()

  const loadData = async () => {
    const [{ data: paymentRows }, { data: studentRows }] = await Promise.all([
      supabase.from('payments').select('*, students(name)').order('due_date', { ascending: false }),
      supabase.from('students').select('id, name').eq('status', 'ativo').order('name'),
    ])
    setPayments(paymentRows || [])
    setStudents(studentRows || [])
  }

  useEffect(() => { loadData() }, [])

  const filtered = payments.filter((item) => {
    const monthOk = !filters.month || item.due_date?.startsWith(filters.month)
    const statusOk = !filters.status || item.status === filters.status
    const studentOk = !filters.student || item.student_id === filters.student
    return monthOk && statusOk && studentOk
  })

  const handleDelete = async () => {
    const { error } = await supabase.from('payments').delete().eq('id', removeId)
    if (error) return showToast(error.message, 'error')
    showToast('Mensalidade excluída com sucesso.')
    setRemoveId(null)
    loadData()
  }

  return (
    <>
      <PageHeader
        title="Mensalidades"
        subtitle="Controle competências, pagamentos e pendências por aluno."
        action={<button className="btn-primary" onClick={() => { setSelected(null); setOpenForm(true) }}><Plus size={18} /> Nova mensalidade</button>}
      />

      <div className="card mb-6 grid gap-4 p-4 md:grid-cols-3">
        <input className="input" type="month" value={filters.month} onChange={(e) => setFilters((prev) => ({ ...prev, month: e.target.value }))} />
        <select className="input" value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}>
          <option value="">Todos os status</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
          <option value="atrasado">Atrasado</option>
        </select>
        <select className="input" value={filters.student} onChange={(e) => setFilters((prev) => ({ ...prev, student: e.target.value }))}>
          <option value="">Todos os alunos</option>
          {students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                {['Aluno', 'Competência', 'Valor', 'Vencimento', 'Pagamento', 'Status', 'Ações'].map((head) => (
                  <th key={head} className="px-5 py-4 font-semibold">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment) => (
                <tr key={payment.id} className="border-t border-slate-100 text-sm text-slate-700">
                  <td className="px-5 py-4 font-semibold">{payment.students?.name || '-'}</td>
                  <td className="px-5 py-4">{payment.competence}</td>
                  <td className="px-5 py-4">{currency(payment.amount)}</td>
                  <td className="px-5 py-4">{formatDate(payment.due_date)}</td>
                  <td className="px-5 py-4">{formatDate(payment.payment_date)}</td>
                  <td className="px-5 py-4"><span className={`badge ${statusBadgeClass(payment.status)}`}>{payment.status}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="btn-secondary p-3" onClick={() => { setSelected(payment); setOpenForm(true) }}><Pencil size={16} /></button>
                      <button className="btn-secondary p-3" onClick={() => setRemoveId(payment.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan="7" className="px-5 py-12 text-center text-slate-500">Nenhuma mensalidade encontrada.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <PaymentForm key={selected?.id || 'new'} open={openForm} onClose={() => setOpenForm(false)} current={selected} students={students} onSaved={loadData} />
      <ConfirmDialog open={!!removeId} message="Tem certeza que deseja excluir esta mensalidade?" onCancel={() => setRemoveId(null)} onConfirm={handleDelete} />
    </>
  )
}
