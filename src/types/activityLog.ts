// ===== Activity Log Types =====
// บันทึกการเปลี่ยนสถานะ Ticket

export interface StatusChangeLog {
    id: number
    ticketId: number
    ticketNo: string
    equipmentName: string
    userName: string
    fromStatus: string
    toStatus: string
    changedAt: string         // ISO 8601 datetime string
    note: string
}

// Params สำหรับ filter/query activity logs
export interface ActivityLogParams {
    search?: string
    fromStatus?: string
    toStatus?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
}
