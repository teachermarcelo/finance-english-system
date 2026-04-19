export const currency = (value = 0) =>
  Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(`${date}T00:00:00`)
  return d.toLocaleDateString('pt-BR')
}

export const todayIso = () => new Date().toISOString().slice(0, 10)

export const monthKey = (date) => (date || '').slice(0, 7)

export const statusBadgeClass = (status) => {
  const map = {
    pago: 'bg-emerald-100 text-emerald-700',
    pendente: 'bg-amber-100 text-amber-700',
    atrasado: 'bg-rose-100 text-rose-700',
    ativo: 'bg-blue-100 text-blue-700',
    inativo: 'bg-slate-100 text-slate-700',
    entrada: 'bg-emerald-100 text-emerald-700',
    saida: 'bg-rose-100 text-rose-700',
  }
  return map[status] || 'bg-slate-100 text-slate-700'
}

export const paymentStatus = (status, dueDate, paymentDate) => {
  if (status === 'pago' || paymentDate) return 'pago'
  if (dueDate && dueDate < todayIso()) return 'atrasado'
  return 'pendente'
}
