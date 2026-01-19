import type {
    AssetStatus,
    AssetStatusInfo,
    JobStatus,
    JobStatusInfo,
    StatusCount,
    RecentJob
} from '../types/status'

// ===== ASSET STATUS CONFIGURATION =====
export const ASSET_STATUS_CONFIG: Record<AssetStatus, AssetStatusInfo> = {
    active: {
        key: 'active',
        label: 'Active',
        labelThai: 'ใช้งานอยู่',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        icon: 'HiOutlineCheckCircle'
    },
    defective: {
        key: 'defective',
        label: 'Defective',
        labelThai: 'ชำรุด',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: 'HiOutlineExclamationCircle'
    },
    wait_decom: {
        key: 'wait_decom',
        label: 'Wait Decom',
        labelThai: 'รอปลดระวาง',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        icon: 'HiOutlineClock'
    },
    decommission: {
        key: 'decommission',
        label: 'Decommission',
        labelThai: 'ปลดระวางแล้ว',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-200',
        icon: 'HiOutlineXCircle'
    },
    active_ready_to_sell: {
        key: 'active_ready_to_sell',
        label: 'Active-Ready to Sell',
        labelThai: 'พร้อมขาย',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: 'HiOutlineTag'
    },
    missing: {
        key: 'missing',
        label: 'Missing',
        labelThai: 'สูญหาย',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        icon: 'HiOutlineQuestionMarkCircle'
    },
    plan_to_replace: {
        key: 'plan_to_replace',
        label: 'Plan to Replace',
        labelThai: 'รอเปลี่ยนใหม่',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        icon: 'HiOutlineArrowPath'
    }
}

// ===== JOB STATUS CONFIGURATION =====
export const JOB_STATUS_CONFIG: Record<JobStatus, JobStatusInfo> = {
    in_process: {
        key: 'in_process',
        label: 'In Process',
        labelThai: 'กำลังดำเนินการ',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: 'HiOutlineCog6Tooth'
    },
    return_equipment_back: {
        key: 'return_equipment_back',
        label: 'Return Equipment Back',
        labelThai: 'ส่งคืนอุปกรณ์แล้ว',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        icon: 'HiOutlineCheckBadge',
        note: 'Job Closed'
    },
    send_to_outsource: {
        key: 'send_to_outsource',
        label: 'Send to Outsource',
        labelThai: 'ส่งซ่อมภายนอก',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        icon: 'HiOutlineArrowUpTray'
    }
}

// ===== MOCK DATA: ASSET STATUS COUNTS =====
export const MOCK_ASSET_STATUS_COUNTS: StatusCount<AssetStatus>[] = [
    { status: 'active', count: 120 },
    { status: 'defective', count: 15 },
    { status: 'wait_decom', count: 8 },
    { status: 'decommission', count: 23 },
    { status: 'active_ready_to_sell', count: 5 },
    { status: 'missing', count: 3 },
    { status: 'plan_to_replace', count: 12 }
]

// ===== MOCK DATA: JOB STATUS COUNTS =====
export const MOCK_JOB_STATUS_COUNTS: StatusCount<JobStatus>[] = [
    { status: 'in_process', count: 24 },
    { status: 'return_equipment_back', count: 156 },
    { status: 'send_to_outsource', count: 8 }
]

// ===== MOCK DATA: RECENT JOBS =====
export const MOCK_RECENT_JOBS: RecentJob[] = [
    {
        id: 'JOB-2026-0142',
        equipmentName: 'เครื่องวัดความดัน #A-201',
        status: 'in_process',
        assignee: 'สมชาย ช่างซ่อม',
        updatedAt: '10 นาทีที่แล้ว'
    },
    {
        id: 'JOB-2026-0141',
        equipmentName: 'เครื่องช่วยหายใจ #V-089',
        status: 'send_to_outsource',
        assignee: 'บริษัท ABC Medical',
        updatedAt: '1 ชั่วโมงที่แล้ว'
    },
    {
        id: 'JOB-2026-0140',
        equipmentName: 'เครื่อง Monitor #M-156',
        status: 'return_equipment_back',
        assignee: 'สมหญิง เทคนิค',
        updatedAt: '2 ชั่วโมงที่แล้ว'
    },
    {
        id: 'JOB-2026-0139',
        equipmentName: 'เครื่อง Defibrillator #D-034',
        status: 'in_process',
        assignee: 'สมชาย ช่างซ่อม',
        updatedAt: '3 ชั่วโมงที่แล้ว'
    }
]
