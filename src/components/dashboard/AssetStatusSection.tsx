import { useEffect, useState } from 'react'
import {
    HiOutlineCube,
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
    HiOutlineClock,
    HiOutlineXCircle,
    HiOutlineTag,
    HiOutlineQuestionMarkCircle,
    HiOutlineArrowPath
} from 'react-icons/hi2'

import { ASSET_STATUS_CONFIG } from '../../constants/mockData'
import type { AssetStatus } from '../../types/status'
import type { AssetStatusCount } from '../../types/dashboard'

interface AssetStatusSectionProps {
    data?: AssetStatusCount[] | null
    isLoading?: boolean
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
    HiOutlineClock,
    HiOutlineXCircle,
    HiOutlineTag,
    HiOutlineQuestionMarkCircle,
    HiOutlineArrowPath
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

// Skeleton Loader Component
function AssetStatusSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-pulse">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                    <div>
                        <div className="h-5 w-28 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-36 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                    <div key={index} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                            <div className="h-6 w-12 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 w-20 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="h-4 w-28 bg-gray-200 rounded"></div>
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
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

// Asset Status Section Component
export default function AssetStatusSection({ data, isLoading = false }: AssetStatusSectionProps) {
    if (isLoading) {
        return <AssetStatusSkeleton />
    }

    const assetStatusData = data ?? []
    const totalCount = assetStatusData.reduce((sum, item) => sum + item.count, 0)

    return (
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
                {assetStatusData.map((item, index) => (
                    <AssetStatusCard key={item.status} status={item.status as AssetStatus} count={item.count} delay={index} />
                ))}
            </div>

            {/* Total Summary */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500">รวมอุปกรณ์ทั้งหมด</span>
                <span className="text-lg font-bold text-gray-900 font-['Outfit']">
                    {totalCount.toLocaleString()} เครื่อง
                </span>
            </div>
        </div>
    )
}
