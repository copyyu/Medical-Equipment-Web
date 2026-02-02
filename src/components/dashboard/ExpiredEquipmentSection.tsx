import { useNavigate } from 'react-router-dom'
import { HiOutlineChevronRight, HiOutlineExclamationCircle } from 'react-icons/hi2'
import { useEquipmentList } from '../../hooks/useEquipmentList'
import type { EquipmentListItem } from '../Table/EquipmentTable' // Import Type ถ้าจำเป็น

// ฟังก์ชันตรวจสอบวันหมดอายุ
const isExpired = (item: EquipmentListItem) => {
    // ถ้ามี field remainLife ส่งมาจาก Backend
    if (typeof item.remain_life !== 'undefined') {
        return item.remain_life <= 0
    }
    // กรณีไม่มีข้อมูล ให้ถือว่าไม่หมดอายุไว้ก่อน
    return false 
}

export default function ExpiredEquipmentSection() {
  const navigate = useNavigate()
  
  // เรียก API ดึงข้อมูลอุปกรณ์ (ดึงมา 50 ตัวเผื่อไว้กรอง)
  const { data: equipment, isLoading } = useEquipmentList({ page: 1, limit: 50 })

  // กรองเฉพาะรายการที่ "หมดอายุ" และตัดมาแค่ 5 รายการแรก
  const expiredList = equipment
    .filter(item => isExpired(item)) 
    .slice(0, 5)

  // Loading State
  if (isLoading) return <div className="h-48 bg-gray-100 rounded-xl animate-pulse mt-6" />

  // ถ้าไม่มีข้อมูลหมดอายุเลย ให้ซ่อน Section นี้ไปเลย
  if (expiredList.length === 0) return null 

  return (
    <div className="bg-white border border-red-100 rounded-2xl shadow-sm overflow-hidden mt-6">
      {/* Header สีแดงอ่อน */}
      <div className="px-6 py-4 border-b border-red-50 bg-red-50/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 text-red-600 rounded-lg">
            <HiOutlineExclamationCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">อุปกรณ์ที่หมดอายุการใช้งาน</h3>
            <p className="text-xs text-red-600 font-medium">ควรดำเนินการจำหน่ายออก หรือตรวจสอบสภาพ</p>
          </div>
        </div>
        <button 
          // ลิงก์ไปหน้ารายการ (คุณอาจต้องเขียน Logic เพิ่มในหน้านั้นให้รับ filter)
          onClick={() => navigate('/equipment')} 
          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-red-100 shadow-sm hover:shadow"
        >
          ดูทั้งหมด <HiOutlineChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Table List */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 font-semibold">รหัส / ชื่ออุปกรณ์</th>
              <th className="px-6 py-3 font-semibold">สถานที่ / แผนก</th>
              <th className="px-6 py-3 text-right font-semibold">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {expiredList.map((item) => (
              <tr key={item.id} className="bg-white border-b border-gray-50 last:border-0 hover:bg-red-50/10 transition-colors">
                <td className="px-6 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{item.name}</span>
                    <span className="text-xs text-gray-400 font-mono">{item.id}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-gray-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {item.location}
                    </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    หมดอายุ
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}