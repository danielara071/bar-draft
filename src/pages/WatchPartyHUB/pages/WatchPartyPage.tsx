import { useState } from "react";
import useSession from "../../../features/WatchParty/Hooks/SessionLogic";
import type { WatchPartyMatch } from "../interfaces/index.interfaces";
import { useFriendWatchParties } from "../hooks/useFriendWatchParties";
import { usePublicWatchParties } from "../hooks/usePublicWatchParties";
import { useCanJoinParty } from "../../../features/WatchParty/Hooks/useCanJoinParty";
import WatchPartyHero from "../components/WatchPartyHero";
import WatchPartyUpcoming from "../components/WatchPartyUpcoming";
import WatchPartyCodeInput from "../components/WatchPartyCodeInput";
import WatchPartyGrid from "../components/WatchPartyGrid";
import WatchPartyModal from "../components/WatchPartyModal";
import WatchPartyJoinModal from "../components/WatchPartyJoinModal";
import { PrediccionesModal } from "../components/PrediccionesModal";

function buildJoinError(status: string, minutesUntilMatch: number | null): string {
  switch (status) {
    case "too_early":
      return minutesUntilMatch !== null
        ? `La sala abre ${minutesUntilMatch} minuto${minutesUntilMatch === 1 ? "" : "s"} antes del partido. ¡Vuelve pronto!`
        : "La sala aún no está disponible.";
    case "finished":
      return "Este partido ya terminó. La sala no está disponible.";
    case "not_found":
      return "No se encontró información del partido.";
    default:
      return "Error al verificar el partido. Intenta de nuevo.";
  }
}

function JoinErrorBanner({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm p-6 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">
          ⏳
        </div>
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
            Sala no disponible
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {message}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-full bg-[#A3205A] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

export default function WatchPartyPage() {
  const session = useSession();
  const userId = session?.user?.id;

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [selectedMatch, setSelectedMatch] = useState<WatchPartyMatch | null>(null);
  const [prediccionMatch, setPrediccionMatch] = useState<WatchPartyMatch | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  const { check, isLoading: isCheckingJoin, minutesUntilMatch } = useCanJoinParty();

  const { parties: friendParties, isLoading: friendsLoading } =
    useFriendWatchParties(userId);

  const { parties: publicParties, isLoading: publicLoading } =
    usePublicWatchParties();

  const handleCardClick = (match: WatchPartyMatch): void => {
    setSelectedMatch(match);
  };

  // Capa 1: guard antes de abrir PrediccionesModal al unirse a una sala existente
  const handleConfirmJoin = async (match: WatchPartyMatch): Promise<void> => {
    const result = await check(match.id);
    if (result === "allowed") {
      setSelectedMatch(null);
      setPrediccionMatch(match);
    } else {
      setSelectedMatch(null);
      setJoinError(buildJoinError(result, minutesUntilMatch));
    }
  };

  // Callback que recibe WatchPartyModal cuando la sala fue creada exitosamente.
  // Cierra el modal de creación y abre PrediccionesModal 
  const handleWatchPartyCreated = (match: WatchPartyMatch): void => {
    setCreateModalOpen(false);
    setPrediccionMatch(match);
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

      {/* Modal de creación — recibe onCreated para disparar PrediccionesModal */}
      <WatchPartyModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={handleWatchPartyCreated}
      />

      {/* Modal de detalle de sala */}
      <WatchPartyJoinModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onConfirmJoin={handleConfirmJoin}
        isConfirming={isCheckingJoin}
      />

      {/* Modal de predicciones — se abre tanto al crear como al unirse */}
      <PrediccionesModal
        match={prediccionMatch}
        onClose={() => setPrediccionMatch(null)}
      />

      {/* Banner de error de acceso */}
      {joinError && (
        <JoinErrorBanner
          message={joinError}
          onClose={() => setJoinError(null)}
        />
      )}
    </div>
  );
}