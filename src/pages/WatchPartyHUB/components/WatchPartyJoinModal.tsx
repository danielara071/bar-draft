import { useNavigate } from "react-router-dom";
import type { JoinModalProps } from "../interfaces/index.interfaces";

export default function WatchPartyJoinModal({ match, onClose }: JoinModalProps) {
  const navigate = useNavigate();

  if (!match) return null;

  const handleJoin = () => {
    onClose();
    navigate(`/watchParty/${match.code}`);
  };

  return (
    <div className="wp-modal__backdrop" onClick={onClose}>
      <div className="wp-modal wp-modal--join" onClick={(e) => e.stopPropagation()}>
        <button className="wp-modal__close" onClick={onClose}>✕</button>

        <span className={`wp-card__badge wp-card__badge--${match.type}`}>
          {match.type === "femenil" ? "FEMENIL" : "VARONIL"}
        </span>

        <h2 className="wp-modal__title" style={{ marginTop: "12px" }}>
          {match.title}
        </h2>
        <p className="wp-modal__sub">{match.competition}</p>

        <div className="wp-modal__join-info">
          <div className="wp-modal__join-row">
            <span className="wp-modal__join-label">Hora</span>
            <span className="wp-modal__join-value">{match.time}</span>
          </div>
          <div className="wp-modal__join-row">
            <span className="wp-modal__join-label">Código</span>
            <span className="wp-modal__join-value wp-modal__join-code">{match.code}</span>
          </div>
        </div>

        <button className="wp-modal__submit" onClick={handleJoin}>
          Unirme a esta sala →
        </button>
      </div>
    </div>
  );
}
