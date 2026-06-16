export default function DeviceStatusCard() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold">
        Device Status
      </h3>

      <div className="mt-4 flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>

        <span>
          ESP32 Online
        </span>
      </div>

      <div className="mt-2 text-sm text-slate-500">
        Last Update: 2 sec ago
      </div>
    </div>
  );
}
