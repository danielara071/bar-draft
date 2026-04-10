import InfoCard from "../Components/InfoCard";
import ChatHeader from "../Components/ChatHeader";
import ChatMessageBubble from "../Components/ChatMessageBubble";
import ChatInput from "../Components/ChatInput";
import useWatchPartyChat from "../Hooks/ChatLogic";
import useSession from "../Hooks/SessionLogic";
import ScoreCard from "../Components/ScoreCard";
import PrediccionesPopulares from "../Components/PrediccionesPopulares";
import { useMatch } from "../Hooks/UseMatchScore";

const WatchParty = () => {
  const session = useSession();
  const { match: matchResponse, loading } = useMatch();
  const liveMatch = matchResponse?.match;

  const defaultPredicciones = [
    { label: "Ganador", value: "FC Barcelona (68%)" },
    { label: "Marcador más votado", value: "2 - 1" },
    { label: "Primer goleador favorito", value: "Bonmati" },
  ];

  // Para ver las cosas que nos trae la sesión DEBUG
  console.log(session);

  const {
    messages,
    newMessage,
    setNewMessage,
    usersOnline,
    sendMessage,
    chatContainerRef,
  } = useWatchPartyChat(session);

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

  if (!liveMatch) {
    return (
      <div className="p-6 text-gray-700">
        No hay partido disponible en este momento.
      </div>
    );
  }

  return (
    <div className="w-full flex gap-4 justify-center items-start p-8 py-22 bg-brand-navy">
      <div className="w-270">
        <ScoreCard
          date="Lunes 6 de Abril 2026"
          homeTeam={liveMatch.teams.home.name}
          homeTeamScore={liveMatch.goals.home}
          awayTeam={liveMatch.teams.away.name}
          awayTeamScore={liveMatch.goals.away}
          matchTime={20}
          location="Camp Nou"
          fansWatching={usersOnline.length}
        />
        <div className="flex gap-4 w-full mt-4">
          <InfoCard
            label="COMPETICIÓN"
            title="UEFA Champions League"
            subtitle="Jornada 26"
          />
          <InfoCard
            label="ESTADIO"
            title="Camp Nou"
            subtitle="Barcelona, España"
          />
        </div>
        <div className="flex gap-4 w-full mt-4 ">
          <PrediccionesPopulares
            title="Predicciones populares"
            predictions={defaultPredicciones}
          />
        </div>
      </div>
      <div className="border border-brand-gray-light bg-brand-white max-w-6xl w-130 min-h-150 rounded-2xl overflow-hidden">
        {/* Chat Header */}
        <ChatHeader />
        {/* Mensaje Chat */}
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
        {/* Input Mensaje */}
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
