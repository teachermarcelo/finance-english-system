import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import Modal from '../components/UI/Modal';
import Toast from '../components/UI/Toast';
import Button from '../components/UI/Button';
import { Plus, Edit, Trash, ExternalLink, Search } from 'lucide-react';

export default function Links() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ title: '', url: '', description: '', category: '' });

  useEffect(() => { fetchLinks(); }, []);
  const fetchLinks = async () => { const { data, error } = await supabase.from('es_useful_links').select('*').order('created_at', { ascending: false }); if (data) setLinks(data); setLoading(false); };
  const handleSubmit = async (e) => { e.preventDefault(); try { if (editingLink) { const { error } = await supabase.from('es_useful_links').update(formData).eq('id', editingLink.id); if (error) throw error; setToast({ message: 'Link atualizado!', type: 'success' }); } else { const { error } = await supabase.from('es_useful_links').insert([formData]); if (error) throw error; setToast({ message: 'Link adicionado!', type: 'success' }); } setModalOpen(false); setEditingLink(null); fetchLinks(); } catch (error) { setToast({ message: error.message, type: 'error' }); } };
  const handleEdit = (link) => { setEditingLink(link); setFormData({ title: link.title, url: link.url, description: link.description || '', category: link.category || '' }); setModalOpen(true); };
  const handleDelete = async (id) => { if (!confirm('Tem certeza que deseja excluir este link?')) return; const { error } = await supabase.from('es_useful_links').delete().eq('id', id); if (error) setToast({ message: 'Erro ao excluir', type: 'error' }); else { setToast({ message: 'Link excluído!', type: 'success' }); fetchLinks(); } };
  const filteredLinks = links.filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase()) || l.category?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><h2 className="text-2xl font-bold text-gray-800">Links Úteis</h2><Button onClick={() => { setEditingLink(null); setFormData({ title: '', url: '', description: '', category: '' }); setModalOpen(true); }}><Plus size={16} /> Novo Link</Button></div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="Buscar por título ou categoria..." className="input pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <div className="col-span-full text-center py-8">Carregando...</div>
        : filteredLinks.length === 0 ? <div className="col-span-full text-center py-8 text-gray-400">Nenhum link encontrado</div>
        : filteredLinks.map(link => (<div key={link.id} className="card hover:shadow-md transition-shadow"><div className="flex items-start justify-between mb-3"><h3 className="font-semibold text-gray-800 flex-1">{link.title}</h3><div className="flex gap-1"><button onClick={() => handleEdit(link)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit size={14} /></button><button onClick={() => handleDelete(link.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"><Trash size={14} /></button></div></div><a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mb-2"><ExternalLink size={14} /> Acessar</a>{link.category && <span className="badge bg-primary-50 text-primary-700">{link.category}</span>}{link.description && <p className="text-sm text-gray-500 mt-2">{link.description}</p>}</div>))}
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingLink ? 'Editar Link' : 'Novo Link'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Título *</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">URL *</label><input type="url" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} className="input" placeholder="https://..." required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label><input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="input" placeholder="Ex: Material Didático, Plataforma..." /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input" rows="3" /></div>
          <div className="flex gap-3 pt-2"><Button type="submit" className="flex-1">{editingLink ? 'Atualizar' : 'Cadastrar'}</Button><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button></div>
        </form>
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
