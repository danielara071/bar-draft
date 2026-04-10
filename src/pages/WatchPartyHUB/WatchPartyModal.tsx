import  { useState, type  MouseEvent } from "react";
import type { CreatePartyForm, Privacy } from "./types";


interface WatchPartyModalProps {
  open: boolean;
  onClose?: () => void;
}

const INITIAL_FORM: CreatePartyForm = {
  name: "",
  match: "",
  privacy: "publica",
};

export default function WatchPartyModal({ open, onClose }: WatchPartyModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<CreatePartyForm>(INITIAL_FORM);

  if (!open) return null;

  const handleCreate = (): void => {
    // No-op: no backend connection yet
    setStep(2);
  };

  const handleClose = (): void => {
    setStep(1);
    setForm(INITIAL_FORM);
    onClose?.();
  };

  const handleBackdropClick = (_e: MouseEvent<HTMLDivElement>): void => {
    handleClose();
  };

  const setPrivacy = (p: Privacy): void => {
    setForm((prev) => ({ ...prev, privacy: p }));
  };

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
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />

            <label className="wp-modal__label">Partido</label>
            <select
              className="wp-modal__input"
              value={form.match}
              onChange={(e) => setForm((prev) => ({ ...prev, match: e.target.value }))}
            >
              <option value="">Selecciona un partido...</option>
              <option value="fem-chelsea">Barca vs Chelsea – UCL Cuartos (Femenil)</option>
              <option value="var-valencia">Barca vs Valencia – La Liga J26 (Varonil)</option>
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

            <button
              className="wp-modal__submit"
              disabled={!form.name || !form.match}
              onClick={handleCreate}
            >
              Crear sala
            </button>
          </>
        ) : (
          <div className="wp-modal__success">
            <div className="wp-modal__success-icon">🎉</div>
            <h2 className="wp-modal__title">¡Sala creada!</h2>
            <p className="wp-modal__sub">
              Comparte este código con tus amigos para que se unan.
            </p>
            <div className="wp-modal__code-display">FEM-2004</div>
            <button className="wp-modal__submit" onClick={handleClose}>
              Ir a mi Watch Party →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
