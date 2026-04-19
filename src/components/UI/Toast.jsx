import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ message, type, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const isSuccess = type === 'success';
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
        isSuccess ? 'bg-green-500' : 'bg-red-500'
      } text-white`}>
        {isSuccess ? <CheckCircle size={20} /> : <XCircle size={20} />}
        <span className="font-medium">{message}</span>
        <button onClick={() => setVisible(false)} className="ml-2 hover:opacity-80">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
