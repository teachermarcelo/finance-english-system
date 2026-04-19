export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="card mb-6 flex flex-col gap-4 bg-gradient-to-r from-indigo-600 to-violet-700 p-6 text-white md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-indigo-100">{subtitle}</p>
      </div>
      {action}
    </div>
  )
}
