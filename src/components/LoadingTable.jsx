export default function LoadingTable() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
  )
}
