import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import Modal from '../components/UI/Modal';
import Toast from '../components/UI/Toast';
import Button from '../components/UI/Button';
import { Plus, Edit, Trash, Search } from 'lucide-react';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', monthly_amount: '', notes: '' });

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase.from('es_students').select('*').order('created_at', { ascending: false });
    if (data) setStudents(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        const { error } = await supabase.from('es_students').update(formData).eq('id', editingStudent.id);
        if (error) throw error;
        setToast({ message: 'Aluno atualizado com sucesso!', type: 'success' });
      } else {
        const { error } = await supabase.from('es_students').insert([formData]);
        if (error) throw error;
        setToast({ message: 'Aluno cadastrado com sucesso!', type: 'success' });
      }
      setModalOpen(false);
      setEditingStudent(null);
      setFormData({ name: '', phone: '', email: '', monthly_amount: '', notes: '' });
      fetchStudents();
    } catch (error) { setToast({ message: error.message, type: 'error' }); }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({ name: student.name, phone: student.phone, email: student.email, monthly_amount: student.monthly_amount, notes: student.notes });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este aluno?')) return;
    const { error } = await supabase.from('es_students').delete().eq('id', id);
    if (error) setToast({ message: 'Erro ao excluir aluno', type: 'error' });
    else { setToast({ message: 'Aluno excluído com sucesso!', type: 'success' }); fetchStudents(); }
  };

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Alunos</h2>
        <Button onClick={() => { setEditingStudent(null); setFormData({ name: '', phone: '', email: '', monthly_amount: '', notes: '' }); setModalOpen(true); }}>
          <Plus size={16} /> Novo Aluno
        </Button>
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Buscar por nome ou email..." className="input pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100"><tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nome</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Telefone</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Mensalidade</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ações</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? <tr><td colSpan="5" className="text-center py-8">Carregando...</td></tr>
              : filteredStudents.length === 0 ? <tr><td colSpan="5" className="text-center py-8 text-gray-400">Nenhum aluno encontrado</td></tr>
              : filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{student.name}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{student.phone || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{student.email || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">R$ {parseFloat(student.monthly_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(student)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(student.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"><Trash size={16} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingStudent ? 'Editar Aluno' : 'Novo Aluno'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label><input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="input" placeholder="(00) 00000-0000" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Valor da Mensalidade *</label><input type="number" step="0.01" value={formData.monthly_amount} onChange={(e) => setFormData({...formData, monthly_amount: e.target.value})} className="input" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Observações</label><textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="input" rows="3" /></div>
          <div className="flex gap-3 pt-2"><Button type="submit" className="flex-1">{editingStudent ? 'Atualizar' : 'Cadastrar'}</Button><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button></div>
        </form>
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
