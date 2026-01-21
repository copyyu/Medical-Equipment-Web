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

export interface RequestItem {
  id: string;
  requestNumber: string;
  requestType: 'repair' | 'replace' | 'maintenance' | 'inspection' | 'other';
  equipmentName: string;
  equipmentSerial: string;
  requesterName: string;
  department: string;
  requestDate: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  assignedTo?: string;
  completedDate?: string;
}

export const requestTypeConfig = {
  repair: { label: 'แจ้งซ่อม', color: 'bg-orange-100 text-orange-700'},
  replace: { label: 'แจ้งเปลี่ยน', color: 'bg-purple-100 text-purple-700'},
  maintenance: { label: 'บำรุงรักษา', color: 'bg-blue-100 text-blue-700' },
  inspection: { label: 'ตรวจสอบ', color: 'bg-teal-100 text-teal-700' },
  other: { label: 'อื่นๆ', color: 'bg-gray-100 text-gray-700'},
};

export const priorityConfig = {
  low: { label: 'ต่ำ', color: 'bg-gray-100 text-gray-600' },
  medium: { label: 'ปานกลาง', color: 'bg-blue-100 text-blue-700' },
  high: { label: 'สูง', color: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'เร่งด่วน', color: 'bg-red-100 text-red-700' },
};

export const statusConfig = {
  pending: { label: 'รอดำเนินการ', color: 'bg-yellow-100 text-yellow-700'},
  'in-progress': { label: 'กำลังดำเนินการ', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'เสร็จสิ้น', color: 'bg-emerald-100 text-emerald-700'},
  rejected: { label: 'ปฏิเสธ', color: 'bg-red-100 text-red-700' },
};