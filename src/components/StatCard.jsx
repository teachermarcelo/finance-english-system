export default function StatCard({ title, value, icon: Icon, accent = 'from-blue-500 to-indigo-600' }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-2xl font-black tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`rounded-2xl bg-gradient-to-br ${accent} p-3 text-white shadow-lg`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
