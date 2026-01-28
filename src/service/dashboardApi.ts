import type { DashboardSummary, ApiResponse } from '../types/dashboard'

const BASE_URL = 'http://localhost:8081'

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
    const response = await fetch(`${BASE_URL}/api/dashboard/summary`)

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<DashboardSummary> = await response.json()

    if (!result.success) {
        throw new Error(result.message || 'Failed to fetch dashboard summary')
    }

    return result.data
}
