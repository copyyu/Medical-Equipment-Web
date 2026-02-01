import { useEffect, useState } from 'react'
import {
    HiOutlineWrenchScrewdriver,
    HiOutlineCog6Tooth,
    HiOutlineCheckBadge,
    HiOutlineArrowUpTray
} from 'react-icons/hi2'

import { JOB_STATUS_CONFIG } from '../../constants/mockData'
import type { JobStatus } from '../../types/status'
import type { JobStatusCount, RecentJob } from '../../types/dashboard'

interface JobStatusSectionProps {
    jobStatusData?: JobStatusCount[] | null
    recentJobs?: RecentJob[] | null
    isLoading?: boolean
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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

// Skeleton Loader Component
function JobStatusSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-pulse">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                    <div>
                        <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-28 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
                {[0, 1, 2].map((index) => (
                    <div key={index} className="flex flex-col items-center justify-center p-5 rounded-xl border border-gray-100 bg-gray-50">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl mb-3"></div>
                        <div className="h-7 w-10 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-100 pt-4">
                <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2">
                    {[0, 1, 2].map((index) => (
                        <div key={index} className="flex items-center gap-3 p-2.5">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1">
                                <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                        </div>
                    ))}
                </div>
            </div>
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

// Job Status Section Component
export default function JobStatusSection({ jobStatusData, recentJobs, isLoading = false }: JobStatusSectionProps) {
    if (isLoading) {
        return <JobStatusSkeleton />
    }

    const statusData = jobStatusData ?? []
    const jobs = recentJobs ?? []

    return (
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
                {statusData.map((item, index) => (
                    <JobStatusCard key={item.status} status={item.status as JobStatus} count={item.count} delay={index} />
                ))}
            </div>

            {/* Recent Jobs */}
            <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">งานซ่อมล่าสุด</p>
                <div className="space-y-2">
                    {jobs.slice(0, 3).map((job) => {
                        // Map API status to local JobStatus type
                        const jobStatus = job.status as JobStatus
                        const config = JOB_STATUS_CONFIG[jobStatus] ?? JOB_STATUS_CONFIG['in_process']
                        const Icon = iconMap[config.icon]
                        return (
                            <div key={job.id} className="group flex items-center gap-3 p-2.5 -mx-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className={`p-2 rounded-lg ${config.bgColor}`}>
                                    {Icon && <Icon className={`w-4 h-4 ${config.color}`} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700 truncate">{job.equipment_name}</p>
                                    <p className="text-xs text-gray-400">{job.id} • {job.updated_at}</p>
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
    )
}
