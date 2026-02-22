// ===== Centralized Equipment Options =====
// Use these constants across the application to avoid duplication

import type { EquipmentStatus } from '../types/equipment'

// Status options for select dropdowns
export const STATUS_OPTIONS = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'active', label: 'Active (ใช้งานอยู่)' },
    { value: 'defective', label: 'Defective (ชำรุด)' },
    { value: 'wait_decom', label: 'Wait Decom (รอปลดระวาง)' },
    { value: 'decommission', label: 'Decommission (ปลดระวางแล้ว)' },
    { value: 'active_ready_to_sell', label: 'Active-Ready to Sell (พร้อมขาย)' },
    { value: 'missing', label: 'Missing (สูญหาย)' },
    { value: 'plan_to_replace', label: 'Plan to Replace (รอเปลี่ยนใหม่)' }
] as const

// Expiry filter options for equipment list
export const EXPIRY_FILTER_OPTIONS = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'near_expiry', label: 'ใกล้หมดอายุ' },
    { value: 'expired', label: 'หมดอายุแล้ว' }
] as const

// Status options without "All" option (for edit forms)
export const STATUS_OPTIONS_NO_ALL = STATUS_OPTIONS.filter(opt => opt.value !== '') as {
    value: EquipmentStatus
    label: string
}[]

// Category options
export const CATEGORY_OPTIONS = [
    'ทั้งหมด',
    'อุปกรณ์ทางการแพทย์',
    'ระบบปรับอากาศ',
    'เครื่องมือแพทย์การแพทย์',
    'เครื่องปรับอากาศ'
] as const

// Category options without "All" (for edit forms)
export const CATEGORY_OPTIONS_NO_ALL = CATEGORY_OPTIONS.filter(cat => cat !== 'ทั้งหมด')

// Equipment status display configuration (colors, icons, labels)

export const EQUIPMENT_STATUS_CONFIG = {
    active: {
        label: 'Active',
        labelThai: 'ใช้งานอยู่',
        color: 'emerald',
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        icon: 'HiOutlineCheckCircle'
    },
    defective: {
        label: 'Defective',
        labelThai: 'ชำรุด',
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        icon: 'HiOutlineExclamationCircle'
    },
    wait_decom: {
        label: 'Wait Decom',
        labelThai: 'รอปลดระวาง',
        color: 'amber',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-600',
        borderColor: 'border-amber-200',
        icon: 'HiOutlineClock'
    },
    decommission: {
        label: 'Decommissioned',
        labelThai: 'ปลดระวางแล้ว',
        color: 'gray',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-600',
        borderColor: 'border-gray-200',
        icon: 'HiOutlineXCircle'
    },
    active_ready_to_sell: {
        label: 'Ready to Sell',
        labelThai: 'พร้อมขาย',
        color: 'blue',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        icon: 'HiOutlineTag'
    },
    missing: {
        label: 'Missing',
        labelThai: 'สูญหาย',
        color: 'orange',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-600',
        borderColor: 'border-orange-200',
        icon: 'HiOutlineQuestionMarkCircle'
    },
    // สถานะสำหรับเครื่องที่หมดอายุ (Backend จะส่ง status นี้มาเมื่อ remain_life <= 0)
    plan_to_replace: {
        label: 'Plan to Replace',
        labelThai: 'รอเปลี่ยนใหม่',
        color: 'purple',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
        borderColor: 'border-purple-200',
        icon: 'HiOutlineArrowPath'
    }
}