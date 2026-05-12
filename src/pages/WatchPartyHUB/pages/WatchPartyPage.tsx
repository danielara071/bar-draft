import { useState, useEffect } from "react";
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


function useCountdown(targetDate: Date | null) {
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    if (!targetDate) return;

    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ h: 0, m: 0, s: 0 });
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      setTimeLeft({
        h: Math.floor(totalSeconds / 3600),
        m: Math.floor((totalSeconds % 3600) / 60),
        s: totalSeconds % 60,
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// ── Banner con contador regresivo ─────────────────────────────────────────────
function TooEarlyBanner({
  matchDate,
  onClose,
}: {
  matchDate: Date;
  onClose: () => void;
}) {
  const timeLeft = useCountdown(matchDate);

  const countdownDisplay = timeLeft
    ? timeLeft.h > 0
      ? `${pad(timeLeft.h)}:${pad(timeLeft.m)}:${pad(timeLeft.s)}`
      : `${pad(timeLeft.m)}:${pad(timeLeft.s)}`
    : "--:--";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm p-6 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl">
          ⏳
        </div>
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
            La sala aún no está disponible
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            La sala abre 5 minutos antes del partido. Tiempo restante:
          </p>
        </div>
        {/* Contador */}
        <div className="text-4xl font-bold tabular-nums text-[#A3205A]">
          {countdownDisplay}
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

// ── Banner de error genérico ──────────────────────────────────────────────────
function JoinErrorBanner({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm p-6 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">
          🚫
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

// ── Página principal ──────────────────────────────────────────────────────────
export default function WatchPartyPage() {
  const session = useSession();
  const userId = session?.user?.id;

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [selectedMatch, setSelectedMatch] = useState<WatchPartyMatch | null>(null);
  const [prediccionMatch, setPrediccionMatch] = useState<WatchPartyMatch | null>(null);

  // Para el contador: guardamos la fecha del partido bloqueado
  const [tooEarlyDate, setTooEarlyDate] = useState<Date | null>(null);
  // Para errores genéricos (finished, not_found, error)
  const [joinError, setJoinError] = useState<string | null>(null);

  const { check, isLoading: isCheckingJoin } = useCanJoinParty();

  const { parties: friendParties, isLoading: friendsLoading } =
    useFriendWatchParties(userId);

  const { parties: publicParties, isLoading: publicLoading } =
    usePublicWatchParties();

  const handleCardClick = (match: WatchPartyMatch): void => {
    setSelectedMatch(match);
  };

  const handleConfirmJoin = async (match: WatchPartyMatch): Promise<void> => {
    const result = await check(match.id);
    setSelectedMatch(null);

    if (result === "allowed") {
      setPrediccionMatch(match);
    } else if (result === "too_early" && match.match_date) {
      // Calculamos la fecha objetivo: match_date - 5 minutos
      const matchMs = new Date(match.match_date).getTime();
      const openAt = new Date(matchMs - 5 * 60 * 1000);
      setTooEarlyDate(openAt);
    } else if (result === "finished") {
      setJoinError("Este partido ya terminó. La sala no está disponible.");
    } else {
      setJoinError("No se encontró información del partido. Intenta de nuevo.");
    }
  };

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

      <WatchPartyModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={handleWatchPartyCreated}
      />

      <WatchPartyJoinModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onConfirmJoin={handleConfirmJoin}
        isConfirming={isCheckingJoin}
      />

      <PrediccionesModal
        match={prediccionMatch}
        onClose={() => setPrediccionMatch(null)}
      />

      {/* Contador regresivo cuando es demasiado pronto */}
      {tooEarlyDate && (
        <TooEarlyBanner
          matchDate={tooEarlyDate}
          onClose={() => setTooEarlyDate(null)}
        />
      )}

      {/* Error genérico */}
      {joinError && (
        <JoinErrorBanner
          message={joinError}
          onClose={() => setJoinError(null)}
        />
      )}
    </div>
  );
}