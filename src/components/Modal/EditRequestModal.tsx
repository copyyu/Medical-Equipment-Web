// EditRequestModal.tsx
import { X } from 'lucide-react';
import type { RequestItem } from '../../types/status';


interface EditRequestModalProps {
  request: RequestItem | null;
  onClose: () => void;
  onSave: (request: RequestItem) => void;
}

export default function EditRequestModal({ request, onClose, onSave }: EditRequestModalProps) {
  if (!request) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updatedRequest: RequestItem = {
      ...request,
      requestType: formData.get('requestType') as RequestItem['requestType'],
      status: formData.get('status') as RequestItem['status'],
      assignedTo: formData.get('assignedTo') as string,
      description: formData.get('description') as string,
    };
    
    onSave(updatedRequest);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">แก้ไขคำขอ</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">เลขที่คำขอ</label>
              <input 
                type="text"
                defaultValue={request.requestNumber}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทคำขอ</label>
              <select 
                name="requestType"
                defaultValue={request.requestType}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="repair">แจ้งซ่อม</option>
                <option value="replace">แจ้งเปลี่ยน</option>
                <option value="maintenance">บำรุงรักษา</option>
                <option value="inspection">ตรวจสอบ</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
              <select 
                name="status"
                defaultValue={request.status}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="pending">รอดำเนินการ</option>
                <option value="in-progress">กำลังดำเนินการ</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="rejected">ปฏิเสธ</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">ผู้รับผิดชอบ</label>
              <input 
                type="text"
                name="assignedTo"
                defaultValue={request.assignedTo || ''}
                placeholder="ระบุชื่อผู้รับผิดชอบ"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">รายละเอียดปัญหา</label>
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
              ยกเลิก
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}