import {
    HiOutlineEye,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineMagnifyingGlass
} from 'react-icons/hi2'
import { EQUIPMENT_STATUS_CONFIG } from '../../constants/equipmentOptions'

// ประกาศ Interface
export interface EquipmentListItem {
    id: string
    name: string
    category: string
    status: string // ถ้าแก้ Type ในไฟล์อื่นแล้ว ให้เปลี่ยนเป็น EquipmentStatus ได้
    location: string
    lastCheck: string
    expiry: string
    isExpiring?: boolean
    remain_life?: number
}

interface EquipmentTableProps {
    data: EquipmentListItem[]
    total?: number
    onView: (item: EquipmentListItem) => void
    onEdit: (item: EquipmentListItem) => void
    onDelete?: (item: EquipmentListItem) => void
}

const getExpiryStatus = (remainLife?: number) => {
    if (remainLife === undefined || remainLife === null) return 'ok'
    if (remainLife <= 0) return 'expired'       // หมดอายุแล้ว (remain_life <= 0)
    if (remainLife <= 1) return 'expiring'       // ใกล้หมดอายุ (0 < remain_life <= 1)
    return 'ok'                                  // ปกติ
}

export default function EquipmentTable({ data, total, onView, onEdit, onDelete }: EquipmentTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            {/* Header */}
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
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">หมายเลข</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ชื่ออุปกรณ์</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ประเภท</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">สถานะ</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">สถานที่</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ตรวจสอบล่าสุด</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">วันหมดอายุ</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.map((item) => {
                            // Status Config Logic
                            const statusKey = item.status as keyof typeof EQUIPMENT_STATUS_CONFIG
                            const statusConfig = EQUIPMENT_STATUS_CONFIG[statusKey] || {
                                label: item.status,
                                labelThai: item.status,
                                color: 'gray',
                                bgColor: 'bg-gray-100',
                                textColor: 'text-gray-800'
                            }

                            const expiryStatus = getExpiryStatus(item.remain_life)

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
                                            <span className={`text-sm ${expiryStatus === 'expired' ? 'text-red-600 font-medium' :
                                                expiryStatus === 'expiring' ? 'text-orange-600 font-medium' :
                                                    'text-gray-500'
                                                }`}>
                                                {item.expiry}
                                            </span>

                                            {/* ✅✅ แก้กลับเป็นแบบเดิม (ป้ายข้อความ) ✅✅ */}
                                            {expiryStatus === 'expired' && (
                                                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">หมดอายุ</span>
                                            )}
                                            {expiryStatus === 'expiring' && (
                                                <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">ใกล้หมดอายุ</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => onView(item)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="ดูรายละเอียด">
                                                <HiOutlineEye className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="แก้ไข">
                                                <HiOutlinePencilSquare className="w-4 h-4" />
                                            </button>
                                            {onDelete && (
                                                <button onClick={() => onDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="ลบ">
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