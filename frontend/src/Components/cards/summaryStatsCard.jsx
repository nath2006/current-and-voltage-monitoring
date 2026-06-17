import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Skeleton } from "@/Components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import useSummary from "../../hooks/useSummary";

export default function SummaryStatsCard() {
  const [period, setPeriod] = useState("today");
  const { data, loading } = useSummary(period);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3 space-y-0">
        <CardTitle className="text-base">Ringkasan Pemakaian</CardTitle>

        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="today">Hari Ini</TabsTrigger>
            <TabsTrigger value="week">Minggu</TabsTrigger>
            <TabsTrigger value="month">Bulan</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        {loading || !data ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Stat
              label="Total Energi"
              value={`${data.current.totalEnergyKwh} kWh`}
              change={data.change.totalEnergyKwh}
            />
            <Stat
              label="Durasi Aktif"
              value={formatDuration(data.current.activeDurationSeconds)}
              change={data.change.activeDurationSeconds}
            />
            <Stat label="Rata-rata Power" value={`${data.current.avgPower} W`} />
            <Stat label="Peak Power" value={`${data.current.peakPower} W`} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, change }) {
  const Icon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const color =
    change > 0 ? "text-rose-500" : change < 0 ? "text-emerald-500" : "text-muted-foreground";

  return (
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {typeof change === "number" && (
        <div className={`flex items-center gap-1 text-xs mt-1 ${color}`}>
          <Icon className="h-3 w-3" />
          {Math.abs(change)}% dari periode sebelumnya
        </div>
      )}
    </div>
  );
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}j ${m}m`;
  return `${m}m`;
}
