import type {
  TotalGoalsSectionProps,
  TotalGoalsOption,
  HalftimeSectionProps,
  HalftimeOption,
} from "../interfaces/interfaces";

// ── Total de goles ────────────────────────────────────────────────────────

const TOTAL_OPTIONS: TotalGoalsOption[] = ["0-1", "2-3", "4-5", "6+"];

export function TotalGoalsSection({ value, onChange }: TotalGoalsSectionProps) {
  return (
    <div className="pred-section">
      <p className="pred-section__label">Total de goles en el partido</p>
      <div className="pred-chips">
        {TOTAL_OPTIONS.map((opt) => (
          <button
            key={opt}
            className={`pred-chip ${value === opt ? "pred-chip--active" : ""}`}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Resultado al medio tiempo ─────────────────────────────────────────────

export function HalftimeSection({ homeTeam, awayTeam, value, onChange }: HalftimeSectionProps) {
  const options: { value: HalftimeOption; label: string }[] = [
    { value: "home", label: `${homeTeam} gana` },
    { value: "draw", label: "Empate" },
    { value: "away", label: `${awayTeam} gana` },
  ];

  return (
    <div className="pred-section">
      <p className="pred-section__label">Resultado al medio tiempo</p>
      <div className="pred-chips">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`pred-chip ${value === opt.value ? "pred-chip--active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}