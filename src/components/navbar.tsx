import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        {/* Logo / Title */}
        <div className="text-lg font-semibold">
          Medical Equipment
        </div>

        {/* Menu */}
        <div className="flex gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'font-medium underline'
                : 'hover:underline'
            }
          >
            Sign Up
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? 'font-medium underline'
                : 'hover:underline'
            }
          >
            Sign In
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
