type AttemptBarProps = {
  label: string;
  value: number;
  total: number;
  max: number;
};

export default function AttemptBar({ label, value, total, max }: AttemptBarProps) {
  const barWidth = max > 0 ? (value / max) * 100 : 0;
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
  const isX = label === "X";

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-bold w-4 text-right ${isX ? "text-brand-crimson" : "text-brand-navy"}`}>
        {label}
      </span>

      <div className="flex-1 bg-zinc-100 rounded-full h-7 relative">
        <div
          className={`${isX ? "bg-brand-crimson" : "bg-brand-navy"} h-7 rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
          style={{ width: `${barWidth}%`, minWidth: value > 0 ? "2rem" : "0" }}
        >
          {value > 0 && (
            <span className="text-white text-xs font-semibold">{value}</span>
          )}
        </div>
      </div>

      <span className="text-xs text-zinc-400 w-10 text-right">{percentage}%</span>
    </div>
  );
}