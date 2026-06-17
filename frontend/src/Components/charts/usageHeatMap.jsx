import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import useHeatmap from "../../hooks/useHeatmap";

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Senin..Minggu
const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export default function UsageHeatmap() {
  const { data, loading } = useHeatmap(4);

  const grid = buildGrid(data);
  const maxPower = Math.max(1, ...data.map((d) => d.avgPower));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Pola Jam Pemakaian (4 Minggu Terakhir)
        </CardTitle>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {loading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 text-[10px] text-muted-foreground mb-1">
              <div />
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} className="text-center">
                  {h % 3 === 0 ? h : ""}
                </div>
              ))}
            </div>

            {DAY_ORDER.map((dayIdx, rowIdx) => (
              <div
                key={dayIdx}
                className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 mb-1"
              >
                <div className="text-xs text-muted-foreground flex items-center">
                  {DAY_LABELS[rowIdx]}
                </div>

                {Array.from({ length: 24 }, (_, hour) => {
                  const cell = grid[dayIdx]?.[hour];
                  const intensity = cell ? cell.avgPower / maxPower : 0;

                  return (
                    <div
                      key={hour}
                      title={`${DAY_LABELS[rowIdx]} ${hour}:00 — ${cell?.avgPower ?? 0}W`}
                      className="aspect-square rounded-sm"
                      style={{ backgroundColor: intensityToColor(intensity) }}
                    />
                  );
                })}
              </div>
            ))}

            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <span>Sepi</span>
              <div className="flex gap-1">
                {[0, 0.25, 0.5, 0.75, 1].map((v) => (
                  <div
                    key={v}
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: intensityToColor(v) }}
                  />
                ))}
              </div>
              <span>Ramai</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function buildGrid(data) {
  const grid = {};
  for (const item of data) {
    if (!grid[item.day]) grid[item.day] = {};
    grid[item.day][item.hour] = item;
  }
  return grid;
}

function intensityToColor(intensity) {
  if (intensity === 0) return "hsl(var(--muted))";
  const lightness = 85 - intensity * 55;
  return `hsl(222, 47%, ${lightness}%)`;
}
