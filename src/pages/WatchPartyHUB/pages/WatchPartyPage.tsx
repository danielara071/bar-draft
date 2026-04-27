import { useState } from "react";
import useSession from "../../../features/WatchParty/Hooks/SessionLogic";
import type { WatchPartyMatch } from "../interfaces/index.interfaces";
import { useFriendWatchParties } from "../hooks/useFriendWatchParties";
import { usePublicWatchParties } from "../hooks/usePublicWatchParties";
import WatchPartyHero from "../components/WatchPartyHero";
import WatchPartyUpcoming from "../components/WatchPartyUpcoming";
import WatchPartyCodeInput from "../components/WatchPartyCodeInput";
import WatchPartyGrid from "../components/WatchPartyGrid";
import WatchPartyModal from "../components/WatchPartyModal";
import WatchPartyJoinModal from "../components/WatchPartyJoinModal";
import { PrediccionesModal } from "../components/PrediccionesModal";

export default function WatchPartyPage() {
  const session = useSession();
  const userId = session?.user?.id;

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  // Sala que el usuario quiere ver / unirse
  const [selectedMatch, setSelectedMatch] = useState<WatchPartyMatch | null>(null);

  // Sala confirmada para la que se muestran predicciones (después de WatchPartyJoinModal)
  const [prediccionMatch, setPrediccionMatch] = useState<WatchPartyMatch | null>(null);

  const { parties: friendParties, isLoading: friendsLoading } =
    useFriendWatchParties(userId);

  const { parties: publicParties, isLoading: publicLoading } =
    usePublicWatchParties();

  const handleCardClick = (match: WatchPartyMatch): void => {
    setSelectedMatch(match);
  };

  // Se llama desde WatchPartyJoinModal cuando el usuario confirma que quiere entrar.
  // En vez de navegar directo, abrimos el modal de predicciones primero.
  const handleConfirmJoin = (match: WatchPartyMatch): void => {
    setSelectedMatch(null);       // cierra WatchPartyJoinModal
    setPrediccionMatch(match);    // abre PrediccionesModal
  };

  return (
    <div className="wp-page">
      <WatchPartyHero onCreateParty={() => setCreateModalOpen(true)} />

      <div className="wp-page__body">
        <WatchPartyUpcoming
          parties={friendParties}
          onCardClick={handleCardClick}
          onAddClick={() => setCreateModalOpen(true)}
          isLoading={friendsLoading}
        />

        <WatchPartyCodeInput />

        <WatchPartyGrid
          title="En Vivo"
          matches={publicParties}
          onCardClick={handleCardClick}
          isLoading={publicLoading}
        />
      </div>

      {/* Modal de creación */}
      <WatchPartyModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {/* Modal de detalle de sala — ahora recibe onConfirmJoin */}
      <WatchPartyJoinModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onConfirmJoin={handleConfirmJoin}  
      />

      {/* Modal de predicciones — se muestra antes de entrar a la sala */}
      <PrediccionesModal
        match={prediccionMatch}
        onClose={() => setPrediccionMatch(null)}
      />
    </div>
  );
}