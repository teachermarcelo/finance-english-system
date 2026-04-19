import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const titles = {
    '/dashboard': 'Dashboard',
    '/students': 'Alunos',
    '/payments': 'Mensalidades',
    '/financial': 'Financeiro',
    '/links': 'Links Úteis',
  };

  const title = titles[window.location.pathname] || 'Dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
