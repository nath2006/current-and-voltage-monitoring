import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { Zap, Activity, Gauge, BatteryCharging } from "lucide-react";

const ICONS = {
  Voltage: Zap,
  Current: Activity,
  Power: Gauge,
  Energy: BatteryCharging,
};

export default function MetricCard({ title, value, unit }) {
  const Icon = ICONS[title] || Zap;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-1.5">
          <span className="text-3xl font-bold tracking-tight">{value}</span>
          <span className="text-muted-foreground text-sm pb-1">{unit}</span>
        </div>
      </CardContent>
    </Card>
  );
}
