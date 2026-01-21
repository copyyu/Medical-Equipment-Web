import { HiOutlineCalendarDays, HiOutlineBolt } from 'react-icons/hi2'

import StatCard from '../../components/Status/StatCard'
import AssetStatusSection from '../../components/AssetStatusSection'
import JobStatusSection from '../../components/JobStatusSection'

export default function HomePage() {
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-['Outfit']">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">ภาพรวมระบบจัดการอุปกรณ์การแพทย์</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
            <HiOutlineCalendarDays className="w-4 h-4" />
            มกราคม 2026
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-primary text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-accent-500/25 transition-all">
            <HiOutlineBolt className="w-4 h-4" />
            ดาวน์โหลดรายงาน
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatCard />

      {/* Asset Status & Job Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssetStatusSection />
        <JobStatusSection />
      </div>
    </div>
  )
}