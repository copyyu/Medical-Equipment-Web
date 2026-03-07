import { useState, useEffect, useCallback } from 'react'
import type { EquipmentListItem } from '../types/equipment'
import { fetchEquipmentList, type EquipmentListParams } from '../service/equipmentService'
import { useEventStream } from './useEventStream'

interface UseEquipmentListResult {
    data: EquipmentListItem[]
    isLoading: boolean
    error: string | null
    total: number
    page: number
    totalPages: number
    refetch: () => Promise<void>
    setParams: (params: EquipmentListParams) => void
    isLive: boolean
}

export function useEquipmentList(initialParams: EquipmentListParams = {}): UseEquipmentListResult {
    const [data, setData] = useState<EquipmentListItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [params, setParams] = useState<EquipmentListParams>(initialParams)

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            const result = await fetchEquipmentList(params)
            setData(result.data)
            setTotal(result.total)
            setPage(result.page)
            setTotalPages(result.totalPages)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }, [params])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Subscribe to equipment events for real-time updates
    const { isConnected } = useEventStream({
        eventTypes: ['equipment.created', 'equipment.updated', 'equipment.deleted'],
        onEvent: () => {
            fetchData()
        },
        onReconnect: () => {
            // Re-fetch after reconnect to sync any events missed during disconnect
            fetchData()
        },
    })

    const updateParams = useCallback((newParams: EquipmentListParams) => {
        setParams(prev => ({ ...prev, ...newParams }))
    }, [])

    return {
        data,
        isLoading,
        error,
        total,
        page,
        totalPages,
        refetch: fetchData,
        setParams: updateParams,
        isLive: isConnected,
    }
}

