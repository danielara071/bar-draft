import InfoCard from "../Components/InfoCard";
import ChatHeader from "../Components/ChatHeader";
import ChatMessageBubble from "../Components/ChatMessageBubble";
import ChatInput from "../Components/ChatInput";
import useWatchPartyChat from "../Hooks/ChatLogic";
import useSession from "../Hooks/SessionLogic";

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
      <div className="w-full flex h-[calc(100vh-3rem)] justify-center items-start p-4 overflow-y-auto bg-brand-navy">
        <div className="border border-gray-700 max-w-6xl w-full min-h-150 rounded-lg">
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
        <div className="border border-gray-700 max-w-6xl w-full min-h-150 rounded-lg">
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
