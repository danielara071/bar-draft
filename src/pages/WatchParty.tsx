import { useParams, Navigate } from "react-router-dom";
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

const WatchParty = () => {
  const { code } = useParams<{ code: string }>();
  const session = useSession();
  const { match: liveMatch, loading, error, fetchedAt } = useMatch();
  const { predictions } = useMatchPredictions();

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

  // Canal dinámico según el código de sala
  const {
    messages,
    newMessage,
    setNewMessage,
    usersOnline,
    sendMessage,
    chatContainerRef,
  } = useWatchPartyChat(session, code ?? "");

  if (!code) return <Navigate to="/watchPartyHUB" replace />;

  if (!session) {
    return (
      <div className="p-6 text-gray-700">
        Inicia sesión desde la página de inicio para unirte al Watch Party.
      </div>
    );
  }

  if (loading) {
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
            title="Predicciones populares"
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
        />
      </div>
    </div>
  );
};

export default WatchParty;
