import { X } from 'lucide-react';
import { updateTicket } from '../../service/ticketService';
import { ticketStatusConfig, ticketPriorityConfig, type TicketPriority, type TicketStatus } from '../../types/ticket';
import type { RequestItem } from '../../types/status';

interface EditRequestModalProps {
  request: RequestItem | null;
  onClose: () => void;
  onSave: (request: RequestItem) => void;
}

export default function EditRequestModal({ request, onClose, onSave }: EditRequestModalProps) {


  if (!request) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await updateTicket(request.id, {
        status: formData.get('status') as string,
        priority: formData.get('priority') as string,
        description: formData.get('description') as string,
        note: 'Updated from admin panel'
      });

      const updatedRequest: RequestItem = {
        ...request,
        status: formData.get('status') as TicketStatus,
        priority: formData.get('priority') as TicketPriority,
        description: formData.get('description') as string,
      };

      onSave(updatedRequest);
      onClose();
    } catch (error) {
      console.error('Failed to update ticket:', error);
      alert('ไม่สามารถอัพเดท ticket ได้');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Edit Request</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Request Number (disabled) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Request No.</label>
              <input
                type="text"
                value={request.requestNumber}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                disabled
              />
            </div>



            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                defaultValue={request.status}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {(Object.keys(ticketStatusConfig) as TicketStatus[]).map((status) => (
                  <option key={status} value={status}>
                    {ticketStatusConfig[status].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                name="priority"
                defaultValue={request.priority}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {(Object.keys(ticketPriorityConfig) as TicketPriority[]).map((priority) => (
                  <option key={priority} value={priority}>
                    {ticketPriorityConfig[priority].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                defaultValue={request.description}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}