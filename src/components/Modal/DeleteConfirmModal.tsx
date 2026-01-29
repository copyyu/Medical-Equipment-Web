import { useState } from 'react'
import { HiXMark, HiExclamationTriangle } from 'react-icons/hi2'
import type { EquipmentListItem } from '../../types/equipment'
import { deleteEquipment } from '../../service/equipmentApi'

interface DeleteConfirmModalProps {
    equipment: EquipmentListItem | null
    isOpen: boolean
    onClose: () => void
    onDeleted: () => void
}

export default function DeleteConfirmModal({ equipment, isOpen, onClose, onDeleted }: DeleteConfirmModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!isOpen || !equipment) return null

    const handleDelete = async () => {
        setIsLoading(true)
        setError(null)
        try {
            await deleteEquipment(equipment.id)
            onDeleted()
            onClose()
        } catch (err) {
            console.error('Error deleting equipment:', err)
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบ')
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
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">ยืนยันการลบ</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <HiXMark className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-5">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-100 rounded-full flex-shrink-0">
                            <HiExclamationTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-gray-900 font-medium mb-1">
                                คุณต้องการลบอุปกรณ์นี้หรือไม่?
                            </p>
                            <p className="text-sm text-gray-500 mb-3">
                                รหัส: <span className="font-medium">{equipment.id}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                ชื่อ: <span className="font-medium">{equipment.name}</span>
                            </p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
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
                        type="button"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'กำลังลบ...' : 'ลบอุปกรณ์'}
                    </button>
                </div>
            </div>
        </div>
    )
}
