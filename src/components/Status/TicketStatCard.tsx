import { FileText, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { ticketStatusConfig } from '../../types/ticket';
import type { TicketStats, TicketStatus } from '../../types/ticket';

interface StatsCardsProps {
  stats: TicketStats;
}

export default function TicketStatCard({ stats }: StatsCardsProps) {
  const getIcon = (status: TicketStatus) => {
    switch (status) {
      case 'in_process': return AlertCircle;
      case 'return_equipment_back': return CheckCircle;
      case 'send_to_outsource': return Clock;
      default: return FileText;
    }
  };

  const statusKeys: TicketStatus[] = ['in_process', 'return_equipment_back', 'send_to_outsource'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-white/90">Total</p>
          <FileText className="w-5 h-5" />
        </div>
        <p className="text-3xl font-bold">{stats.total}</p>
        <p className="text-sm text-white/80 mt-1">Requests</p>
      </div>

      {statusKeys.map((status) => {
        const config = ticketStatusConfig[status];
        const Icon = getIcon(status);
        let count = 0;
        let gradient = '';

        if (status === 'in_process') {
          count = stats.inProcess;
          gradient = 'from-blue-500 to-blue-600';
        } else if (status === 'return_equipment_back') {
          count = stats.completed;
          gradient = 'from-teal-500 to-teal-600';
        } else if (status === 'send_to_outsource') {
          count = stats.sendToOutsource;
          gradient = 'from-yellow-500 to-amber-600';
        }

        return (
          <div key={status} className={`bg-gradient-to-br ${gradient} rounded-xl p-6 text-white shadow-lg`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/90">{config.label}</p>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">{count}</p>
            <p className="text-sm text-white/80 mt-1">Requests</p>
          </div>
        );
      })}
    </div>
  );
}
