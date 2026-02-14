import { api, type ApiResponse } from './api'
import type { DashboardSummary } from '../types/dashboard'

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
    const response = await api.get<ApiResponse<DashboardSummary>>('/api/dashboard/summary')
    return response.data
}
