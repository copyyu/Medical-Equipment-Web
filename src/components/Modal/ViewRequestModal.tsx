import { X } from 'lucide-react';
import type { RequestItem } from '../../types/status';
import { ticketStatusConfig, ticketTypeConfig, ticketPriorityConfig, type TicketType, type TicketStatus, type TicketPriority } from '../../types/ticket';

interface ViewRequestModalProps {
  request: RequestItem | null;
  onClose: () => void;
  onEdit: (request: RequestItem) => void;
}

export default function ViewRequestModal({ request, onClose, onEdit }: ViewRequestModalProps) {
  if (!request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Content */}
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">รายละเอียดคำขอ</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">เลขที่คำขอ</label>
              <p className="text-lg font-semibold text-gray-900">{request.requestNumber}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">ประเภทคำขอ</label>
              <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${ticketTypeConfig[request.requestType as TicketType]?.color || 'bg-gray-100'}`}>
                {ticketTypeConfig[request.requestType as TicketType]?.label || request.requestType}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">อุปกรณ์</label>
              <p className="text-gray-900 font-medium">{request.equipmentName}</p>
              <p className="text-sm text-gray-500">{request.equipmentSerial}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">ผู้แจ้ง</label>
              <p className="text-gray-900">{request.requesterName}</p>
              <p className="text-sm text-gray-500">{request.department}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">วันที่แจ้ง</label>
              <p className="text-gray-900">{request.requestDate}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">สถานะ</label>
              <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${ticketStatusConfig[request.status as TicketStatus]?.color}`}>
                {ticketStatusConfig[request.status as TicketStatus]?.label}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">ความสำคัญ</label>
              <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${ticketPriorityConfig[request.priority as TicketPriority]?.color}`}>
                {ticketPriorityConfig[request.priority as TicketPriority]?.label}
              </span>
            </div>

            {request.completedDate && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">วันที่เสร็จสิ้น</label>
                <p className="text-gray-900">{request.completedDate}</p>
              </div>
            )}

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">รายละเอียดปัญหา</label>
              <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{request.description}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ปิด
            </button>
            <button
              onClick={() => {
                onEdit(request);
                onClose();
              }}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              แก้ไข
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}