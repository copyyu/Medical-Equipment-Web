import { MoreHorizontal } from "lucide-react";
import type { DashboardCard } from "../types";
type Props = {
  cards: DashboardCard[];
};

export default function PharmacyDashboard({ cards }: Props) {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Total Report</h1>
        <button className="text-sm bg-white px-3 py-1 rounded-full shadow">
          This Month
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div
            key={i}
            className={`rounded-2xl shadow-sm p-5 ${c.bg}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">{c.title}</p>
              <MoreHorizontal className="w-4 h-4 opacity-60" />
            </div>

            <div className="mt-4">
              <p className="text-3xl font-bold">{c.value}</p>
              <p className="text-xs text-green-600 mt-1">{c.sub}</p>
            </div>

            <div className="mt-4 h-12 bg-black/10 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
