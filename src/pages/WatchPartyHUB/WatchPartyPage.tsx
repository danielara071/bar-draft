import { useState } from "react";
import type { WatchPartyMatch } from "./types";
import WatchPartyHero from "./WatchPartyHero";
import WatchPartyUpcoming from "./WatchPartyUpcoming";
import WatchPartyCodeInput from "./WatchPartyCodeInput";
import WatchPartyGrid from "./WatchPartyGrid";
import WatchPartyModal from "./WatchPartyModal";


// ── Mock data ──────────────────────────────────────────────────────────────
const MY_PARTIES: WatchPartyMatch[] = [
  {
    id: 1,
    type: "femenil",
    title: "Barca vs Chelsea",
    competition: "UEFA Champions League – Cuartos de Final",
    time: "Hoy – 20:00",
    code: "FEM-2004",
  },
  {
    id: 2,
    type: "varonil",
    title: "Barca vs Valencia",
    competition: "La Liga – Jornada 26",
    time: "Mañana – 21:30",
    code: "VAR-2334",
  },
];

const LIVE_PARTIES: WatchPartyMatch[] = [
  {
    id: 3,
    type: "femenil",
    title: "Barca vs Chelsea",
    competition: "UEFA Champions League – Cuartos de Final",
    time: "Hoy – 20:00",
    code: "FEM-2004",
  },
  {
    id: 4,
    type: "femenil",
    title: "Barca vs Chelsea",
    competition: "UEFA Champions League – Cuartos de Final",
    time: "Hoy – 20:00",
    code: "FEM-2004",
  },
  {
    id: 5,
    type: "femenil",
    title: "Barca vs Chelsea",
    competition: "UEFA Champions League – Cuartos de Final",
    time: "Hoy – 20:00",
    code: "FEM-2004",
  },
  {
    id: 6,
    type: "femenil",
    title: "Barca vs Chelsea",
    competition: "UEFA Champions League – Cuartos de Final",
    time: "Hoy – 20:00",
    code: "FEM-2004",
  },
];

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
