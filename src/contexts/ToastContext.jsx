import { createContext, useContext, useMemo, useState } from 'react'
import { CircleAlert, CircleCheck, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])

  const showToast = (message, type = 'success') => {
    const id = crypto.randomUUID()
    setItems((prev) => [...prev, { id, message, type }])
    window.setTimeout(() => removeToast(id), 3500)
  }

  const removeToast = (id) => setItems((prev) => prev.filter((item) => item.id !== id))

  const value = useMemo(() => ({ showToast }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[min(92vw,360px)] flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="card flex items-start gap-3 rounded-2xl p-4">
            {item.type === 'success' ? (
              <CircleCheck className="mt-0.5 text-emerald-600" size={20} />
            ) : (
              <CircleAlert className="mt-0.5 text-rose-600" size={20} />
            )}
            <p className="flex-1 text-sm font-medium text-slate-700">{item.message}</p>
            <button onClick={() => removeToast(item.id)} className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
