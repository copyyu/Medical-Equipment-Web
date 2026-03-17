import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    HiOutlineMagnifyingGlass,
    HiOutlineFunnel,
    HiOutlinePlus,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiOutlineArrowPath,
    HiOutlineExclamationTriangle
} from 'react-icons/hi2'

// Components
import EquipmentTable from '../../components/Table/EquipmentTable'
import type { EquipmentListItem } from '../../types/equipment'
import ViewEquipmentModal from '../../components/Modal/ViewEquipmentModal'
import EditEquipmentModal from '../../components/Modal/EditEquipmentModal'
import DeleteConfirmModal from '../../components/Modal/DeleteConfirmModal'

// Hooks & API
import { useEquipmentList } from '../../hooks/useEquipmentList'
import { fetchCategories, type CategoryOption } from '../../service/equipmentService'
import { STATUS_OPTIONS, EXPIRY_FILTER_OPTIONS } from '../../constants/equipmentOptions'

export default function EquipmentListPage() {
    const navigate = useNavigate()
    const itemsPerPage = 8

    // API Hook
    const {
        data: equipment,
        isLoading,
        error,
        total,
        page: currentPage,
        totalPages,
        refetch,
        setParams
    } = useEquipmentList({ page: 1, limit: itemsPerPage })

    // Search & Filter state
    const [searchTerm, setSearchTerm] = useState('')
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [categoryFilter, setCategoryFilter] = useState<string>('')
    const [expiryFilter, setExpiryFilter] = useState<string>('')
    const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([])

    // Fetch categories from API on mount
    useEffect(() => {
        fetchCategories().then(categories => {
            setCategoryOptions(categories)
        })
    }, [])

    // Modal state
    const [selectedEquipment, setSelectedEquipment] = useState<EquipmentListItem | null>(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    // Update API params when filters change
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setParams({
                page: 1,
                limit: itemsPerPage,
                search: searchTerm || undefined,
                status: statusFilter || undefined,
                expiry_filter: expiryFilter || undefined,
                category_id: categoryFilter || undefined
            })
        }, 300) // Debounce search

        return () => clearTimeout(debounceTimer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, statusFilter, expiryFilter, categoryFilter])

    // Equipment is directly used since backend handles all filtering now
    const filteredEquipment = equipment

    // Page change handler - preserve current search and status filters
    const handlePageChange = (newPage: number) => {
        setParams({
            page: newPage,
            limit: itemsPerPage,
            search: searchTerm || undefined,
            status: statusFilter || undefined,
            expiry_filter: expiryFilter || undefined,
            category_id: categoryFilter || undefined
        })
    }

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
        console.log('Saved:', updatedItem)
        refetch()
    }

    const handleDelete = (item: EquipmentListItem) => {
        setSelectedEquipment(item)
        setIsDeleteModalOpen(true)
    }

    const handleDeleted = () => {
        refetch()
    }

    const handleAddEquipment = () => {
        navigate('/add-equipment')
    }

    // Error state
    if (error && !isLoading) {
        return (
            <div className="p-8">
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="bg-white rounded-2xl border border-red-100 p-8 max-w-md w-full text-center shadow-lg">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HiOutlineExclamationTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">ไม่สามารถโหลดข้อมูลได้</h2>
                        <p className="text-gray-500 text-sm mb-6">{error}</p>
                        <button
                            onClick={refetch}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all"
                        >
                            <HiOutlineArrowPath className="w-4 h-4" />
                            ลองใหม่อีกครั้ง
                        </button>
                    </div>
                </div>
            </div>
        )
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
                            onClick={refetch}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
                        >
                            <HiOutlineArrowPath className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            รีเฟรช
                        </button>
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-white border border-gray-200 rounded-xl">
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
                                <option value="">ทั้งหมด</option>
                                {categoryOptions.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1.5">สถานะอายุ</label>
                            <select
                                value={expiryFilter}
                                onChange={(e) => setExpiryFilter(e.target.value)}
                                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                            >
                                {EXPIRY_FILTER_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-gray-500">
                        <HiOutlineArrowPath className="w-5 h-5 animate-spin" />
                        <span>กำลังโหลดข้อมูล...</span>
                    </div>
                </div>
            )}

            {/* Equipment Table */}
            {!isLoading && (
                <EquipmentTable
                    data={filteredEquipment}
                    total={total}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    แสดง {filteredEquipment.length} จาก {total} รายการ
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isLoading}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <HiOutlineChevronLeft className="w-4 h-4" />
                    </button>
                    {(() => {
                        const maxVisible = 5
                        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
                        let endPage = startPage + maxVisible - 1
                        if (endPage > totalPages) {
                            endPage = totalPages
                            startPage = Math.max(1, endPage - maxVisible + 1)
                        }
                        return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                            const pageNum = startPage + i
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    disabled={isLoading}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                        ? 'bg-emerald-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            )
                        })
                    })()}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0 || isLoading}
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

            <DeleteConfirmModal
                equipment={selectedEquipment}
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDeleted={handleDeleted}
            />
        </div>
    )
}
