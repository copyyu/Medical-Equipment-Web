import { HiOutlineCalendarDays, HiOutlineBolt, HiOutlineArrowPath, HiOutlineExclamationTriangle } from 'react-icons/hi2'

import StatCard from '../../components/Status/StatCard'
import AssetStatusSection from '../../components/dashboard/AssetStatusSection'
import JobStatusSection from '../../components/dashboard/JobStatusSection'
import { useDashboard } from '../../hooks/useDashboard'

export default function HomePage() {
  const { data, isLoading, error, refetch, lastUpdated } = useDashboard()

  // Format last updated time
  const formatLastUpdated = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  // Error State
  if (error && !isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-red-100 p-8 max-w-md w-full text-center shadow-lg animate-fade-in">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineExclamationTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">ไม่สามารถโหลดข้อมูลได้</h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-accent-500/25 transition-all"
          >
            <HiOutlineArrowPath className="w-4 h-4" />
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    )
  }

  // Prepare stat card data
  const statCardData = data ? {
    totalEquipment: data.total_equipment,
    rentalEquipment: data.rental_equipment,
    nearExpiry: data.near_expiry,
    totalMaintenance: data.total_maintenance
  } : null

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-['Outfit']">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">ภาพรวมระบบจัดการอุปกรณ์การแพทย์</p>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-1">
              อัปเดตล่าสุด: {formatLastUpdated(lastUpdated)} (รีเฟรชอัตโนมัติทุก 30 วินาที)
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
            <HiOutlineCalendarDays className="w-4 h-4" />
            มกราคม 2026
          </button>
          <button
            onClick={refetch}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50"
          >
            <HiOutlineArrowPath className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            รีเฟรช
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-primary text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-accent-500/25 transition-all">
            <HiOutlineBolt className="w-4 h-4" />
            ดาวน์โหลดรายงาน
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatCard data={statCardData} isLoading={isLoading} />

      {/* Asset Status & Job Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssetStatusSection data={data?.asset_status_counts} isLoading={isLoading} />
        <JobStatusSection
          jobStatusData={data?.job_status_counts}
          recentJobs={data?.recent_jobs}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}