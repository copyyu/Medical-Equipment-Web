import { HiXMark } from 'react-icons/hi2'
import { EQUIPMENT_STATUS_CONFIG, type EquipmentListItem, type EquipmentStatus } from '../../types/equipment'

interface ViewEquipmentModalProps {
    equipment: EquipmentListItem | null
    isOpen: boolean
    onClose: () => void
    onEdit: () => void
}

export default function ViewEquipmentModal({ equipment, isOpen, onClose, onEdit }: ViewEquipmentModalProps) {
    if (!isOpen || !equipment) return null

    const statusKey = equipment.status as EquipmentStatus
    const statusConfig = EQUIPMENT_STATUS_CONFIG[statusKey] || {
        label: equipment.status,
        labelThai: equipment.status,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700'
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
                    <h2 className="text-lg font-semibold text-gray-900">รายละเอียดอุปกรณ์</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <HiXMark className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-5 space-y-4">
                    {/* Row 1: ID & Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">หมายเลขอุปกรณ์</p>
                            <p className="text-sm font-medium text-gray-900">{equipment.id}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">ชื่ออุปกรณ์</p>
                            <p className="text-sm font-medium text-gray-900">{equipment.name}</p>
                        </div>
                    </div>

                    {/* Row 2: Category & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">ประเภท</p>
                            <p className="text-sm font-medium text-gray-900">{equipment.category}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">สถานะ</p>
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                                {statusConfig.label}
                            </span>
                        </div>
                    </div>

                    {/* Row 3: Location & Last Check */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">สถานที่</p>
                            <p className="text-sm font-medium text-gray-900">{equipment.location}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">ตรวจสอบล่าสุด</p>
                            <p className="text-sm font-medium text-gray-900">{equipment.lastCheck}</p>
                        </div>
                    </div>

                    {/* Row 4: Expiry */}
                    <div>
                        <p className="text-xs text-gray-500 mb-1">วันหมดอายุ</p>
                        <p className="text-sm font-medium text-gray-900">{equipment.expiry}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        ปิด
                    </button>
                    <button
                        onClick={onEdit}
                        className="px-4 py-2.5 text-sm font-semibold text-white bg-gradient-primary rounded-xl hover:shadow-lg hover:shadow-accent-500/25 transition-all"
                    >
                        แก้ไข
                    </button>
                </div>
            </div>
        </div>
    )
}
