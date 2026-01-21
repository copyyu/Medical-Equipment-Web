import {
    HiOutlineEye,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineMagnifyingGlass
} from 'react-icons/hi2'
import { EQUIPMENT_STATUS_CONFIG, type EquipmentListItem } from '../../types/equipment'

// Re-export type for other components to use
export type { EquipmentListItem } from '../../types/equipment'

// Props interface
interface EquipmentTableProps {
    data: EquipmentListItem[]
    onView: (item: EquipmentListItem) => void
    onEdit: (item: EquipmentListItem) => void
    onDelete?: (item: EquipmentListItem) => void
}

// Check if date is expired or expiring soon
const getExpiryStatus = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return 'expired'
    if (daysUntilExpiry <= 30) return 'expiring'
    return 'ok'
}

export default function EquipmentTable({ data, onView, onEdit, onDelete }: EquipmentTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Header with count */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600">
                    พบ <span className="font-semibold text-gray-900">{data.length}</span> อุปกรณ์
                </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                หมายเลข
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                ชื่ออุปกรณ์
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                ประเภท
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                สถานะ
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                สถานที่
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                ตรวจสอบล่าสุด
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                วันหมดอายุ
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                การดำเนินการ
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.map((item) => {
                            const statusConfig = EQUIPMENT_STATUS_CONFIG[item.status]
                            const expiryStatus = getExpiryStatus(item.expiry)

                            return (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">{item.id}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{item.name}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-md text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                                            {statusConfig.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500">{item.location}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500">{item.lastCheck}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm ${expiryStatus === 'expired' ? 'text-red-600 font-medium' :
                                                expiryStatus === 'expiring' ? 'text-orange-600 font-medium' :
                                                    'text-gray-500'
                                                }`}>
                                                {item.expiry}
                                            </span>
                                            {expiryStatus === 'expired' && (
                                                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">หมดอายุ</span>
                                            )}
                                            {expiryStatus === 'expiring' && (
                                                <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">ใกล้หมดอายุ</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onView(item)}
                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                title="ดูรายละเอียด"
                                            >
                                                <HiOutlineEye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                title="แก้ไข"
                                            >
                                                <HiOutlinePencilSquare className="w-4 h-4" />
                                            </button>
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="ลบ"
                                                >
                                                    <HiOutlineTrash className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {data.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiOutlineMagnifyingGlass className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium mb-1">ไม่พบข้อมูล</p>
                    <p className="text-sm text-gray-400">ลองค้นหาด้วยคำอื่น หรือล้างตัวกรอง</p>
                </div>
            )}
        </div>
    )
}
