// Asset Status Types
export type AssetStatus =
    | 'active'
    | 'defective'
    | 'wait_decom'
    | 'decommission'
    | 'active_ready_to_sell'
    | 'missing'
    | 'plan_to_replace'

// Job Status Types
export type JobStatus =
    | 'in_process'
    | 'return_equipment_back' // = Job closed
    | 'send_to_outsource'

// Asset Status Info
export interface AssetStatusInfo {
    key: AssetStatus
    label: string
    labelThai: string
    color: string
    bgColor: string
    borderColor: string
    icon: string
}

// Job Status Info
export interface JobStatusInfo {
    key: JobStatus
    label: string
    labelThai: string
    color: string
    bgColor: string
    borderColor: string
    icon: string
    note?: string
}

// Status Count
export interface StatusCount<T> {
    status: T
    count: number
}

// Recent Job
export interface RecentJob {
    id: string
    equipmentName: string
    status: JobStatus
    assignee: string
    updatedAt: string
}
