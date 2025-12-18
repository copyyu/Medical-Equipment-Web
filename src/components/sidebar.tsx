import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded
     ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`

  return (
    <div className="w-64 bg-gray-100 border-r min-h-screen">
      {/* Header */}
      <div className="h-16 flex items-center px-4 font-semibold text-lg border-b">
        Menu
      </div>

      {/* Menu */}
      <div className="p-4 space-y-2">
        <NavLink to="/" className={linkClass}>
          Home
        </NavLink>

        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

      </div>
    </div>
  )
}
