export default function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-600 p-6 text-white shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">{description}</p>
        </div>
        {action}
      </div>
    </div>
  )
}
