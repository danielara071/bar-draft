import type { PredictionsPageProps } from "../interfaces/interfaces";
import { usePredictions } from "../hooks/Usepredictions";
import WinnerSection from "../components/WinnerSection";
import ScoreSection from "../components/ScoreSection";
import FirstGoalerSection from "../components/FirstGoalsection";
import { TotalGoalsSection, HalftimeSection } from "../components/TotalgoalnHalftime";

export default function PredictionsPage({
  roomCode,
  fixtureId,
  homeTeam,
  awayTeam,
  onSkip,
  onSave,
}: PredictionsPageProps) {
  const {
    form, isLoading, error,
    setWinner, setScoreHome, setScoreAway,
    setFirstGoaler, setTotalGoals, setHalftime,
    handleSave, handleSkip,
  } = usePredictions(undefined, roomCode, fixtureId, onSave);

  return (
    <div className="pred-page">
      <div className="pred-card">

        {/* Header */}
        <div className="pred-header">
          <h1 className="pred-title">Haz tus predicciones</h1>
          <p className="pred-subtitle">
            Antes de unirte, comparte tus predicciones sobre el partido
          </p>
        </div>

        {/* Secciones */}
        <div className="pred-body">
          <WinnerSection
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            value={form.winner}
            onChange={setWinner}
          />

          <div className="pred-divider" />

          <ScoreSection
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            scoreHome={form.scoreHome}
            scoreAway={form.scoreAway}
            onChangeHome={setScoreHome}
            onChangeAway={setScoreAway}
          />

          <div className="pred-divider" />

          <FirstGoalerSection
            value={form.firstGoaler}
            onChange={setFirstGoaler}
          />

          <div className="pred-divider" />

          <TotalGoalsSection
            value={form.totalGoals}
            onChange={setTotalGoals}
          />

          <div className="pred-divider" />

          <HalftimeSection
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            value={form.halftime}
            onChange={setHalftime}
          />
        </div>

        {/* Error */}
        {error && <p className="pred-error">{error}</p>}

        {/* Acciones */}
        <div className="pred-actions">
          <button
            className="pred-btn pred-btn--skip"
            onClick={handleSkip}
            disabled={isLoading}
          >
            Saltar
          </button>
          <button
            className="pred-btn pred-btn--save"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar Predicciones"}
          </button>
        </div>

      </div>
    </div>
  );
}