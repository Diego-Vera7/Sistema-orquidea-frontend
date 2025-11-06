export default function MetricCard({ title, children }) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
      <div className="text-lg font-semibold text-emerald-900 mb-3">
        {title}
      </div>
      {children}
    </div>
  );
}