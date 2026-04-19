import Modal from './Modal'

export default function ConfirmDialog({ open, title = 'Confirmar exclusão', message, onCancel, onConfirm }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="mb-6 text-slate-600">{message}</p>
      <div className="flex justify-end gap-3">
        <button className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button className="btn-primary bg-gradient-to-r from-rose-600 to-rose-500" onClick={onConfirm}>Excluir</button>
      </div>
    </Modal>
  )
}
