function WhiteLineChart({ data }: { data: { label: string; value: number }[] }) {
  const safeData =
    data && data.length > 0
      ? data
      : [
          { label: "Ene", value: 30 },
          { label: "Feb", value: 45 },
          { label: "Mar", value: 35 },
          { label: "Abr", value: 60 },
        ];

  const max = Math.max(1, ...safeData.map((d) => d.value));
  const width = 400;
  const height = 180;
  const padX = 13;
  const padY = 35; 
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const points = safeData.map((item, idx) => {
    const x = padX + (idx * chartW) / Math.max(1, safeData.length - 1);
    const y = height - padY - (item.value / max) * chartH;
    return { x, y, value: item.value, label: item.label };
  });

  const lineCommand = points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = a[i - 1];
    const cp1x = prev.x + (point.x - prev.x) / 2;
    return `${acc} C ${cp1x},${prev.y} ${cp1x},${point.y} ${point.x},${point.y}`;
  }, "");

  const areaPath = `${lineCommand} L ${points[points.length - 1].x},${height - padY} L ${points[0].x},${height - padY} Z`;

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0A1D3A" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0A1D3A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Guías horizontales sutiles */}
        {[0, 0.5, 1].map((v) => (
          <line
            key={v}
            x1={padX}
            y1={height - padY - v * chartH}
            x2={width - padX}
            y2={height - padY - v * chartH}
            stroke="#f1f5f9"
            strokeWidth="1"
          />
        ))}

        {/* Área sombreada */}
        <path d={areaPath} fill="url(#lineGradient)" />

        {/* Línea principal*/}
        <path
          d={lineCommand}
          fill="none"
          stroke="#0A1D3A"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Puntos de datos */}
        {points.map((p, i) => (
          <g key={i}>
            {/* Círculo exterior*/}
            <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="#0A1D3A" strokeWidth="2" />
            
            {/* Valor numérico*/}
            <text
              x={p.x}
              y={p.y - 14}
              fill="#1e293b"
              fontSize="11"
              fontWeight="700"
              textAnchor="middle"
            >
              {p.value}
            </text>
          </g>
        ))}
      </svg>

      {/* Etiquetas del Eje X */}
      <div className="mt-4 flex justify-between px-1">
        {safeData.map((item, i) => (
          <span key={i} className="text-[11px] font-bold uppercase tracking-tighter text-gray-500">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default WhiteLineChart;