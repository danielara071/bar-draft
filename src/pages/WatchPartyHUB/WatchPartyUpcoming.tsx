import type { WatchPartyMatch } from "./types";
import WatchPartyCard from "./WatchPartyCard";


interface WatchPartyUpcomingProps {
  parties: WatchPartyMatch[];
  onCardClick?: (match: WatchPartyMatch) => void;
  onAddClick?: () => void;
}

export default function WatchPartyUpcoming({
  parties,
  onCardClick,
  onAddClick,
}: WatchPartyUpcomingProps) {
  return (
    <section className="wp-upcoming">
      <h2 className="wp-upcoming__title">Tus Próximas Watch Parties</h2>
      <div className="wp-upcoming__row">
        {parties.map((match) => (
          <WatchPartyCard
            key={match.id}
            match={match}
            onClick={() => onCardClick?.(match)}
          />
        ))}
        <WatchPartyCard variant="add" onClick={onAddClick} />
      </div>
    </section>
  );
}
