import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import usePzem from "../../hooks/usePzem";

export default function RecentLogsTable() {
  const { data } = usePzem();

  const rows = [
    { label: "Voltage", value: data?.voltage ?? 0, unit: "V" },
    { label: "Current", value: data?.current ?? 0, unit: "A" },
    { label: "Power", value: data?.power ?? 0, unit: "W" },
    { label: "Energy", value: data?.energy ?? 0, unit: "kWh" },
    { label: "Frequency", value: data?.frequency ?? 0, unit: "Hz" },
    { label: "PF", value: data?.pf ?? 0, unit: "" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Data Monitoring PZEM</CardTitle>
      </CardHeader>

      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="py-2 font-medium">Parameter</th>
              <th className="py-2 font-medium">Value</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b last:border-0">
                <td className="py-2.5">{row.label}</td>
                <td className="py-2.5 font-medium">
                  {row.value} {row.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
