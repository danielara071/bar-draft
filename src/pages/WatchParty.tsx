import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import InfoCard from "../features/WatchParty/Components/InfoCard";
import ChatHeader from "../features/WatchParty/Components/ChatHeader";
import ChatMessageBubble from "../features/WatchParty/Components/ChatMessageBubble";
import ChatInput from "../features/WatchParty/Components/ChatInput";
import useWatchPartyChat from "../features/WatchParty/Hooks/ChatLogic";
import useSession from "../features/WatchParty/Hooks/SessionLogic";
import ScoreCard from "../features/WatchParty/Components/ScoreCard";
import PrediccionesPopulares from "../features/WatchParty/Components/PrediccionesPopulares";
import { useMatch } from "../features/WatchParty/Hooks/UseMatchScore";
import { useMatchClock } from "../features/WatchParty/Hooks/useMatchClock";
import { useMatchPredictions } from "../features/WatchParty/Hooks/useMatchPredictions";
import { useCanJoinPartyAuto } from "../features/WatchParty/Hooks/useCanJoinParty";
import { supabase } from "../shared/services/supabaseClient";

// obtiene el partido (fixture_id) asociado a un código de sala, y maneja el estado de carga
function useWatchPartyFixtureId(code: string | undefined) {
  const [fixtureId, setFixtureId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    supabase
      .from("watch_parties")
      .select("fixture_id")
      .eq("code", code)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setFixtureId(data.fixture_id);
        setLoading(false);
      });
  }, [code]);

  return { fixtureId, loading };
}

//Pantalla de acceso bloqueado ─ muestra un mensaje dependiendo del motivo (partido no iniciado, terminado, error, etc)
function AccessBlocked({
  title,
  message,
  onBack,
}: {
  title: string;
  message: string;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-navy p-6">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">
          ⏳
        </div>
        <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
        <p className="text-sm text-neutral-500 leading-relaxed">{message}</p>
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 rounded-full bg-[#A3205A] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

// pagina watch party: maneja la lógica de acceso a la sala, carga de datos del partido, predicciones populares, y el chat en vivo
const WatchParty = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const session = useSession();

  const { fixtureId, loading: fixtureIdLoading } = useWatchPartyFixtureId(code);

  // verifica acceso a la sala según el estado del partido (live, finished, o programado con tiempo restante)
  const {
    canJoin,
    status: joinStatus,
    minutesUntilMatch,
    isLoading: isCheckingJoin,
  } = useCanJoinPartyAuto(fixtureId);

  //predicciones populares filtradas por fixture_id de la base de datos, actualizadas en tiempo real
  const { predictions, totalVotes } = useMatchPredictions(fixtureId);

  const {
    match: liveMatch,
    loading: matchLoading,
    error,
    fetchedAt,
  } = useMatch();

  const matchDateLabel = liveMatch
    ? new Date(liveMatch.fixture.date).toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const matchClock = useMatchClock(
    liveMatch?.fixture.status.elapsed,
    fetchedAt,
  );

  const {
    messages,
    newMessage,
    setNewMessage,
    usersOnline,
    sendMessage,
    chatContainerRef,
    stickers,
    sendSticker,
  } = useWatchPartyChat(session, code ?? "");

  if (!code) return <Navigate to="/watchPartyHUB" replace />;

  if (!session) {
    return (
      <div className="p-6 text-gray-700">
        Inicia sesión desde la página de inicio para unirte al Watch Party.
      </div>
    );
  }

  // Cargando fixture_id o verificando acceso
  if (fixtureIdLoading || isCheckingJoin) {
    return (
      <div className="p-6 text-gray-700">Verificando acceso a la sala...</div>
    );
  }

  // fixture_id no encontrado (código inválido)
  if (!fixtureId) {
    return <Navigate to="/watchPartyHUB" replace />;
  }

  // Guard: partido no disponible aún
  if (joinStatus === "too_early") {
    return (
      <AccessBlocked
        title="La sala aún no está disponible"
        message={
          minutesUntilMatch !== null
            ? `Faltan ${minutesUntilMatch} minuto${minutesUntilMatch === 1 ? "" : "s"} para que abra la sala. ¡Vuelve pronto!`
            : "La sala abre 5 minutos antes del partido."
        }
        onBack={() => navigate("/watchPartyHUB")}
      />
    );
  }

  // Guard: partido terminado
  if (joinStatus === "finished") {
    return (
      <AccessBlocked
        title="Partido finalizado"
        message="Este partido ya terminó. La sala ya no está disponible."
        onBack={() => navigate("/watchPartyHUB")}
      />
    );
  }

  // Guard: error o no encontrado
  if (!canJoin && joinStatus !== "idle") {
    return (
      <AccessBlocked
        title="Sala no disponible"
        message="No se pudo verificar el acceso a esta sala. Intenta de nuevo más tarde."
        onBack={() => navigate("/watchPartyHUB")}
      />
    );
  }

  if (matchLoading) {
    return (
      <div className="p-6 text-gray-700">Cargando datos del partido...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error cargando partido en vivo: {error}
      </div>
    );
  }

  if (!liveMatch) {
    return <div className="p-6 text-gray-700">No live matches</div>;
  }

  return (
    <div className="w-full flex gap-4 justify-center items-start p-8 py-22 bg-brand-navy">
      <div className="w-270">
        <ScoreCard
          date={matchDateLabel}
          homeTeam={liveMatch.teams.home.name}
          homeTeamScore={liveMatch.goals.home ?? 0}
          awayTeam={liveMatch.teams.away.name}
          awayTeamScore={liveMatch.goals.away ?? 0}
          matchTime={matchClock}
          location={liveMatch.fixture.venue.name ?? "No disponible"}
          fansWatching={usersOnline.length}
        />
        <div className="flex gap-4 w-full mt-4">
          <InfoCard
            label="COMPETICIÓN"
            title={liveMatch.league.name}
            subtitle={liveMatch.league.round}
          />
          <InfoCard
            label="ESTADIO"
            title={liveMatch.fixture.venue.name ?? "No disponible"}
            subtitle={liveMatch.fixture.venue.city ?? ""}
          />
        </div>
        <div className="flex gap-4 w-full mt-4">
          <PrediccionesPopulares
            title={`Predicciones populares · ${totalVotes} voto${totalVotes === 1 ? "" : "s"}`}
            predictions={predictions}
          />
        </div>
      </div>

      <div className="border border-brand-gray-light bg-brand-white max-w-6xl w-130 min-h-150 rounded-2xl overflow-hidden">
        <ChatHeader roomCode={code} />
        <div
          ref={chatContainerRef}
          className="p-4 flex flex-col overflow-y-auto h-125 bg-brand-white"
        >
          {messages.map((msg) => (
            <ChatMessageBubble
              key={`${msg.timestamp}-${msg.user_name}`}
              message={msg}
              currentUserName={session?.user?.user_metadata?.full_name}
            />
          ))}
        </div>
        <ChatInput
          value={newMessage}
          onChange={setNewMessage}
          onSubmit={sendMessage}
          stickers={stickers}
          onSendSticker={sendSticker}
        />
      </div>
    </div>
  );
};

export default WatchParty;
