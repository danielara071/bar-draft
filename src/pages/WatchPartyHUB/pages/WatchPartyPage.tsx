import { useState } from "react";
import {
  WatchPartyHero,
  WatchPartyUpcoming,
  WatchPartyCodeInput,
  WatchPartyGrid,
  WatchPartyModal,
} from "../components/index.components";
import type { WatchPartyMatch } from "../interfaces/index.interfaces";
import { MY_PARTIES, LIVE_PARTIES } from "../utils/index.utils";

export default function WatchPartyPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleCardClick = (match: WatchPartyMatch): void => {
    console.log("Abrir sala", match.id);
  };

  const handleJoinCode = (code: string): void => {
    console.log("Unirse con código", code);
  };

  return (
    <div className="wp-page">
      <WatchPartyHero onCreateParty={() => setModalOpen(true)} />

      <div className="wp-page__body">
        <WatchPartyUpcoming
          parties={MY_PARTIES}
          onCardClick={handleCardClick}
          onAddClick={() => setModalOpen(true)}
        />

        <WatchPartyCodeInput onJoin={handleJoinCode} />

        <WatchPartyGrid
          title="En Vivo"
          matches={LIVE_PARTIES}
          onCardClick={handleCardClick}
        />
      </div>

      <WatchPartyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
