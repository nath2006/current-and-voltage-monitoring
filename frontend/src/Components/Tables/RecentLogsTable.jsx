import useSocket from "../../hooks/usePzem";

export default function RecentLogsTable() {
  const data = useSocket();

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        Data Monitoring PZEM
      </h2>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Parameter</th>
            <th className="text-left py-2">Value</th>
          </tr>
        </thead>

        <tbody>
  <tr>
    <td>Voltage</td>
    <td>{data?.voltage ?? 0} V</td>
  </tr>

  <tr>
    <td>Current</td>
    <td>{data?.current ?? 0} A</td>
  </tr>

  <tr>
    <td>Power</td>
    <td>{data?.power ?? 0} W</td>
  </tr>

  <tr>
    <td>Energy</td>
    <td>{data?.energy ?? 0} kWh</td>
  </tr>

  <tr>
    <td>Frequency</td>
    <td>{data?.frequency ?? 0} Hz</td>
  </tr>

  <tr>
    <td>PF</td>
    <td>{data?.pf ?? 0}</td>
  </tr>
</tbody>
      </table>
    </div>
  );
}
