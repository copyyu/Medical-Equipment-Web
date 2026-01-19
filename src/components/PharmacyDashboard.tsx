import { useEffect, useState } from 'react'
import {
  HiOutlineCube,
  HiOutlineClipboardDocumentList,
  HiOutlineCog6Tooth,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineCalendarDays,
  HiOutlineBolt,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineTag,
  HiOutlineQuestionMarkCircle,
  HiOutlineArrowPath,
  HiOutlineCheckBadge,
  HiOutlineArrowUpTray,
  HiOutlineWrenchScrewdriver,
  HiOutlineArrowsRightLeft,
  HiOutlineExclamationTriangle
} from 'react-icons/hi2'

import {
  ASSET_STATUS_CONFIG,
  JOB_STATUS_CONFIG,
  MOCK_ASSET_STATUS_COUNTS,
  MOCK_JOB_STATUS_COUNTS,
  MOCK_RECENT_JOBS
} from '../constants/mockData'
import type { AssetStatus, JobStatus } from '../types/status'

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineTag,
  HiOutlineQuestionMarkCircle,
  HiOutlineArrowPath,
  HiOutlineCog6Tooth,
  HiOutlineCheckBadge,
  HiOutlineArrowUpTray
}

// Animated counter hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return count
}

// Stats data
const stats = [
  {
    icon: HiOutlineCube,
    label: 'อุปกรณ์ทั้งหมด',
    value: '186',
    rawValue: 186,
    change: '+12%',
    isUp: true,
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
  },
  {
    icon: HiOutlineArrowsRightLeft,
    label: 'อุปกรณ์เช่ายืม',
    value: '42',
    rawValue: 42,
    change: '+15%',
    isUp: true,
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
  },
  {
    icon: HiOutlineExclamationTriangle,
    label: 'ใกล้หมดอายุ',
    value: '12',
    rawValue: 12,
    change: '-3',
    isUp: false,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  },
  {
    icon: HiOutlineClipboardDocumentList,
    label: 'งานซ่อมทั้งหมด',
    value: '188',
    rawValue: 188,
    change: '+5%',
    isUp: true,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  },
]

// Stat card component
function StatCard({ stat, index }: { stat: typeof stats[0], index: number }) {
  const Icon = stat.icon
  const count = useCounter(stat.rawValue, 1500 + index * 200)

  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-4px] animate-slide-up"
      style={{
        animationDelay: `${index * 100}ms`,
        background: stat.gradient
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-xl -translate-x-4 translate-y-4"></div>

      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">{stat.label}</p>
            <p className="text-3xl font-bold text-white mt-2 font-['Outfit']">
              {count.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${stat.isUp ? 'bg-white/20 text-white' : 'bg-white/20 text-white'
            }`}>
            {stat.isUp ? (
              <HiOutlineArrowTrendingUp className="w-3 h-3" />
            ) : (
              <HiOutlineArrowTrendingDown className="w-3 h-3" />
            )}
            {stat.change}
          </div>
          <span className="text-xs text-white/70">จากเดือนที่แล้ว</span>
        </div>
      </div>
    </div>
  )
}

// Asset Status Card Component
function AssetStatusCard({ status, count, delay }: { status: AssetStatus, count: number, delay: number }) {
  const config = ASSET_STATUS_CONFIG[status]
  const Icon = iconMap[config.icon]
  const animatedCount = useCounter(count, 1200 + delay * 100)

  return (
    <div
      className={`group relative flex items-center gap-3 p-4 rounded-xl border ${config.borderColor} ${config.bgColor} hover:shadow-md transition-all duration-300 animate-slide-up cursor-pointer`}
      style={{ animationDelay: `${delay * 50}ms` }}
    >
      <div className={`p-2.5 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
        {Icon && <Icon className={`w-5 h-5 ${config.color}`} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xl font-bold ${config.color} font-['Outfit']`}>{animatedCount}</p>
        <p className="text-xs text-gray-500 truncate">{config.labelThai}</p>
      </div>
      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${config.bgColor} ${config.color} border ${config.borderColor}`}>
        {config.label}
      </span>
    </div>
  )
}

// Job Status Card Component
function JobStatusCard({ status, count, delay }: { status: JobStatus, count: number, delay: number }) {
  const config = JOB_STATUS_CONFIG[status]
  const Icon = iconMap[config.icon]
  const animatedCount = useCounter(count, 1200 + delay * 100)

  return (
    <div
      className={`group relative flex flex-col items-center justify-center p-5 rounded-xl border ${config.borderColor} ${config.bgColor} hover:shadow-md transition-all duration-300 animate-slide-up cursor-pointer`}
      style={{ animationDelay: `${delay * 50}ms` }}
    >
      <div className={`p-3 rounded-xl ${config.bgColor} border ${config.borderColor} mb-3`}>
        {Icon && <Icon className={`w-6 h-6 ${config.color}`} />}
      </div>
      <p className={`text-2xl font-bold ${config.color} font-['Outfit']`}>{animatedCount}</p>
      <p className="text-xs text-gray-600 mt-1 text-center">{config.labelThai}</p>
      {config.note && (
        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 border border-emerald-200">
          {config.note}
        </span>
      )}
    </div>
  )
}

// Main Dashboard Component
export default function PharmacyDashboard() {
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} index={index} />
        ))}
      </div>

      {/* Asset Status & Job Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Status */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow animate-slide-up delay-100">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg shadow-teal-500/20">
                <HiOutlineCube className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 font-['Outfit']">Asset Status</h2>
                <p className="text-xs text-gray-500">สถานะเครื่องมือแพทย์</p>
              </div>
            </div>
            <button className="text-sm text-accent-600 hover:text-accent-700 font-medium">
              ดูทั้งหมด
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MOCK_ASSET_STATUS_COUNTS.map((item, index) => (
              <AssetStatusCard key={item.status} status={item.status} count={item.count} delay={index} />
            ))}
          </div>
          {/* Total Summary */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">รวมอุปกรณ์ทั้งหมด</span>
            <span className="text-lg font-bold text-gray-900 font-['Outfit']">
              {MOCK_ASSET_STATUS_COUNTS.reduce((sum, item) => sum + item.count, 0).toLocaleString()} เครื่อง
            </span>
          </div>
        </div>

        {/* Job Status */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow animate-slide-up delay-200">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                <HiOutlineWrenchScrewdriver className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 font-['Outfit']">Job Status</h2>
                <p className="text-xs text-gray-500">สถานะงานซ่อม</p>
              </div>
            </div>
            <button className="text-sm text-accent-600 hover:text-accent-700 font-medium">
              ดูทั้งหมด
            </button>
          </div>

          {/* Job Status Cards */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {MOCK_JOB_STATUS_COUNTS.map((item, index) => (
              <JobStatusCard key={item.status} status={item.status} count={item.count} delay={index} />
            ))}
          </div>

          {/* Recent Jobs */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">งานซ่อมล่าสุด</p>
            <div className="space-y-2">
              {MOCK_RECENT_JOBS.slice(0, 3).map((job) => {
                const config = JOB_STATUS_CONFIG[job.status]
                const Icon = iconMap[config.icon]
                return (
                  <div key={job.id} className="group flex items-center gap-3 p-2.5 -mx-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className={`p-2 rounded-lg ${config.bgColor}`}>
                      {Icon && <Icon className={`w-4 h-4 ${config.color}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">{job.equipmentName}</p>
                      <p className="text-xs text-gray-400">{job.id} • {job.updatedAt}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${config.bgColor} ${config.color} border ${config.borderColor}`}>
                      {config.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
