import {
    HiOutlineEye,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineMagnifyingGlass
} from 'react-icons/hi2'
// นำเข้า Config สีสถานะ
import { EQUIPMENT_STATUS_CONFIG } from '../../constants/equipmentOptions' 
import type { EquipmentStatus } from '../../types/equipment'
// ✅ 1. ประกาศ Interface ตรงนี้เลย เพื่อแก้ปัญหาหา Type ไม่เจอ และเพิ่ม remain_life
export interface EquipmentListItem {
    id: string
    name: string
    category: string
    status: EquipmentStatus
    location: string
    lastCheck: string
    expiry: string
    isExpiring?: boolean
    
    // ✅ เพิ่ม field นี้เพื่อให้รับค่าจาก Backend ได้โดยไม่ Error
    remain_life?: number 
}

// Props interface
interface EquipmentTableProps {
    data: EquipmentListItem[]
    total?: number 
    onView: (item: EquipmentListItem) => void
    onEdit: (item: EquipmentListItem) => void
    onDelete?: (item: EquipmentListItem) => void
}

// Check if date is expired or expiring soon
const getExpiryStatus = (expiryDate: string) => {
    if (!expiryDate || expiryDate === '-') return 'ok'
    
    const today = new Date()
    const expiry = new Date(expiryDate)
    
    // คำนวณความต่างวัน
    const diffTime = expiry.getTime() - today.getTime()
    const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return 'expired'
    if (daysUntilExpiry <= 30) return 'expiring'
    return 'ok'
}

export default function EquipmentTable({ data, total, onView, onEdit, onDelete }: EquipmentTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            {/* Header with count */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    พบ <span className="font-semibold text-gray-900">{total ?? data.length}</span> อุปกรณ์
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
                            // ป้องกันกรณี status ไม่มีใน config (fallback ไปหา active หรือ default)
                            // ต้อง Cast type เล็กน้อยเพราะ status เป็น string
                            const statusKey = item.status as keyof typeof EQUIPMENT_STATUS_CONFIG
                            const statusConfig = EQUIPMENT_STATUS_CONFIG[statusKey] || {
                                label: item.status,
                                labelThai: item.status,
                                color: 'gray',
                                bgColor: 'bg-gray-100',
                                textColor: 'text-gray-800'
                            }
                            
                            const expiryStatus = getExpiryStatus(item.expiry)

                            return (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900 font-mono">{item.id}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900 font-medium">{item.name}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.bgColor} ${statusConfig.textColor} border-transparent`}>
                                            {statusConfig.labelThai}
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
                                            <span className={`text-sm ${
                                                expiryStatus === 'expired' ? 'text-red-600 font-bold' :
                                                expiryStatus === 'expiring' ? 'text-orange-600 font-medium' :
                                                'text-gray-500'
                                            }`}>
                                                {item.expiry}
                                            </span>
                                            {/* เพิ่มจุดแดงกระพริบ ถ้าหมดอายุ */}
                                            {expiryStatus === 'expired' && (
                                                <span className="flex h-2 w-2 relative">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        {/* ซ่อนปุ่มและแสดงเมื่อ Hover */}
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onView(item)}
                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                                                title="ดูรายละเอียด"
                                            >
                                                <HiOutlineEye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                                title="แก้ไข"
                                            >
                                                <HiOutlinePencilSquare className="w-4 h-4" />
                                            </button>
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
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
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                        <HiOutlineMagnifyingGlass className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">ไม่พบข้อมูลอุปกรณ์</h3>
                    <p className="text-sm text-gray-500">ลองปรับเปลี่ยนคำค้นหา หรือตัวกรองสถานะ</p>
                </div>
            )}
        </div>
    )
}