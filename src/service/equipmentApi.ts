import type { EquipmentListItem } from '../types/equipment'

const BASE_URL = 'http://localhost:8081'

// API Response Types
export interface EquipmentListResponse {
    data: EquipmentApiItem[]
    total: number
    page: number
    limit: number
    total_pages: number
}

export interface EquipmentApiItem {
    id: string
    name: string
    category: string
    status: string
    location: string
    last_check: string
    expiry: string
    is_expiring: boolean
}

export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}

export interface EquipmentListParams {
    page?: number
    limit?: number
    status?: string
    search?: string
    sort_by?: string
    sort_dir?: string
}

// Map API status to frontend EquipmentStatus
// Backend ส่ง Asset Status: active, defective, wait_decom, decommission, active_ready_to_sell, missing, plan_to_replace
function mapApiStatusToFrontend(status: string): EquipmentListItem['status'] {
    const statusMap: Record<string, EquipmentListItem['status']> = {
        'active': 'active',
        'defective': 'defective',
        'wait_decom': 'wait_decom',
        'decommission': 'decommission',
        'active_ready_to_sell': 'active_ready_to_sell',
        'missing': 'missing',
        'plan_to_replace': 'plan_to_replace'
    }
    return statusMap[status] || 'active'
}

// Map API item to frontend EquipmentListItem
function mapApiItemToFrontend(item: EquipmentApiItem): EquipmentListItem {
    return {
        id: item.id,
        name: item.name,
        category: item.category,
        status: mapApiStatusToFrontend(item.status),
        location: item.location,
        lastCheck: item.last_check,
        expiry: item.expiry,
        isExpiring: item.is_expiring
    }
}

export async function fetchEquipmentList(params: EquipmentListParams = {}): Promise<{
    data: EquipmentListItem[]
    total: number
    page: number
    limit: number
    totalPages: number
}> {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.status) queryParams.append('status', params.status)
    if (params.search) queryParams.append('search', params.search)
    if (params.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params.sort_dir) queryParams.append('sort_dir', params.sort_dir)

    const url = `${BASE_URL}/api/equipment?${queryParams.toString()}`
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<EquipmentListResponse> = await response.json()

    if (!result.success) {
        throw new Error(result.message || 'Failed to fetch equipment list')
    }

    return {
        data: result.data.data.map(mapApiItemToFrontend),
        total: result.data.total,
        page: result.data.page,
        limit: result.data.limit,
        totalPages: result.data.total_pages
    }
}
