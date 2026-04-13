import type { MouseEvent } from "react";
import type { WatchPartyModalProps, Privacy } from "../interfaces/index.interfaces";
import { useWatchPartyModal } from "../hooks/useWatchPartyModal";
import { useFixtures } from "../hooks/useFixtures";
import useSession from "../../../features/WatchParty/Hooks/SessionLogic";

export default function WatchPartyModal({ open, onClose }: WatchPartyModalProps) {
  const session = useSession();
  const { fixtures, isLoading: fixturesLoading } = useFixtures();

  const {
    step, form, roomCode, canSubmit, isLoading, error,
    setName, setFixtureId, setPrivacy,
    handleCreate, handleClose, handleGoToRoom,
  } = useWatchPartyModal(session?.user?.id, fixtures, onClose);

  if (!open) return null;

  const handleBackdropClick = (_e: MouseEvent<HTMLDivElement>) => handleClose();

  return (
    <div className="wp-modal__backdrop" onClick={handleBackdropClick}>
      <div className="wp-modal" onClick={(e) => e.stopPropagation()}>
        <button className="wp-modal__close" onClick={handleClose}>✕</button>

        {step === 1 ? (
          <>
            <h2 className="wp-modal__title">Crear Watch Party</h2>
            <p className="wp-modal__sub">
              Configura tu sala y comparte el código con tus amigos.
            </p>

            <label className="wp-modal__label">Nombre de la sala</label>
            <input
              className="wp-modal__input"
              placeholder="Ej: Culers de MTY 🔵🔴"
              value={form.name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="wp-modal__label">Partido</label>
            <select
              className="wp-modal__input"
              value={form.fixture_id}
              onChange={(e) => setFixtureId(e.target.value)}
              disabled={fixturesLoading}
            >
              <option value="">
                {fixturesLoading ? "Cargando partidos..." : "Selecciona un partido..."}
              </option>
              {fixtures.map((f) => (
                <option key={f.fixture_id} value={String(f.fixture_id)}>
                  {f.homeTeam} vs {f.awayTeam} —{" "}
                  {new Date(f.date).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </option>
              ))}
            </select>

            <label className="wp-modal__label">Privacidad</label>
            <div className="wp-modal__toggle">
              {(["publica", "privada"] as Privacy[]).map((p) => (
                <button
                  key={p}
                  className={`wp-modal__toggle-btn ${
                    form.privacy === p ? "wp-modal__toggle-btn--active" : ""
                  }`}
                  onClick={() => setPrivacy(p)}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>

            {error && <p className="wp-modal__error">{error}</p>}

            <button
              className="wp-modal__submit"
              disabled={!canSubmit || isLoading}
              onClick={handleCreate}
            >
              {isLoading ? "Creando..." : "Crear sala"}
            </button>
          </>
        ) : (
          <div className="wp-modal__success">
            <div className="wp-modal__success-icon">🎉</div>
            <h2 className="wp-modal__title">¡Sala creada!</h2>
            <p className="wp-modal__sub">
              Comparte este código con tus amigos para que se unan.
            </p>
            <div className="wp-modal__code-display">{roomCode}</div>
            <button className="wp-modal__submit" onClick={handleGoToRoom}>
              Ir a mi Watch Party →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}