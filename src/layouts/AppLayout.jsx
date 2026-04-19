import Sidebar from '../components/Sidebar'

export default function AppLayout({ children }) {
  return (
    <div className="mx-auto grid min-h-screen max-w-7xl gap-6 p-4 md:grid-cols-[260px_1fr] md:p-6">
      <Sidebar />
      <main>{children}</main>
    </div>
  )
}
