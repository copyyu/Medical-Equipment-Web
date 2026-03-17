import { useEffect, useCallback } from 'react'
import {
    HiOutlineMagnifyingGlass,
    HiOutlineFunnel,
    HiOutlineArrowPath,
    HiOutlineArrowRight,
    HiOutlineXMark,
    HiOutlineDocumentArrowDown,
    HiOutlineClipboardDocumentList,
} from 'react-icons/hi2'
import { useActivityLogStore } from '../../stores/activityLogStore'
import { exportLogsToCSV, fetchActivityLogs } from '../../service/activityLogService'
import { ticketStatusConfig, type TicketStatus } from '../../types/ticket'
import Pagination from '../../components/Pagination/Pagination'

// Ticket Status badge component
function StatusBadge({ status }: { status: string }) {
    const config = ticketStatusConfig[status as TicketStatus]
    if (!config) {
        return <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-600">{status}</span>
    }
    return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${config.bgColor} ${config.color}`}>
            {config.labelThai}
        </span>
    )
}



export default function ActivityLogPage() {
    const {
        logs,
        total,
        page,
        totalPages,
        isLoading,
        filters,
        fetchLogs,
        setFilter,
        clearFilters,
        setPage,
    } = useActivityLogStore()

    // โหลดข้อมูลเมื่อเปิดหน้า หรือ filter เปลี่ยน
    const loadData = useCallback(() => {
        fetchLogs(filters)
    }, [fetchLogs, filters])

    useEffect(() => {
        loadData()
    }, [loadData])

    const hasActiveFilters = filters.search || filters.fromStatus || filters.toStatus || filters.startDate || filters.endDate

    // Export CSV
    const handleExport = async () => {
        const result = await fetchActivityLogs({
            ...filters,
            page: 1,
            limit: 99999,
        })
        exportLogsToCSV(result.logs)
    }

    // Format datetime
    const formatDateTime = (iso: string) => {
        const d = new Date(iso)
        return d.toLocaleString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    // Ticket status options for filter
    const ticketStatusOptions = Object.entries(ticketStatusConfig).map(([key, val]) => ({
        value: key,
        label: `${val.label} (${val.labelThai})`
    }))

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
                            <HiOutlineClipboardDocumentList className="w-5 h-5 text-white" />
                        </div>
                        บันทึกการเปลี่ยนสถานะ Ticket
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 ml-[52px]">
                        ติดตามทุกการเปลี่ยนแปลงสถานะของ Ticket
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={loadData}
                        className="px-3 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                        <HiOutlineArrowPath className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        รีเฟรช
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={logs.length === 0}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-primary rounded-xl hover:shadow-lg hover:shadow-accent-500/25 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <HiOutlineDocumentArrowDown className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>



            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                    <HiOutlineFunnel className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">ตัวกรอง</span>
                    {hasActiveFilters && (
                        <button
                            onClick={() => { clearFilters(); fetchLogs({}); }}
                            className="ml-auto text-xs text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                        >
                            <HiOutlineXMark className="w-3.5 h-3.5" />
                            ล้างตัวกรอง
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* Search */}
                    <div className="relative lg:col-span-1">
                        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ค้นหา Ticket / อุปกรณ์ / ผู้ใช้..."
                            value={filters.search || ''}
                            onChange={e => setFilter('search', e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* From Status */}
                    <select
                        value={filters.fromStatus || ''}
                        onChange={e => setFilter('fromStatus', e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 appearance-none cursor-pointer transition-all"
                    >
                        <option value="">สถานะเดิม (ทั้งหมด)</option>
                        {ticketStatusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    {/* To Status */}
                    <select
                        value={filters.toStatus || ''}
                        onChange={e => setFilter('toStatus', e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 appearance-none cursor-pointer transition-all"
                    >
                        <option value="">สถานะใหม่ (ทั้งหมด)</option>
                        {ticketStatusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    {/* Start Date */}
                    <input
                        type="date"
                        value={filters.startDate || ''}
                        onChange={e => setFilter('startDate', e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
                        placeholder="วันที่เริ่ม"
                    />

                    {/* End Date */}
                    <input
                        type="date"
                        value={filters.endDate || ''}
                        onChange={e => setFilter('endDate', e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
                        placeholder="วันที่สิ้นสุด"
                    />
                </div>
            </div>

            {/* Log Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Table Header Info */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        ทั้งหมด <span className="font-semibold text-gray-900">{total}</span> รายการ
                    </p>
                    {totalPages > 1 && (
                        <p className="text-xs text-gray-400">
                            หน้า {page} / {totalPages}
                        </p>
                    )}
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex items-center justify-center py-16">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm text-gray-500">กำลังโหลด...</span>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && logs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                            <HiOutlineClipboardDocumentList className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">ไม่พบรายการ</h3>
                        <p className="text-sm text-gray-400">
                            {hasActiveFilters
                                ? 'ลองเปลี่ยนตัวกรองหรือล้างตัวกรอง'
                                : 'ยังไม่มีบันทึกการเปลี่ยนสถานะ Ticket จะเริ่มบันทึกเมื่อคุณเปลี่ยนสถานะ Ticket'}
                        </p>
                    </div>
                )}

                {/* Table */}
                {!isLoading && logs.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/80">
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">วันเวลา</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">ผู้ดำเนินการ</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">อุปกรณ์</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">การเปลี่ยนสถานะ</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">หมายเหตุ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {logs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        {/* Date/Time */}
                                        <td className="px-5 py-4">
                                            <div className="text-sm text-gray-900 font-medium">{formatDateTime(log.changedAt)}</div>
                                        </td>

                                        {/* User */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs font-bold text-white">
                                                        {log.userName.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{log.userName}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Ticket */}
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="text-sm font-semibold text-accent-600">{log.ticketNo}</p>
                                            </div>
                                        </td>

                                        {/* Equipment */}
                                        <td className="px-5 py-4">
                                            <p className="text-sm text-gray-700">{log.equipmentName}</p>
                                        </td>

                                        {/* Status Change */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <StatusBadge status={log.fromStatus} />
                                                <HiOutlineArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <StatusBadge status={log.toStatus} />
                                            </div>
                                        </td>

                                        {/* Note */}
                                        <td className="px-5 py-4">
                                            <p className="text-sm text-gray-500 max-w-[200px] truncate">
                                                {log.note || '-'}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-5 py-4 border-t border-gray-100">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(newPage) => { setPage(newPage); fetchLogs({ ...filters, page: newPage }); }}
                            disabled={isLoading}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
