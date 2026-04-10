

interface WatchPartyHeroProps {
  onCreateParty: () => void;
}

export default function WatchPartyHero({ onCreateParty }: WatchPartyHeroProps) {
  return (
    <section className="wp-hero">
      <div className="wp-hero__backdrop">
        <div className="wp-hero__overlay" />
        <div className="wp-hero__title-wrap">
          <h1 className="wp-hero__title">Watch Party</h1>
        </div>
      </div>

      <div className="wp-hero__card">
        <div className="wp-hero__card-text">
          <h2 className="wp-hero__card-heading">Mira el partido con todos</h2>
          <p className="wp-hero__card-sub">
            Únete a una sala existente o crea la tuya para ver el partido en
            vivo con fans de todo el mundo.
          </p>
        </div>
        <button className="wp-hero__cta" onClick={onCreateParty}>
          + Crear Watch Party
        </button>
      </div>
    </section>
  );
}
