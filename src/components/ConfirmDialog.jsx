export default function ConfirmDialog({ title, description, onConfirm, onCancel }) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4">
      <h4 className="text-base font-bold text-rose-800">{title}</h4>
      <p className="mt-2 text-sm text-rose-700">{description}</p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
        >
          Confirmar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-white"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
