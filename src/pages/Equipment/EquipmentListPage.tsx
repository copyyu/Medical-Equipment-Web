import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    HiOutlineMagnifyingGlass,
    HiOutlineFunnel,
    HiOutlinePlus,
    HiOutlineChevronLeft,
    HiOutlineChevronRight
} from 'react-icons/hi2'

// Components
import EquipmentTable, { type EquipmentListItem } from '../../components/Table/EquipmentTable'
import ViewEquipmentModal from '../../components/Modal/ViewEquipmentModal'
import EditEquipmentModal from '../../components/Modal/EditEquipmentModal'

// Mock data & configs
import { mockEquipment } from '../../constants/mockData'
import { EQUIPMENT_STATUS_CONFIG } from '../../types/equipment'

// Filter options
const STATUS_OPTIONS = [
    { value: 'ทั้งหมด', label: 'ทั้งหมด' },
    { value: 'พร้อมใช้', label: 'พร้อมใช้' },
    { value: 'กำลังใช้งาน', label: 'กำลังใช้งาน' },
    { value: 'อุปกรณ์ชำรุด', label: 'อุปกรณ์ชำรุด' },
    { value: 'ชำรุด', label: 'ชำรุด' },
    { value: 'หมดอายุ', label: 'หมดอายุ' }
]

const CATEGORY_OPTIONS = [
    'ทั้งหมด',
    'อุปกรณ์ทางการแพทย์',
    'เครื่องปรับอากาศ',
    'เครื่องมือแพทย์การแพทย์'
]

export default function EquipmentListPage() {
    const navigate = useNavigate()

    // Data state
    // TODO: เชื่อม API - ใช้ useEffect เพื่อ fetch ข้อมูลจาก API
    const [equipment, setEquipment] = useState<EquipmentListItem[]>(mockEquipment)

    // Search & Filter state
    const [searchTerm, setSearchTerm] = useState('')
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string>('ทั้งหมด')
    const [categoryFilter, setCategoryFilter] = useState<string>('ทั้งหมด')

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    // Modal state
    const [selectedEquipment, setSelectedEquipment] = useState<EquipmentListItem | null>(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Filter equipment based on search and filters
    const filteredEquipment = equipment.filter(item => {
        const matchesSearch =
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'ทั้งหมด' || EQUIPMENT_STATUS_CONFIG[item.status].label === statusFilter
        const matchesCategory = categoryFilter === 'ทั้งหมด' || item.category === categoryFilter

        return matchesSearch && matchesStatus && matchesCategory
    })

    // Pagination
    const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage)
    const paginatedEquipment = filteredEquipment.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    // Handlers
    const handleView = (item: EquipmentListItem) => {
        setSelectedEquipment(item)
        setIsViewModalOpen(true)
    }

    const handleEdit = (item: EquipmentListItem) => {
        setSelectedEquipment(item)
        setIsEditModalOpen(true)
    }

    const handleViewToEdit = () => {
        setIsViewModalOpen(false)
        setIsEditModalOpen(true)
    }

    const handleSaveEdit = (updatedItem: EquipmentListItem) => {
        // TODO: เชื่อม API - อัพเดทข้อมูลอุปกรณ์
        // const updateEquipment = async () => {
        //   await fetch(`/api/equipment/${updatedItem.id}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(updatedItem)
        //   })
        // }
        setEquipment(prev =>
            prev.map(item => item.id === updatedItem.id ? updatedItem : item)
        )
    }

    const handleDelete = (item: EquipmentListItem) => {
        // TODO: เชื่อม API - ลบข้อมูลอุปกรณ์
        // const deleteEquipment = async () => {
        //   await fetch(`/api/equipment/${item.id}`, { method: 'DELETE' })
        // }
        if (confirm(`ต้องการลบอุปกรณ์ ${item.name} (${item.id}) หรือไม่?`)) {
            setEquipment(prev => prev.filter(eq => eq.id !== item.id))
        }
    }

    const handleAddEquipment = () => {
        navigate('/add-equipment')
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">รายการอุปกรณ์</h1>
                <p className="text-sm text-gray-500">จัดการและติดตามอุปกรณ์ทางการแพทย์ทั้งหมด</p>
            </div>

            {/* Search and Actions */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาอุปกรณ์, หมายเลข, ประเภท, สถานที่..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm ${isFilterOpen
                                ? 'bg-emerald-600 text-white border border-emerald-600'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <HiOutlineFunnel className="w-4 h-4" />
                            ตัวกรอง
                        </button>
                        <button
                            onClick={handleAddEquipment}
                            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all"
                        >
                            <HiOutlinePlus className="w-4 h-4" />
                            เพิ่มอุปกรณ์
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {isFilterOpen && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1.5">สถานะ</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                            >
                                {STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1.5">ประเภทอุปกรณ์</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                            >
                                {CATEGORY_OPTIONS.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Equipment Table */}
            <EquipmentTable
                data={paginatedEquipment}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    แสดง {paginatedEquipment.length} จาก {filteredEquipment.length} รายการ
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <HiOutlineChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                ? 'bg-emerald-500 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <HiOutlineChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Modals */}
            <ViewEquipmentModal
                equipment={selectedEquipment}
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                onEdit={handleViewToEdit}
            />

            <EditEquipmentModal
                equipment={selectedEquipment}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveEdit}
            />
        </div>
    )
}
