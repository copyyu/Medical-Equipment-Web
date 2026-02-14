// Dashboard API Response Types

export type AssetStatusType =
    | 'active'
    | 'defective'
    | 'wait_decom'
    | 'decommission'
    | 'active_ready_to_sell'
    | 'missing'
    | 'plan_to_replace'

export type JobStatusType =
    | 'in_process'
    | 'return_equipment_back'
    | 'send_to_outsource'

export interface AssetStatusCount {
    status: AssetStatusType
    count: number
}

export interface JobStatusCount {
    status: JobStatusType
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


