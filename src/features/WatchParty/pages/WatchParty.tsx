import InfoCard from "../Components/InfoCard";
import ChatHeader from "../Components/ChatHeader";
import ChatMessageBubble from "../Components/ChatMessageBubble";
import ChatInput from "../Components/ChatInput";
import useWatchPartyChat from "../Hooks/ChatLogic";
import useSession from "../Hooks/SessionLogic";
import ScoreCard from "../Components/ScoreCard";

const WatchParty = () => {
  const session = useSession();

  // Para ver las cosas que nos trae la sesión DEBUG
  console.log(session);

  const { messages, newMessage, setNewMessage, usersOnline, sendMessage } =
    useWatchPartyChat(session);

  if (!session) {
    return (
      <div className="p-6 text-gray-700">
        Inicia sesión desde la página de inicio para unirte al Watch Party.
      </div>
    );
  } else {
    return (
      <div className="w-full flex gap-4 h-[calc(100vh-3rem)] justify-center items-start p-8 py-22 overflow-y-auto bg-brand-navy">
        <div className="w-270">
          <ScoreCard
            date="Lunes 6 de Abril 2026"
            homeTeam="FC Barcelona"
            homeTeamShort="FCB"
            awayTeam="Chelsea"
            awayTeamShort="CH"
            matchTime={20}
            location="Camp Nou"
            fansWatching={4}
          />
          <div className="flex gap-4 w-max">
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
        </div>
        <div className="border border-gray-700 max-w-6xl w-130 min-h-150 rounded-lg">
          {/* Header */}
          <ChatHeader
            fullName={session?.user?.user_metadata?.full_name}
            usersOnline={usersOnline.length}
          />
          {/* Mensaje Chat */}
          <div className="p-4 flex flex-col overflow-y-auto h-125">
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
  }
};

export default WatchParty;
