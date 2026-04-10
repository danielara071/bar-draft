import type { WatchPartyMatch } from "./types";
import WatchPartyCard from "./WatchPartyCard";


interface WatchPartyGridProps {
  title: string;
  matches: WatchPartyMatch[];
  onCardClick?: (match: WatchPartyMatch) => void;
}

export default function WatchPartyGrid({
  title,
  matches,
  onCardClick,
}: WatchPartyGridProps) {
  return (
    <section className="wp-grid">
      <h2 className="wp-grid__title">{title}</h2>
      <div className="wp-grid__cards">
        {matches.map((match) => (
          <WatchPartyCard
            key={match.id}
            match={match}
            onClick={() => onCardClick?.(match)}
          />
        ))}
      </div>
    </section>
  );
}
