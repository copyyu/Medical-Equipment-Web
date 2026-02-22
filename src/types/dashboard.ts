// Dashboard API Response Types
import type { AssetStatus, JobStatus } from './status'

export interface AssetStatusCount {
    status: AssetStatus
    count: number
}

export interface JobStatusCount {
    status: JobStatus
    count: number
}

export interface RecentJob {
    id: string
    equipment_name: string
    status: string
    assignee: string
    updated_at: string
}

export interface DashboardSummary {
    total_equipment: number
    rental_equipment: number
    near_expiry: number
    total_maintenance: number
    asset_status_counts: AssetStatusCount[]
    job_status_counts: JobStatusCount[]
    recent_jobs: RecentJob[]
}
