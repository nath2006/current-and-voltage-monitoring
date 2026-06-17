import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Skeleton } from "@/Components/ui/skeleton";
import useEvents from "../../hooks/useEvents";

const STATE_META = {
  idle: { label: "Idle", variant: "secondary" },
  charging_small: { label: "Charging (HP/kecil)", variant: "default" },
  charging_laptop: { label: "Charging Laptop", variant: "warning" },
  multi_device: { label: "Multi Device", variant: "destructive" },
};

export default function UsageEventsLog() {
  const { data, loading } = useEvents(20);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Riwayat Pemakaian</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada riwayat tercatat
          </p>
        ) : (
          <ScrollArea className="max-h-80">
            <ul className="space-y-6">
              {data.map((event) => {
                const meta = STATE_META[event.state] || {
                  label: event.state,
                  variant: "secondary",
                };

                return (
                  <li key={event.id} className="flex items-start justify-between gap-3 text-sm">
                    <div>
                      <Badge variant={meta.variant} className="mb-2">
                        {meta.label}
                      </Badge>
                      <div className="text-muted-foreground">
                        {formatTime(event.startedAt)}
                        {event.endedAt ? ` – ${formatTime(event.endedAt)}` : ""}
                        {event.avgPower
                          ? ` · rata-rata ${Math.round(event.avgPower)}W`
                          : ""}
                      </div>
                    </div>

                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      {event.ongoing ? "Berlangsung" : formatDuration(event.durationSeconds)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

function formatTime(iso) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds) {
  if (!seconds) return "-";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}j ${m}m`;
  return `${m}m`;
}
