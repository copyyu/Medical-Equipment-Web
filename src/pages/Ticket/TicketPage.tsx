import { useState } from 'react';

import type { RequestItem } from '../../types/status';
import TicketTable from '../../components/Table/TicketTable';
import FilterBar from '../../components/FilterBar';
import TicketStatCard from '../../components/Status/TicketStatCard';
import ViewRequestModal from '../../components/Modal/ViewRequestModal';
import EditRequestModal from '../../components/Modal/EditRequestModal';
import { mockRequests } from '../../constants/mockData';

export default function TicketPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<RequestItem | null>(null);
  const [editingRequest, setEditingRequest] = useState<RequestItem | null>(null);

  const filteredData = mockRequests.filter((item) => {
    const matchesSearch = 
      item.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || item.requestType === selectedType;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const clearFilters = () => {
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedType !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all' || searchTerm !== '';

  const stats = {
    total: mockRequests.length,
    pending: mockRequests.filter(i => i.status === 'pending').length,
    inProgress: mockRequests.filter(i => i.status === 'in-progress').length,
    completed: mockRequests.filter(i => i.status === 'completed').length,
  };

  const handleSave = (updatedRequest: RequestItem) => {
    console.log('Saving request:', updatedRequest);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Ticket</h1>
        <p className="text-sm text-gray-500">จัดการคำขอจากผู้ใช้ เช่น แจ้งซ่อม แจ้งเปลี่ยน และบำรุงรักษาอุปกรณ์</p>
      </div>
      
      <TicketStatCard
        total={stats.total}
        pending={stats.pending}
        inProgress={stats.inProgress}
        completed={stats.completed}
      />

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

      <TicketTable
        data={filteredData}
        onView={setViewingRequest}
        onEdit={setEditingRequest}
      />

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