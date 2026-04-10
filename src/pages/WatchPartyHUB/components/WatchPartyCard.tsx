import type { WatchPartyCardProps } from "../interfaces/index.interfaces";
import { getMatchTypeLabel } from "../utils/index.utils";

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export default function WatchPartyCard(props: WatchPartyCardProps) {
  if (props.variant === "add") {
    return (
      <button className="wp-card wp-card--add" onClick={props.onClick}>
        <span className="wp-card__plus">+</span>
      </button>
    );
  }

  const { match, onClick } = props;

  return (
    <button className="wp-card" onClick={onClick}>
      <span className={`wp-card__badge wp-card__badge--${match.type}`}>
        {getMatchTypeLabel(match.type)}
      </span>
      <h3 className="wp-card__title">{match.title}</h3>
      <p className="wp-card__competition">{match.competition}</p>
      <div className="wp-card__divider" />
      <div className="wp-card__time">
        <CalendarIcon />
        <span>{match.time}</span>
      </div>
      <div className="wp-card__divider" />
      <p className="wp-card__code">Código: {match.code}</p>
    </button>
  );
}
