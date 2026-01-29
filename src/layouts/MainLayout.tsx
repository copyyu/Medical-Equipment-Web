import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'


export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-50">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--gray-400) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      ></div>

      <Navbar />
      <div className="flex relative">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
