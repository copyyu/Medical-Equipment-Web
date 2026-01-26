import type {
    AssetStatus,
    AssetStatusInfo,
    JobStatus,
    JobStatusInfo,
    StatusCount,
    RecentJob,
    RequestItem
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


export const mockRequests: RequestItem[] = [
    {
        id: '1',
        requestNumber: 'REQ-2026-001',
        requestType: 'repair',
        equipmentName: 'เครื่องเอกซเรย์ดิจิทัล',
        equipmentSerial: 'XR-2023-001',
        requesterName: 'นพ.สมชาย ใจดี',
        department: 'แผนกรังสีวิทยา',
        requestDate: '2026-01-20',
        description: 'เครื่องมีเสียงดังผิดปกติ และภาพไม่คมชัด',
        priority: 'high',
        status: 'in-progress',
        assignedTo: 'ช่างสมศักดิ์',
    },
    {
        id: '2',
        requestNumber: 'REQ-2026-002',
        requestType: 'replace',
        equipmentName: 'เครื่องวัดความดันอัตโนมัติ',
        equipmentSerial: 'BP-2023-089',
        requesterName: 'พยาบาลสุดา รักษ์ดี',
        department: 'แผนก OPD',
        requestDate: '2026-01-21',
        description: 'จอแสดงผลเสีย ไม่สามารถอ่านค่าได้',
        priority: 'urgent',
        status: 'pending',
    },
    {
        id: '3',
        requestNumber: 'REQ-2026-003',
        requestType: 'maintenance',
        equipmentName: 'เครื่อง CT Scan',
        equipmentSerial: 'CT-2022-045',
        requesterName: 'นพ.วิชัย ศรีสุข',
        department: 'แผนกรังสีวิทยา',
        requestDate: '2026-01-19',
        description: 'ครบกำหนดบำรุงรักษาประจำปี',
        priority: 'medium',
        status: 'completed',
        assignedTo: 'ช่างประยุทธ',
        completedDate: '2026-01-20',
    },
    {
        id: '4',
        requestNumber: 'REQ-2026-004',
        requestType: 'inspection',
        equipmentName: 'เครื่องช่วยหายใจ Ventilator',
        equipmentSerial: 'VT-2024-021',
        requesterName: 'พยาบาลมาลี สวยงาม',
        department: 'ICU',
        requestDate: '2026-01-21',
        description: 'ขอตรวจสอบการทำงานของระบบสัญญาณเตือน',
        priority: 'high',
        status: 'pending',
    },
    {
        id: '5',
        requestNumber: 'REQ-2026-005',
        requestType: 'other',
        equipmentName: 'เครื่องอัลตราซาวนด์พกพา',
        equipmentSerial: 'US-2024-012',
        requesterName: 'นพ.ธนา มั่งมี',
        department: 'แผนกสูติกรรม',
        requestDate: '2026-01-18',
        description: 'ขอย้ายอุปกรณ์ไปห้องตรวจใหม่',
        priority: 'low',
        status: 'completed',
        assignedTo: 'ทีมจัดการอุปกรณ์',
        completedDate: '2026-01-19',
    },
    {
        id: '6',
        requestNumber: 'REQ-2026-006',
        requestType: 'repair',
        equipmentName: 'เตียงผู้ป่วยไฟฟ้า',
        equipmentSerial: 'BD-2024-112',
        requesterName: 'พยาบาลนิภา ช่วยดี',
        department: 'แผนกผู้ป่วยใน',
        requestDate: '2026-01-20',
        description: 'มอเตอร์ปรับระดับเตียงไม่ทำงาน',
        priority: 'medium',
        status: 'in-progress',
        assignedTo: 'ช่างสมศักดิ์',
    },
    {
        id: '7',
        requestNumber: 'REQ-2026-007',
        requestType: 'replace',
        equipmentName: 'เครื่องวิเคราะห์เลือดอัตโนมัติ',
        equipmentSerial: 'BL-2024-056',
        requesterName: 'นักเทคนิคการแพทย์ สมใจ',
        department: 'ห้องแล็บ',
        requestDate: '2026-01-15',
        description: 'อุปกรณ์เก่าเกินไป ต้องการเปลี่ยนเครื่องใหม่',
        priority: 'high',
        status: 'rejected',
        assignedTo: 'ผู้จัดการฝ่าย',
    },
];

// ===== MOCK DATA: EQUIPMENT LIST =====
import type { EquipmentListItem } from '../types/equipment'

export const mockEquipment: EquipmentListItem[] = [
    { id: 'E4-201', name: 'เครื่องวัดความดัน', category: 'เครื่องปรับอากาศ', status: 'active', location: 'อาคาร A ชั้น 2', lastCheck: '2025-01-05', expiry: '2026-01-05' },
    { id: 'E4-155', name: 'เครื่องออกซิเจน', category: 'อุปกรณ์ทางการแพทย์', status: 'active', location: 'ห้องผู้ป่วย ICU', lastCheck: '2025-01-03', expiry: '2025-04-15' },
    { id: 'E4-009', name: 'เครื่องวัดความดัน', category: 'อุปกรณ์ทางการแพทย์', status: 'wait_decom', location: 'เก็บคลัง', lastCheck: '2024-12-29', expiry: '2025-12-28' },
    { id: 'E4-234', name: 'เครื่องส่งสาธารณภัย', category: 'อุปกรณ์ทางการแพทย์', status: 'active', location: 'ห้องฉุกเฉินพิเศษ', lastCheck: '2025-01-10', expiry: '2027-03-20' },
    { id: 'E4-12', name: 'เครื่องผสมเก่าเฉพาะ', category: 'อุปกรณ์ทางการแพทย์', status: 'defective', location: 'ห้องผสมพิเศษ', lastCheck: '2024-12-15', expiry: '2025-02-28' },
    { id: 'E4-345', name: 'เสี่ยงคู่บ่าย', category: 'เครื่องมือแพทย์การแพทย์', status: 'active', location: 'ห้องพักผู้ป่วย', lastCheck: '2025-01-08', expiry: '2030-12-31' },
    { id: 'E4-456', name: 'เครื่องช่วยหายใจ', category: 'อุปกรณ์ทางการแพทย์', status: 'active_ready_to_sell', location: 'ห้อง ICU', lastCheck: '2025-01-01', expiry: '2026-08-10' },
    { id: 'E4-567', name: 'เครื่องวัดออกซิเจน', category: 'อุปกรณ์ทางการแพทย์', status: 'active', location: 'เก็บคลัง', lastCheck: '2025-01-12', expiry: '2026-05-25' },
    { id: 'E4-678', name: 'เครื่องกระตุ้นหัวใจ', category: 'อุปกรณ์ทางการแพทย์', status: 'missing', location: 'ห้องฉุกเฉิน', lastCheck: '2025-01-15', expiry: '2027-06-15' },
    { id: 'E4-789', name: 'เครื่องเอกซเรย์', category: 'เครื่องมือแพทย์การแพทย์', status: 'plan_to_replace', location: 'ห้องเอกซเรย์', lastCheck: '2025-01-18', expiry: '2028-09-30' },
]