import { X } from 'lucide-react'

export default function Modal({ open, title, onClose, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
      <div className="card w-full max-w-3xl p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="rounded-full border border-slate-200 p-3 text-slate-500 transition hover:bg-slate-50">
            <X size={22} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
