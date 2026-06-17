import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Skeleton } from "@/Components/ui/skeleton";
import useHistory from "../../hooks/useHistory";

export default function EnergyTrendChart() {
  const [range, setRange] = useState("day");
  const { data, loading } = useHistory(range);

  const chartData = formatChartData(data, range);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3 space-y-0">
        <CardTitle className="text-base">Tren Konsumsi</CardTitle>

        <Tabs value={range} onValueChange={setRange}>
          <TabsList>
            <TabsTrigger value="day">24 Jam</TabsTrigger>
            <TabsTrigger value="week">7 Hari</TabsTrigger>
            <TabsTrigger value="month">30 Hari</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        <div className="h-72">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Belum ada data untuk rentang ini
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--popover-foreground))",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function formatChartData(data, range) {
  if (range === "day") {
    return data.map((d) => ({
      label: new Date(d.timestamp).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: d.power,
    }));
  }

  return data.map((d) => ({
    label: new Date(d.date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
    }),
    value: d.totalEnergyKwh,
  }));
}
