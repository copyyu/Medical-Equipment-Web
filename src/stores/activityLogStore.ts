import { create } from 'zustand'
import type { StatusChangeLog, ActivityLogParams } from '../types/activityLog'
import { fetchActivityLogs } from '../service/activityLogService'

interface ActivityLogState {
    // Data
    logs: StatusChangeLog[]
    total: number
    page: number
    totalPages: number

    // UI
    isLoading: boolean
    error: string | null

    // Filters
    filters: ActivityLogParams

    // Actions
    fetchLogs: (params?: ActivityLogParams) => Promise<void>
    setFilter: (key: keyof ActivityLogParams, value: string) => void
    clearFilters: () => void
    setPage: (page: number) => void
}

export const useActivityLogStore = create<ActivityLogState>((set, get) => ({
    // Data
    logs: [],
    total: 0,
    page: 1,
    totalPages: 1,

    // UI
    isLoading: false,
    error: null,

    // Filters
    filters: { page: 1, limit: 10 },

    // Actions
    fetchLogs: async (params?: ActivityLogParams) => {
        set({ isLoading: true, error: null })
        try {
            const mergedParams = { ...get().filters, ...params }
            const result = await fetchActivityLogs(mergedParams)
            set({
                logs: result.logs,
                total: result.total,
                page: result.page,
                totalPages: result.totalPages,
                isLoading: false,
            })
        } catch (error) {
            console.error('Error fetching activity logs:', error)
            set({
                error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
                isLoading: false,
            })
        }
    },

    setFilter: (key: keyof ActivityLogParams, value: string) => {
        const filters = { ...get().filters, [key]: value || undefined, page: 1 }
        set({ filters, page: 1 })
        get().fetchLogs(filters)
    },

    clearFilters: () => {
        set({
            filters: { page: 1, limit: 10 },
            page: 1,
        })
    },

    setPage: (page: number) => {
        set({ page, filters: { ...get().filters, page } })
    },
}))
