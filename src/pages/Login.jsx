import { useState } from 'react';
import { supabase } from '../services/supabase';
import Toast from '../components/UI/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setToast({ message: 'Conta criada com sucesso! Faça login.', type: 'success' });
        setIsRegister(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setToast({ message: 'Login realizado com sucesso!', type: 'success' });
      }
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-slide-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🎓 Escola de Inglês</h1>
          <p className="text-gray-500 mt-2">Sistema de Gestão Financeira</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Carregando...' : isRegister ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>

        <button
          onClick={() => setIsRegister(!isRegister)}
          className="w-full mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {isRegister ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
        </button>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
