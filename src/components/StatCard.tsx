import { useEffect, useState } from 'react'
import {
    HiOutlineCube,
    HiOutlineClipboardDocumentList,
    HiOutlineArrowTrendingUp,
    HiOutlineArrowTrendingDown,
    HiOutlineArrowsRightLeft,
    HiOutlineExclamationTriangle
} from 'react-icons/hi2'

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
        rawValue: 186,
        change: '+12%',
        isUp: true,
        gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
    },
    {
        icon: HiOutlineArrowsRightLeft,
        label: 'อุปกรณ์เช่ายืม',
        rawValue: 42,
        change: '+15%',
        isUp: true,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    },
    {
        icon: HiOutlineExclamationTriangle,
        label: 'ใกล้หมดอายุ',
        rawValue: 12,
        change: '-3',
        isUp: false,
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    {
        icon: HiOutlineClipboardDocumentList,
        label: 'งานซ่อมทั้งหมด',
        rawValue: 188,
        change: '+5%',
        isUp: true,
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
]

// Single Stat Card
function StatCardItem({ stat, index }: { stat: typeof stats[0], index: number }) {
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
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">
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

// Stats Section Component
export default function StatCard() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, index) => (
                <StatCardItem key={index} stat={stat} index={index} />
            ))}
        </div>
    )
}
