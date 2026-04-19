import { useState, useEffect } from 'react';
import { supabase, formatCurrency } from '../services/supabase';
import Modal from '../components/UI/Modal';
import Toast from '../components/UI/Toast';
import Button from '../components/UI/Button';
import { getStatusInfo } from '../utils/helpers';
import { Plus, Edit, Trash, Search } from 'lucide-react';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ student_id: '', amount: '', due_date: '', status: 'pending', payment_date: '', notes: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [paymentsRes, studentsRes] = await Promise.all([
        supabase.from('es_payments').select('*, es_students(name)').order('due_date', { ascending: false }),
        supabase.from('es_students').select('*')
      ]);
      if (paymentsRes.data) setPayments(paymentsRes.data);
      if (studentsRes.data) setStudents(studentsRes.data);
    } catch (error) { console.error('Erro ao carregar mensalidades:', error); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { student_id: formData.student_id, amount: parseFloat(formData.amount), due_date: formData.due_date, status: formData.status, payment_date: formData.status === 'paid' ? (formData.payment_date || new Date().toISOString().split('T')[0]) : null, notes: formData.notes };
      if (editingPayment) { const { error } = await supabase.from('es_payments').update(data).eq('id', editingPayment.id); if (error) throw error; setToast({ message: 'Mensalidade atualizada!', type: 'success' }); }
      else { const { error } = await supabase.from('es_payments').insert([data]); if (error) throw error; setToast({ message: 'Mensalidade cadastrada!', type: 'success' }); }
      setModalOpen(false); setEditingPayment(null); fetchData();
    } catch (error) { setToast({ message: error.message, type: 'error' }); }
  };

  const handleEdit = (payment) => { setEditingPayment(payment); setFormData({ student_id: payment.student_id, amount: payment.amount, due_date: payment.due_date, status: payment.status, payment_date: payment.payment_date || '', notes: payment.notes || '' }); setModalOpen(true); };
  const handleDelete = async (id) => { if (!confirm('Tem certeza que deseja excluir esta mensalidade?')) return; const { error } = await supabase.from('es_payments').delete().eq('id', id); if (error) setToast({ message: 'Erro ao excluir', type: 'error' }); else { setToast({ message: 'Mensalidade excluída!', type: 'success' }); fetchData(); } };
  const markAsPaid = async (id) => { const { error } = await supabase.from('es_payments').update({ status: 'paid', payment_date: new Date().toISOString().split('T')[0] }).eq('id', id); if (error) setToast({ message: 'Erro ao marcar como pago', type: 'error' }); else { setToast({ message: 'Mensalidade marcada como paga!', type: 'success' }); fetchData(); } };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.es_students?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesMonth = filterMonth === 'all' || p.due_date?.substring(0, 7) === filterMonth;
    return matchesSearch && matchesStatus && matchesMonth;
  });
  const months = [...new Set(payments.map(p => p.due_date?.substring(0, 7)))].sort().reverse();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Mensalidades</h2>
        <Button onClick={() => { setEditingPayment(null); setFormData({ student_id: '', amount: '', due_date: '', status: 'pending', payment_date: '', notes: '' }); setModalOpen(true); }}><Plus size={16} /> Nova Mensalidade</Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="Buscar por aluno..." className="input pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        <select className="input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option value="all">Todos os Status</option><option value="pending">Pendente</option><option value="paid">Pago</option><option value="late">Atrasado</option></select>
        <select className="input" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}><option value="all">Todos os Meses</option>{months.map(m => <option key={m} value={m}>{m}</option>)}</select>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"><div className="overflow-x-auto"><table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100"><tr>
          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aluno</th>
          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Valor</th>
          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Vencimento</th>
          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Status</th>
          <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ações</th>
        </tr></thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? <tr><td colSpan="5" className="text-center py-8">Carregando...</td></tr>
          : filteredPayments.length === 0 ? <tr><td colSpan="5" className="text-center py-8 text-gray-400">Nenhuma mensalidade encontrada</td></tr>
          : filteredPayments.map(payment => { const statusInfo = getStatusInfo(payment); return (
            <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-800">{payment.es_students?.name || '-'}</td>
              <td className="px-4 py-3 text-gray-600">R$ {parseFloat(payment.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{new Date(payment.due_date).toLocaleDateString('pt-BR')}</td>
              <td className="px-4 py-3 hidden md:table-cell"><span className={`badge ${statusInfo.color}`}>{statusInfo.label}</span></td>
              <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-2">
                {payment.status !== 'paid' && <button onClick={() => markAsPaid(payment.id)} className="p-1.5 hover:bg-green-50 rounded-lg text-green-600" title="Marcar como pago"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></button>}
                <button onClick={() => handleEdit(payment)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit size={16} /></button>
                <button onClick={() => handleDelete(payment.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"><Trash size={16} /></button>
              </div></td>
            </tr>); })}
        </tbody>
      </table></div></div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingPayment ? 'Editar Mensalidade' : 'Nova Mensalidade'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Aluno *</label><select value={formData.student_id} onChange={(e) => setFormData({...formData, student_id: e.target.value})} className="input" required><option value="">Selecione um aluno</option>{students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Valor *</label><input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="input" required /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Vencimento *</label><input type="date" value={formData.due_date} onChange={(e) => setFormData({...formData, due_date: e.target.value})} className="input" required /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="input"><option value="pending">Pendente</option><option value="paid">Pago</option><option value="late">Atrasado</option></select></div>
          {formData.status === 'paid' && <div><label className="block text-sm font-medium text-gray-700 mb-1">Data de Pagamento</label><input type="date" value={formData.payment_date} onChange={(e) => setFormData({...formData, payment_date: e.target.value})} className="input" /></div>}
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Observações</label><textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="input" rows="3" /></div>
          <div className="flex gap-3 pt-2"><Button type="submit" className="flex-1">{editingPayment ? 'Atualizar' : 'Cadastrar'}</Button><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button></div>
        </form>
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
