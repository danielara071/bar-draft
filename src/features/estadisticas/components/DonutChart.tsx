function DonutChart({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const circumference = 2 * Math.PI * 48;
  const stroke = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative w-44 h-44 mx-auto mt-3">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="16"
        />
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="none"
          stroke="white"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={stroke}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-white">
        {clamped}%
      </div>
    </div>
  );
}

export default DonutChart;
