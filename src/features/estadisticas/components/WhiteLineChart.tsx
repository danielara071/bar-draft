function WhiteLineChart({ data }: { data: { label: string; value: number }[] }) {
  const safeData =
    data.length > 0
      ? data
      : [
          { label: "N/A", value: 0 },
          { label: "N/A", value: 0 },
          { label: "N/A", value: 0 },
          { label: "N/A", value: 0 },
        ];

  const max = Math.max(1, ...safeData.map((d) => d.value));
  const width = 320;
  const height = 130;
  const padX = 18;
  const padY = 14;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const points = safeData.map((item, idx) => {
    const x = padX + (idx * chartW) / Math.max(1, safeData.length - 1);
    const y = height - padY - (item.value / max) * chartH;
    return { x, y, value: item.value, label: item.label };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="mt-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32 overflow-visible">
        <line
          x1={padX}
          y1={height - padY}
          x2={width - padX}
          y2={height - padY}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1"
        />
        <line
          x1={padX}
          y1={padY}
          x2={padX}
          y2={height - padY}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1"
        />
        <polyline fill="none" stroke="white" strokeWidth="3" points={polyline} />
        {points.map((p) => (
          <g key={`${p.label}-${p.x}`}>
            <circle cx={p.x} cy={p.y} r="4.2" fill="white" />
            <text
              x={p.x}
              y={p.y - 9}
              fill="white"
              fontSize="20"
              textAnchor="middle"
              className="font-semibold"
            >
              {p.value}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-1 flex justify-center gap-18 px-1">
        {safeData.map((item) => (
          <span key={item.label} className="text-[110px] md:text-xs text-white/90">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default WhiteLineChart;
