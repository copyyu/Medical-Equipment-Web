import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineClipboardDocumentList,
  HiOutlineChatBubbleLeftRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight
} from 'react-icons/hi2'

const menuItems = [
  { path: '/home', icon: HiOutlineHome, label: 'Dashboard' },
  { path: '/equipment', icon: HiOutlineClipboardDocumentList, label: 'รายการอุปกรณ์' },
  { path: '/add-equipment', icon: HiOutlineCube, label: 'เพิ่มอุปกรณ์การแพทย์' },
  //{ path: '/rent', icon: HiOutlineUsers, label: 'เช่ายืม' },
  { path: '/ticket', icon: HiOutlineChatBubbleLeftRight, label: 'Ticket' },
  // { path: '/reports', icon: HiOutlineChartBar, label: 'รายงาน' },
  // { path: '/settings', icon: HiOutlineCog6Tooth, label: 'ตั้งค่า' },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={`relative min-h-[calc(100vh-4rem)] bg-white border-r border-gray-100 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--gray-400) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      ></div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all z-10"
      >
        {isCollapsed ? (
          <HiOutlineChevronRight className="w-3.5 h-3.5" />
        ) : (
          <HiOutlineChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Section Label */}
      <div className={`px-4 py-4 ${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          เมนูหลัก
        </p>
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
                ${isCollapsed ? 'justify-center' : ''}`
              }
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {({ isActive }) => (
                <>
                  {/* Active Background */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-primary rounded-xl shadow-md">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl"></div>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`relative z-10 transition-transform duration-200 ${!isActive && 'group-hover:scale-110'}`}>
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                  </div>

                  {/* Label */}
                  {!isCollapsed && (
                    <span className="relative z-10 whitespace-nowrap">{item.label}</span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-lg z-50">
                      {item.label}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>


    </aside>
  )
}
