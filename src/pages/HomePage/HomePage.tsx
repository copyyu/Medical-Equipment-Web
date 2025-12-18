import PharmacyDashboard from "../../components/PharmacyDashboard";
import type { DashboardCard } from "../../types";

export default function HomePage() {
  const dashboardCards: DashboardCard[] = [
    {
      title: "Today's Sales",
      value: "$95.00",
      sub: "+2.5% This Month",
      bg: "bg-lime-200/70",
    },
    {
      title: "Available Categories",
      value: "1.457%",
      sub: "+2.5% This Month",
      bg: "bg-teal-200/70",
    },
    {
      title: "Expired Medicines",
      value: "0.00%",
      sub: "+2.5% This Month",
      bg: "bg-rose-200/70",
    },
    {
      title: "System Users",
      value: "255K",
      sub: "+2.5% This Month",
      bg: "bg-indigo-200/70",
    },
  ];

  return (
    <div className="p-6">
      <PharmacyDashboard cards={dashboardCards} />
    </div>
  );
}
