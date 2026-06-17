import DashboardLayout from "../Components/layout/DashboardLayout";
import MetricCard from "../Components/cards/MetricCard";
import DeviceStatusCard from "../Components/cards/DeviceStatusCard";
import SummaryStatsCard from "../Components/cards/SummaryStatsCard";
import CostEstimateCard from "../Components/cards/CostEstimateCard";
import RecentLogsTable from "../Components/tables/RecentLogsTable";
import UsageEventsLog from "../Components/tables/UsageEventsLog";
import EnergyTrendChart from "../Components/charts/EnergyTrendChart";
import UsageHeatmap from "../Components/charts/UsageHeatmap";
import usePzem from "../hooks/usePzem";

export default function Dashboard() {
  const { data, device } = usePzem();

  const metrics = [
    { title: "Voltage", value: data?.voltage ?? 0, unit: "V" },
    { title: "Current", value: data?.current ?? 0, unit: "A" },
    { title: "Power", value: data?.power ?? 0, unit: "W" },
    { title: "Energy", value: data?.energy ?? 0, unit: "kWh" },
  ];

  return (
    <DashboardLayout>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        {metrics.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-6">
        <div className="lg:col-span-2">
          <RecentLogsTable />
        </div>

        <DeviceStatusCard device={device} />
      </div>

      <div className="mt-6">
        <EnergyTrendChart />
      </div>

      <div className="mt-6">
        <UsageHeatmap />
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mt-6">
        <SummaryStatsCard />
        <CostEstimateCard />
      </div>

      <div className="mt-6">
        <UsageEventsLog />
      </div>
    </DashboardLayout>
  );
}
