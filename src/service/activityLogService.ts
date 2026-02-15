import { api, type ApiResponse } from './api'
import type { StatusChangeLog, ActivityLogParams } from '../types/activityLog'

// ===== Activity Log Service =====
// เชื่อม Backend API จริง

interface ActivityLogListData {
    data: Array<{
        id: number
        ticket_id: number
        ticket_no: string
        equipment_name: string
        user_name: string
        from_status: string
        to_status: string
        note: string
        changed_at: string
    }>
    pagination: {
        page: number
        limit: number
        total: number
        total_pages: number
    }
}

/**
 * ดึง activity logs พร้อม filter & pagination
 * GET /api/activity-logs
 */
export async function fetchActivityLogs(params: ActivityLogParams = {}): Promise<{
    logs: StatusChangeLog[]
    total: number
    page: number
    limit: number
    totalPages: number
}> {
    const queryParams = new URLSearchParams()
    if (params.search) queryParams.append('search', params.search)
    if (params.fromStatus) queryParams.append('from_status', params.fromStatus)
    if (params.toStatus) queryParams.append('to_status', params.toStatus)
    if (params.startDate) queryParams.append('start_date', params.startDate)
    if (params.endDate) queryParams.append('end_date', params.endDate)
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())

    const qs = queryParams.toString()
    const response = await api.get<ApiResponse<ActivityLogListData>>(
        `/api/activity-logs${qs ? '?' + qs : ''}`
    )

    const result = response.data

    // Map snake_case backend to camelCase frontend
    const logs: StatusChangeLog[] = (result.data || []).map(item => ({
        id: item.id,
        ticketId: item.ticket_id,
        ticketNo: item.ticket_no,
        equipmentName: item.equipment_name,
        userName: item.user_name,
        fromStatus: item.from_status,
        toStatus: item.to_status,
        note: item.note,
        changedAt: item.changed_at,
    }))

    return {
        logs,
        total: result.pagination.total,
        page: result.pagination.page,
        limit: result.pagination.limit,
        totalPages: result.pagination.total_pages,
    }
}

/**
 * Export logs เป็น CSV (client-side)
 */
export function exportLogsToCSV(logs: StatusChangeLog[]): void {
    const headers = ['วันเวลา', 'ผู้ดำเนินการ', 'เลข Ticket', 'อุปกรณ์', 'สถานะเดิม', 'สถานะใหม่', 'หมายเหตุ']
    const rows = logs.map(log => [
        new Date(log.changedAt).toLocaleString('th-TH'),
        log.userName,
        log.ticketNo,
        log.equipmentName,
        log.fromStatus,
        log.toStatus,
        log.note || ''
    ])

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // สร้าง BOM สำหรับ Excel ภาษาไทย
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `ticket-status-log_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()

    URL.revokeObjectURL(url)
}
