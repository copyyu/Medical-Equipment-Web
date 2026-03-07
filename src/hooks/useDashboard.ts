import { useState, useEffect, useCallback } from 'react'
import type { DashboardSummary } from '../types/dashboard'
import { fetchDashboardSummary } from '../service/dashboardService'
import { useEventStream } from './useEventStream'

interface UseDashboardResult {
    data: DashboardSummary | null
    isLoading: boolean
    error: string | null
    refetch: () => Promise<void>
    lastUpdated: Date | null
    isLive: boolean
}

export function useDashboard(): UseDashboardResult {
    const [data, setData] = useState<DashboardSummary | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

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

    // Subscribe to real-time events — auto-refetch when data changes
    const { isConnected } = useEventStream({
        eventTypes: [
            'equipment.created',
            'equipment.updated',
            'equipment.deleted',
            'ticket.created',
            'ticket.updated',
        ],
        onEvent: () => {
            // Re-fetch dashboard data whenever any event arrives
            fetchData()
        },
        onReconnect: () => {
            // Re-fetch after reconnect to sync any events missed during disconnect
            fetchData()
        },
    })

    return { data, isLoading, error, refetch: fetchData, lastUpdated, isLive: isConnected }
}

