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
