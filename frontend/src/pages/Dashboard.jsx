import DashboardLayout from "../Components/layout/DashboardLayout";
import MetricCard from "../Components/cards/MetricCard";
import DeviceStatusCard from "../Components/cards/DeviceStatusCard";
import RecentLogsTable from "../Components/Tables/RecentLogsTable";
import usePzem from "../hooks/usePzem";

export default function Dashboard() {
  const mqttData = usePzem();

  const metrics = [
    {
      title: "Voltage",
      value: mqttData?.voltage ?? 0,
      unit: "V",
    },
    {
      title: "Current",
      value: mqttData?.current ?? 0,
      unit: "A",
    },
    {
      title: "Power",
      value: mqttData?.power ?? 0,
      unit: "W",
    },
    {
      title: "Energy",
      value: mqttData?.energy ?? 0,
      unit: "kWh",
    },
  ];

  return (
    <DashboardLayout>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-6">
        <div className="lg:col-span-2">
          <RecentLogsTable />
        </div>

        <DeviceStatusCard />
      </div>
    </DashboardLayout>
  );
}
