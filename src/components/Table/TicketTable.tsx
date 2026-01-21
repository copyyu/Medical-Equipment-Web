import { Search, Edit, Trash2, FileText, Calendar, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { requestTypeConfig, statusConfig, type RequestItem } from '../../types/status';

interface RequestTableProps {
  data: RequestItem[];
  onView: (item: RequestItem) => void;
  onEdit: (item: RequestItem) => void;
  onDelete?: (item: RequestItem) => void;
}

export default function TicketTable({ data, onView, onEdit, onDelete }: RequestTableProps) {
  const getStatusIcon = (status: RequestItem['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'in-progress': return AlertCircle;
      case 'completed': return CheckCircle;
      case 'rejected': return XCircle;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">
          พบ <span className="font-semibold text-gray-900">{data.length}</span> คำขอ
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                เลขที่คำขอ
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ประเภท
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                อุปกรณ์
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ผู้แจ้ง
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                วันที่แจ้ง
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                สถานะ
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ผู้รับผิดชอบ
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                การดำเนินการ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item) => {
              const StatusIcon = getStatusIcon(item.status);
              
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {item.requestNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-md text-xs font-medium ${requestTypeConfig[item.requestType].color} flex items-center gap-1 w-fit`}>
                      <span>{requestTypeConfig[item.requestType].label}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.equipmentName}</p>
                      <p className="text-xs text-gray-500">{item.equipmentSerial}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{item.requesterName}</p>
                      <p className="text-xs text-gray-500">{item.department}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {item.requestDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-md text-xs font-medium ${statusConfig[item.status].color} flex items-center gap-1 w-fit`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{statusConfig[item.status].label}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {item.assignedTo || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onView(item)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                        title="ดูรายละเอียด"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onEdit(item)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" 
                        title="แก้ไข"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(item)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium mb-1">ไม่พบข้อมูล</p>
          <p className="text-sm text-gray-400">ลองค้นหาด้วยคำอื่น หรือล้างตัวกรอง</p>
        </div>
      )}
    </div>
  );
}