export default function MetricCard({
  title,
  value,
  unit,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="text-slate-500">
        {title}
      </h3>

      <div className="mt-3 flex items-end gap-2">
        <span className="text-4xl font-bold">
          {value}
        </span>

        <span className="text-slate-500">
          {unit}
        </span>
      </div>
    </div>
  );
}
