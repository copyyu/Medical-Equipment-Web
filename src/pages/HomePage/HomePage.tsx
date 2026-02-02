import { HiOutlineArrowPath, HiOutlineExclamationTriangle } from 'react-icons/hi2'
import { useState } from 'react'

// Components
import StatCard from '../../components/Status/StatCard'
import AssetStatusSection from '../../components/dashboard/AssetStatusSection'
import JobStatusSection from '../../components/dashboard/JobStatusSection'
// ✅ Import Component ใหม่เข้ามา
import ExpiredEquipmentSection from '../../components/dashboard/ExpiredEquipmentSection'

import { useDashboard } from '../../hooks/useDashboard'

export default function HomePage() {
  const { data, isLoading, error, refetch, lastUpdated } = useDashboard()
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  
  // Format last updated time
  const formatLastUpdated = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  // Error State
  if (error && !isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
        <div className="bg-white rounded-2xl border border-red-100 p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineExclamationTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">ไม่สามารถโหลดข้อมูลได้</h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 hover:shadow-lg transition-all"
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
    // ✅ Mapping: ใช้ค่า rental_equipment (ที่ Backend ส่งมาเป็น expired count) มาใส่ตรงนี้
    expiredEquipment: data.rental_equipment, 
    nearExpiry: data.near_expiry,
    totalMaintenance: data.total_maintenance
  } : null

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-down">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-['Outfit']">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">ภาพรวมระบบจัดการอุปกรณ์การแพทย์</p>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-1">
              อัปเดตล่าสุด: {formatLastUpdated(lastUpdated)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-blue-500 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />

          <button
            onClick={refetch}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm disabled:opacity-50"
          >
            <HiOutlineArrowPath className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">รีเฟรช</span>
          </button>
        </div>
      </div>

      {/* 1. Stats Cards (แสดงตัวเลขรวม 138) */}
      <section>
        <StatCard data={statCardData} isLoading={isLoading} />
      </section>

      {/* 2. ✅ Expired List Section (แสดงรายการที่หมดอายุ 5 รายการแรก) */}
      <section className="animate-slide-up delay-100">
         <ExpiredEquipmentSection />
      </section>

      {/* 3. Charts & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up delay-200">
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