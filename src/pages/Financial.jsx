import { useState, useEffect } from 'react';
import { supabase, formatCurrency } from '../services/supabase';
import Modal from '../components/UI/Modal';
import Toast from '../components/UI/Toast';
import Button from '../components/UI/Button';
import { Plus, Edit, Trash, Search, TrendingUp, TrendingDown } from 'lucide-react';

export default function Financial() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ description: '', amount: '', type: 'income', date: new Date().toISOString().split('T')[0], category: '', notes: '' });

  useEffect(() => { fetchEntries(); }, []);
  const fetchEntries = async () => { const { data, error } = await supabase.from('es_financial_entries').select('*').order('date', { ascending: false }); if (data) setEntries(data); setLoading(false); };
  const handleSubmit = async (e) => { e.preventDefault(); try { const data = { description: formData.description, amount: parseFloat(formData.amount), type: formData.type, date: formData.date, category: formData.category, notes: formData.notes }; if (editingEntry) { const { error } = await supabase.from('es_financial_entries').update(data).eq('id', editingEntry.id); if (error) throw error; setToast({ message: 'Registro atualizado!', type: 'success' }); } else { const { error } = await supabase.from('es_financial_entries').insert([data]); if (error) throw error; setToast({ message: 'Registro adicionado!', type: 'success' }); } setModalOpen(false); setEditingEntry(null); fetchEntries(); } catch (error) { setToast({ message: error.message, type: 'error' }); } };
  const handleEdit = (entry) => { setEditingEntry(entry); setFormData({ description: entry.description, amount: entry.amount, type: entry.type, date: entry.date, category: entry.category || '', notes: entry.notes || '' }); setModalOpen(true); };
  const handleDelete = async (id) => { if (!confirm('Tem certeza que deseja excluir este registro?')) return; const { error } = await supabase.from('es_financial_entries').delete().eq('id', id); if (error) setToast({ message: 'Erro ao excluir', type: 'error' }); else { setToast({ message: 'Registro excluído!', type: 'success' }); fetchEntries(); } };
  const filteredEntries = entries.filter(e => e.description?.toLowerCase().includes(searchTerm.toLowerCase()) && (filterType === 'all' || e.type === filterType));
  const totalIncome = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const totalExpenses = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card flex items-center gap-4"><div className="p-3 bg-green-50 rounded-xl text-green-600"><TrendingUp size={24} /></div><div><p className="text-sm text-gray-500">Total Entradas</p><p className="text-xl font-bold text-green-600">{formatCurrency(totalIncome)}</p></div></div>
        <div className="card flex items-center gap-4"><div className="p-3 bg-red-50 rounded-xl text-red-600"><TrendingDown size={24} /></div><div><p className="text-sm text-gray-500">Total Saídas</p><p className="text-xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p></div></div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><h2 className="text-2xl font-bold text-gray-800">Entradas e Saídas</h2><Button onClick={() => { setEditingEntry(null); setFormData({ description: '', amount: '', type: 'income', date: new Date().toISOString().split('T')[0], category: '', notes: '' }); setModalOpen(true); }}><Plus size={16} /> Novo Registro</Button></div>
      <div className="flex flex-col sm:flex-row gap-4"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="Buscar por descrição..." className="input pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div><select className="input" value={filterType} onChange={(e) => setFilterType(e.target.value)}><option value="all">Todos os Tipos</option><option value="income">Entrada</option><option value="expense">Saída</option></select></div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b border-gray-100"><tr>
        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Descrição</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Categoria</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Data</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Valor</th><th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ações</th>
      </tr></thead><tbody className="divide-y divide-gray-100">
        {loading ? <tr><td colSpan="5" className="text-center py-8">Carregando...</td></tr>
        : filteredEntries.length === 0 ? <tr><td colSpan="5" className="text-center py-8 text-gray-400">Nenhum registro encontrado</td></tr>
        : filteredEntries.map(entry => (<tr key={entry.id} className="hover:bg-gray-50 transition-colors"><td className="px-4 py-3 font-medium text-gray-800">{entry.description}</td><td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{entry.category || '-'}</td><td className="px-4 py-3 text-gray-600 hidden md:table-cell">{new Date(entry.date).toLocaleDateString('pt-BR')}</td><td className="px-4 py-3 font-medium"><span className={entry.type === 'income' ? 'text-green-600' : 'text-red-600'}>{entry.type === 'income' ? '+' : '-'} {formatCurrency(entry.amount)}</span></td><td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => handleEdit(entry)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit size={16} /></button><button onClick={() => handleDelete(entry.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"><Trash size={16} /></button></div></td></tr>))}
      </tbody></table></div></div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingEntry ? 'Editar Registro' : 'Novo Registro'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label><input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input" required /></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Valor *</label><input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="input" required /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label><select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="input"><option value="income">Entrada</option><option value="expense">Saída</option></select></div></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Data *</label><input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="input" required /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label><input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="input" placeholder="Ex: Material, Aluguel..." /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Observações</label><textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="input" rows="3" /></div>
          <div className="flex gap-3 pt-2"><Button type="submit" className="flex-1">{editingEntry ? 'Atualizar' : 'Cadastrar'}</Button><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button></div>
        </form>
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
