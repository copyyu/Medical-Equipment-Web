import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import type { RequestItem } from '../../types/ticket';
import type { TicketListItem, TicketType, TicketStats } from '../../types/ticket';
import TicketTable from '../../components/Table/TicketTable';
import FilterBar from '../../components/filter/FilterBar';
import TicketStatCard from '../../components/Status/TicketStatCard';
import ViewRequestModal from '../../components/Modal/ViewRequestModal';
import EditRequestModal from '../../components/Modal/EditRequestModal';
import Pagination from '../../components/Pagination/Pagination';
import { fetchTicketList, fetchTicketStats } from '../../service/ticketService';

export default function TicketPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<RequestItem | null>(null);
  const [editingRequest, setEditingRequest] = useState<RequestItem | null>(null);

  // API State
  const [tickets, setTickets] = useState<TicketListItem[]>([]);

  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    inProcess: 0,
    completed: 0,
    sendToOutsource: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  // Fetch tickets from API
  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchTicketList({
        page,
        limit: 10,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        priority: selectedPriority !== 'all' ? selectedPriority : undefined,
        search: searchTerm || undefined,
        sort_by: 'created_at',
        sort_dir: 'desc'
      });

      setTickets(result.data);

      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [page, selectedStatus, selectedPriority, searchTerm]);

  // Fetch stats from API
  const loadStats = async () => {
    try {
      const result = await fetchTicketStats();
      setStats(result);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Convert TicketListItem to RequestItem for compatibility with existing components
  const convertToRequestItem = (ticket: TicketListItem): RequestItem => {
    // Format date to Thai format
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const catId = ticket.categoryId;

    return {
      id: ticket.id.toString(),
      requestNumber: ticket.ticketNo,
      equipmentName: ticket.equipmentName || 'N/A',
      equipmentSerial: ticket.equipmentIdCode || '-',
      requesterName: ticket.reporterName,
      department: ticket.departmentName || '-',
      description: ticket.description || '',
      requestType: getTicketType(ticket.categoryName),
      categoryId: catId,
      requestDate: formatDate(ticket.reportedAt),
      status: ticket.status,
      priority: ticket.priority,
      assignedTo: '-',
      createdAt: ticket.createdAt,
      updatedAt: ticket.createdAt,
    };
  };

  const getTicketType = (categoryName: string): TicketType => {
    if (!categoryName) return 'other';
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('ซ่อม') || lowerName === 'repair') return 'repair';
    if (lowerName.includes('บำรุง') || lowerName === 'maintenance') return 'maintenance';
    if (lowerName.includes('สอบถาม') || lowerName.includes('ใช้งาน') || lowerName === 'inspection') return 'inspection';
    return 'other';
  };


  const filteredData = tickets.map(convertToRequestItem);

  const clearFilters = () => {
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSearchTerm('');
    setPage(1);
  };

  const hasActiveFilters = selectedType !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all' || searchTerm !== '';
  const handleSave = async (updatedRequest: RequestItem) => {
    console.log('handleSave called with:', updatedRequest);
    // EditRequestModal already calls updateTicket API, so we just refresh data here
    toast.success(`Ticket updated successfully`);
    loadTickets();
    loadStats();
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Ticket</h1>
        <p className="text-sm text-gray-500">จัดการคำขอจากผู้ใช้ เช่น แจ้งซ่อม แจ้งเปลี่ยน และบำรุงรักษาอุปกรณ์</p>
      </div>

      <TicketStatCard stats={stats} />

      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
      />

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-semibold">เกิดข้อผิดพลาด</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <TicketTable
            data={filteredData}
            onView={setViewingRequest}
            onEdit={setEditingRequest}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              disabled={loading}
            />
          )}
        </>
      )}

      <ViewRequestModal
        request={viewingRequest}
        onClose={() => setViewingRequest(null)}
        onEdit={setEditingRequest}
      />

      <EditRequestModal
        request={editingRequest}
        onClose={() => setEditingRequest(null)}
        onSave={handleSave}
      />
    </div>
  );
}
