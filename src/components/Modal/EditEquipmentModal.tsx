import { useState, useEffect } from 'react'
import { HiXMark } from 'react-icons/hi2'
import type { EquipmentListItem } from '../../types/equipment'

interface EditEquipmentModalProps {
    equipment: EquipmentListItem | null
    isOpen: boolean
    onClose: () => void
    onSave: (data: EquipmentListItem) => void // TODO: Replace with API call
}

const CATEGORY_OPTIONS = [
    'อุปกรณ์ทางการแพทย์',
    'ระบบปรับอากาศ',
    'เครื่องมือแพทย์การแพทย์',
    'เครื่องปรับอากาศ'
]

const STATUS_OPTIONS = [
    { value: 'active', label: 'Active (ใช้งานอยู่)' },
    { value: 'defective', label: 'Defective (ชำรุด)' },
    { value: 'wait_decom', label: 'Wait Decom (รอปลดระวาง)' },
    { value: 'decommission', label: 'Decommission (ปลดระวางแล้ว)' },
    { value: 'active_ready_to_sell', label: 'Active-Ready to Sell (พร้อมขาย)' },
    { value: 'missing', label: 'Missing (สูญหาย)' },
    { value: 'plan_to_replace', label: 'Plan to Replace (รอเปลี่ยนใหม่)' }
]

export default function EditEquipmentModal({ equipment, isOpen, onClose, onSave }: EditEquipmentModalProps) {
    const [formData, setFormData] = useState<EquipmentListItem | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    // Reset form when equipment changes
    useEffect(() => {
        if (equipment) {
            setFormData({ ...equipment })
        }
    }, [equipment])

    if (!isOpen || !formData) return null

    const handleChange = (field: keyof EquipmentListItem, value: string) => {
        setFormData(prev => prev ? { ...prev, [field]: value } : null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData) return

        setIsLoading(true)
        try {
            // TODO: Call API here
            // await equipmentApi.update(formData.id, formData)

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))

            onSave(formData)
            onClose()
        } catch (error) {
            console.error('Error updating equipment:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">แก้ไขอุปกรณ์</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <HiXMark className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-5 space-y-4">
                        {/* Row 1: ID & Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">หมายเลขอุปกรณ์</label>
                                <input
                                    type="text"
                                    value={formData.id}
                                    disabled
                                    className="w-full px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">ชื่ออุปกรณ์</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="w-full px-3 py-2.5 bg-gray-900 text-white border border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                                />
                            </div>
                        </div>

                        {/* Row 2: Category & Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">ประเภท</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 appearance-none cursor-pointer"
                                >
                                    {CATEGORY_OPTIONS.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">สถานะ</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 appearance-none cursor-pointer"
                                >
                                    {STATUS_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Row 3: Location & Last Check */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">สถานที่</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">ตรวจสอบล่าสุด</label>
                                <input
                                    type="date"
                                    value={formData.lastCheck}
                                    onChange={(e) => handleChange('lastCheck', e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                                />
                            </div>
                        </div>

                        {/* Row 4: Expiry */}
                        <div>
                            <label className="block text-xs text-gray-500 mb-1.5">วันหมดอายุ</label>
                            <input
                                type="date"
                                value={formData.expiry}
                                onChange={(e) => handleChange('expiry', e.target.value)}
                                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2.5 text-sm font-semibold text-white bg-gradient-primary rounded-xl hover:shadow-lg hover:shadow-accent-500/25 transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
