// StatsCards.tsx
import { FileText, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface StatsCardsProps {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export default function TicketStatCard({ total, pending, inProgress, completed }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-emerald-100">ทั้งหมด</p>
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>
        <p className="text-3xl font-bold">{total}</p>
        <p className="text-sm text-emerald-100 mt-1">คำขอ</p>
      </div>

      <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-yellow-100">รอดำเนินการ</p>
          <Clock className="w-5 h-5" />
        </div>
        <p className="text-3xl font-bold">{pending}</p>
        <p className="text-sm text-yellow-100 mt-1">คำขอ</p>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-blue-100">กำลังดำเนินการ</p>
          <AlertCircle className="w-5 h-5" />
        </div>
        <p className="text-3xl font-bold">{inProgress}</p>
        <p className="text-sm text-blue-100 mt-1">คำขอ</p>
      </div>

      <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-teal-100">เสร็จสิ้น</p>
          <CheckCircle className="w-5 h-5" />
        </div>
        <p className="text-3xl font-bold">{completed}</p>
        <p className="text-sm text-teal-100 mt-1">คำขอ</p>
      </div>
    </div>
  );
}