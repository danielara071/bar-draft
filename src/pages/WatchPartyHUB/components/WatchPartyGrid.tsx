import type { WatchPartyGridProps } from "../interfaces/index.interfaces";
import WatchPartyCard from "./WatchPartyCard";

export default function WatchPartyGrid({ title, matches, onCardClick, isLoading }: WatchPartyGridProps) {
  return (
    <section className="wp-grid">
      <h2 className="wp-grid__title">{title}</h2>
      <div className="wp-grid__cards">
        {isLoading && (
          <>
            <div className="wp-skeleton" />
            <div className="wp-skeleton" />
            <div className="wp-skeleton" />
          </>
        )}
        {!isLoading && matches.length === 0 && (
          <p className="wp-grid__empty">No hay partidos en vivo ahora mismo.</p>
        )}
        {!isLoading && matches.map((match) => (
          <WatchPartyCard key={match.id} match={match} onClick={() => onCardClick?.(match)} />
        ))}
      </div>
    </section>
  );
}