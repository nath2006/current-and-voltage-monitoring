import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Skeleton } from "@/Components/ui/skeleton";
import useCostEstimate from "../../hooks/useCostEstimate";

export default function CostEstimateCard() {
  const [period, setPeriod] = useState("month");
  const { data, loading } = useCostEstimate(period);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3 space-y-0">
        <CardTitle className="text-base">Estimasi Biaya Listrik</CardTitle>

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
          <Skeleton className="h-20 w-full" />
        ) : (
          <div>
            <div className="text-3xl font-bold tracking-tight">
              Rp {formatRupiah(data.estimatedCost)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {data.currentEnergyKwh} kWh × Rp {formatRupiah(data.tariffPerKwh)}/kWh
            </p>
            <p className="text-xs text-muted-foreground mt-3">{data.note}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value);
}
