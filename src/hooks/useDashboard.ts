import { useState, useEffect, useCallback, useRef } from 'react'
import type { DashboardSummary } from '../types/dashboard'
import { fetchDashboardSummary } from '../service/dashboardApi'

interface UseDashboardResult {
    data: DashboardSummary | null
    isLoading: boolean
    error: string | null
    refetch: () => Promise<void>
    lastUpdated: Date | null
}

// Auto refresh interval in milliseconds (30 seconds)
const AUTO_REFRESH_INTERVAL = 30000

export function useDashboard(): UseDashboardResult {
    const [data, setData] = useState<DashboardSummary | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            const result = await fetchDashboardSummary()
            setData(result)
            setLastUpdated(new Date())
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Initial fetch
    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Auto refresh every 30 seconds
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            fetchData()
        }, AUTO_REFRESH_INTERVAL)

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [fetchData])

    return { data, isLoading, error, refetch: fetchData, lastUpdated }
}
