import type { WinnerSectionProps, WinnerOption } from "../interfaces/interfaces";

const OPTIONS: { value: WinnerOption; label: string }[] = [
  { value: "home", label: "" },    // se rellena dinámicamente
  { value: "draw", label: "Empate" },
  { value: "away", label: "" },
];

export default function WinnerSection({ homeTeam, awayTeam, value, onChange }: WinnerSectionProps) {
  const options = [
    { value: "home" as WinnerOption, label: homeTeam },
    { value: "draw" as WinnerOption, label: "Empate" },
    { value: "away" as WinnerOption, label: awayTeam },
  ];

  return (
    <div className="pred-section">
      <p className="pred-section__label">
        <span className="pred-section__icon">🏆</span>
        ¿Quién ganará?
      </p>
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