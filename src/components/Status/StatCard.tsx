import { useEffect, useState, useMemo } from 'react'
import {
    HiOutlineCube,
    HiOutlineClipboardDocumentList,
    HiOutlineArrowTrendingUp,
    HiOutlineArrowTrendingDown,
    HiOutlineExclamationCircle,
    HiOutlineExclamationTriangle,
    HiOutlineClock
} from 'react-icons/hi2'
import type { IconType } from 'react-icons'

// Interface
export interface StatCardData {
    totalEquipment: number
    expiredEquipment: number
    nearExpiry: number
    totalMaintenance: number
}

interface StatCardProps {
    data?: StatCardData | null
    isLoading?: boolean
}

interface StatItem {
    icon: IconType
    label: string
    rawValue: number
    trendValue: string
    isUp: boolean
    gradient: string
    shadowColor: string
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
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            setCount(Math.floor(easeProgress * end))
            if (progress < 1) animationFrame = requestAnimationFrame(animate)
        }
        animationFrame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationFrame)
    }, [end, duration])
    return count
}

// Skeleton Loader
function StatCardSkeleton({ index }: { index: number }) {
    return (
        <div className="relative overflow-hidden rounded-2xl p-6 animate-pulse bg-white border border-gray-100 shadow-sm" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex justify-between items-start">
                <div className="space-y-3">
                    <div className="h-4 w-24 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                <div className="h-4 w-20 bg-gray-200 rounded-full"></div>
            </div>
        </div>
    )
}

// Single Stat Card Item
function StatCardItem({ stat, index }: { stat: StatItem, index: number }) {
    const Icon = stat.icon
    const count = useCounter(stat.rawValue, 1500 + index * 100)

    return (
        <div
            className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{
                background: stat.gradient,
                boxShadow: `0 10px 15px -3px ${stat.shadowColor}, 0 4px 6px -2px ${stat.shadowColor}`
            }}
        >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-2xl -translate-x-4 translate-y-4"></div>

            <div className="relative z-10">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-white/90 font-sans tracking-wide">
                            {stat.label}
                        </p>
                        <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">
                            {count.toLocaleString()}
                        </h3>
                    </div>
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>

                {/* Footer Section */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm bg-white/20 text-white`}>
                        {stat.isUp ? <HiOutlineArrowTrendingUp className="w-3 h-3" /> : <HiOutlineArrowTrendingDown className="w-3 h-3" />}
                        <span>{stat.isUp ? '+ เพิ่มขึ้น' : '- ลดลง'}</span>
                    </div>
                    <span className="text-xs text-white/70 ml-auto flex items-center gap-1">
                        <HiOutlineClock className="w-3 h-3" /> {stat.trendValue}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default function StatCard({ data, isLoading = false }: StatCardProps) {

    const stats = useMemo<StatItem[]>(() => {
        const safeData = data ?? {
            totalEquipment: 0,
            expiredEquipment: 0,
            nearExpiry: 0,
            totalMaintenance: 0
        }

        return [
            {
                icon: HiOutlineCube,
                label: 'อุปกรณ์ทั้งหมด',
                rawValue: safeData.totalEquipment,
                trendValue: 'อัปเดตล่าสุด',
                isUp: true,
                gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', // Blue
                shadowColor: 'rgba(37, 99, 235, 0.3)'
            },
            {
                // 🔴 การ์ดหมดอายุ (Expired)
                icon: HiOutlineExclamationCircle,
                label: 'หมดอายุการใช้งาน',
                rawValue: safeData.expiredEquipment,
                trendValue: 'ควรจำหน่ายออก',
                isUp: false,
                gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', // Red
                shadowColor: 'rgba(220, 38, 38, 0.3)'
            },
            {
                // 🟠 การ์ดใกล้หมดอายุ (Near Expiry)
                icon: HiOutlineExclamationTriangle,
                label: 'ใกล้หมดอายุ (1 ปี)',
                rawValue: safeData.nearExpiry,
                trendValue: 'ต้องวางแผน',
                isUp: true,
                gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', // Orange
                shadowColor: 'rgba(234, 88, 12, 0.3)'
            },
            {
                // 🟢 การ์ดงานซ่อม (Maintenance)
                icon: HiOutlineClipboardDocumentList,
                label: 'งานซ่อมทั้งหมด',
                rawValue: safeData.totalMaintenance,
                trendValue: 'กำลังดำเนินการ',
                isUp: true,
                gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Emerald
                shadowColor: 'rgba(5, 150, 105, 0.3)'
            },
        ]
    }, [data])

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[0, 1, 2, 3].map((index) => <StatCardSkeleton key={index} index={index} />)}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <StatCardItem key={index} stat={stat} index={index} />
            ))}
        </div>
    )
}