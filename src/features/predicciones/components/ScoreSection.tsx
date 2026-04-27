import type { ScoreSectionProps } from "../interfaces/interfaces";

function ScoreCounter({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div className="pred-score__counter">
      <button
        className="pred-score__btn"
        onClick={() => onChange(value - 1)}
        disabled={value <= 0}
        aria-label="Restar gol"
      >
        −
      </button>
      <span className="pred-score__value">{value}</span>
      <button
        className="pred-score__btn"
        onClick={() => onChange(value + 1)}
        aria-label="Sumar gol"
      >
        +
      </button>
      <span className="pred-score__team">{label}</span>
    </div>
  );
}

export default function ScoreSection({
  homeTeam,
  awayTeam,
  scoreHome,
  scoreAway,
  onChangeHome,
  onChangeAway,
}: ScoreSectionProps) {
  return (
    <div className="pred-section">
      <p className="pred-section__label">
        <span className="pred-section__icon">🎯</span>
        Marcador final
      </p>
      <div className="pred-score">
        <ScoreCounter value={scoreHome} onChange={onChangeHome} label={homeTeam} />
        <span className="pred-score__dash">—</span>
        <ScoreCounter value={scoreAway} onChange={onChangeAway} label={awayTeam} />
      </div>
    </div>
  );
}