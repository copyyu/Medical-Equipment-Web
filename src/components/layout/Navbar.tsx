import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
  HiOutlineChevronDown
} from 'react-icons/hi2'
import { useAuthStore } from '../../stores/authStore'

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-primary"></div>

      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-primary rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm font-['Outfit']">ME</span>
            </div>
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900 font-['Outfit']">
              Medical Equipment
            </h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>


        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen)
                setIsProfileOpen(false)
              }}
              className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
            >
              <HiOutlineBell className="w-5 h-5" />
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-scale-in z-50">
                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">การแจ้งเตือน</h3>
                </div>
                <div className="py-8 text-center">
                  <HiOutlineBell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">ไม่มีการแจ้งเตือนใหม่</p>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200"></div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen)
                setIsNotificationOpen(false)
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all group"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <HiOutlineUser className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-700">{user?.username || 'Admin'}</p>
                <p className="text-xs text-gray-500">ผู้ดูแลระบบ</p>
              </div>
              <HiOutlineChevronDown className={`hidden lg:block w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-scale-in z-50">
                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{user?.full_name || user?.username || 'Admin'}</p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                    ออกจากระบบ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
