export default function DeviceStatusCard({ device }) {
  const isOnline = device?.online;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold">Device Status</h3>

      <div className="mt-4 flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        />

        <span>{isOnline ? "ESP32 Online" : "ESP32 Offline"}</span>
      </div>

      <div className="mt-2 text-sm text-slate-500">
        Last Update:{" "}
        {device?.lastUpdate
          ? new Date(device.lastUpdate).toLocaleTimeString()
          : "-"}
      </div>
    </div>
  );
}
