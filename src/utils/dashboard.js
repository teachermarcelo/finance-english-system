import { monthKeyFromDate } from './formatters'

export function calculateDashboardMetrics(payments, financeEntries, students, monthFilter) {
  const monthPayments = payments.filter(
    (payment) => !monthFilter || monthKeyFromDate(payment.due_date) === monthFilter,
  )

  const monthEntries = financeEntries.filter(
    (entry) => !monthFilter || monthKeyFromDate(entry.entry_date) === monthFilter,
  )

  const totalReceived = monthPayments
    .filter((item) => item.status === 'pago')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)

  const totalPending = monthPayments
    .filter((item) => item.status !== 'pago')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)

  const totalExpenses = monthEntries
    .filter((item) => item.type === 'saida')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)

  const otherIncome = monthEntries
    .filter((item) => item.type === 'entrada')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)

  return {
    totalReceived,
    totalPending,
    totalExpenses,
    activeStudents: students.filter((student) => student.status === 'ativo').length,
    netProfit: totalReceived + otherIncome - totalExpenses,
    otherIncome,
  }
}

export function getMonthlyOverview(payments, financeEntries) {
  const map = new Map()

  const ensureMonth = (month) => {
    if (!map.has(month)) {
      map.set(month, {
        month,
        recebido: 0,
        pendente: 0,
        entradas: 0,
        saidas: 0,
      })
    }
    return map.get(month)
  }

  payments.forEach((payment) => {
    const month = monthKeyFromDate(payment.due_date)
    const item = ensureMonth(month)
    if (payment.status === 'pago') item.recebido += Number(payment.amount || 0)
    else item.pendente += Number(payment.amount || 0)
  })

  financeEntries.forEach((entry) => {
    const month = monthKeyFromDate(entry.entry_date)
    const item = ensureMonth(month)
    if (entry.type === 'entrada') item.entradas += Number(entry.amount || 0)
    else item.saidas += Number(entry.amount || 0)
  })

  return [...map.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6)
    .map((item) => ({
      ...item,
      label: item.month ? `${item.month.slice(5, 7)}/${item.month.slice(0, 4)}` : 'Sem data',
    }))
}

export function getStatusChart(payments, monthFilter) {
  const monthPayments = payments.filter(
    (payment) => !monthFilter || monthKeyFromDate(payment.due_date) === monthFilter,
  )

  const count = { pago: 0, pendente: 0, atrasado: 0 }
  monthPayments.forEach((payment) => {
    count[payment.status] = (count[payment.status] || 0) + 1
  })

  return [
    { name: 'Pago', value: count.pago },
    { name: 'Pendente', value: count.pendente },
    { name: 'Atrasado', value: count.atrasado },
  ]
}
