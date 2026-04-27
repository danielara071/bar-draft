import type { FirstGoalerSectionProps } from "../interfaces/interfaces";

export default function FirstGoalerSection({ value, onChange }: FirstGoalerSectionProps) {
  return (
    <div className="pred-section">
      <p className="pred-section__label">
        <span className="pred-section__icon">⭐</span>
        Primer gol de...
      </p>
      <input
        className="pred-input"
        type="text"
        placeholder="Nombre del jugador"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={60}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}