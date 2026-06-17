import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

export default function DeviceStatusCard({ device }) {
  const isOnline = device?.online;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Device Status</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-emerald-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-rose-500" />
          )}

          <Badge variant={isOnline ? "success" : "destructive"}>
            {isOnline ? "ESP32 Online" : "ESP32 Offline"}
          </Badge>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          Last Update:{" "}
          {device?.lastUpdate
            ? new Date(device.lastUpdate).toLocaleTimeString()
            : "-"}
        </p>
      </CardContent>
    </Card>
  );
}
