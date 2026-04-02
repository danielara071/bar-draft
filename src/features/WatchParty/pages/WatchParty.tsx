import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel, Session } from "@supabase/supabase-js";
import { supabase } from "../../../shared/services/supabaseClient";
import type { ChatMessage } from "../Types/chatType";
import InfoCard from "../Components/InfoCard";
import ChatHeader from "../Components/ChatHeader";
import ChatMessageBubble from "../Components/ChatMessageBubble";
import ChatInput from "../Components/ChatInput";

const WatchParty = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [usersOnline, setUsersOnline] = useState<string[]>([]);
  const roomOneRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession);
    };

    verifySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);

      if (!nextSession?.user) {
        setUsersOnline([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  console.log(session);

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    const roomOne = supabase.channel("room-one", {
      config: {
        broadcast: { self: true },
        presence: {
          key: session?.user?.id,
        },
      },
    });
    roomOneRef.current = roomOne;

    roomOne.on("broadcast", { event: "message" }, (payload) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        payload.payload as ChatMessage,
      ]);
    });

    // Manejo de la presencia de usuario
    roomOne.on("presence", { event: "sync" }, () => {
      const state = roomOne.presenceState();
      setUsersOnline(Object.keys(state));
    });
    // Seguimiento de usuarios suscritos a la sala
    roomOne.subscribe(async (status) => {
      if (status == "SUBSCRIBED") {
        await roomOne.track({
          id: session?.user?.id,
        });
      }
    });

    return () => {
      roomOne.unsubscribe();
      roomOneRef.current = null;
    };
  }, [session]);

  // send message
  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!roomOneRef.current || !newMessage.trim()) {
      return;
    }

    await roomOneRef.current.send({
      type: "broadcast",
      event: "message",
      payload: {
        message: newMessage,
        user_name: session?.user?.user_metadata?.full_name,
        avatar: session?.user?.user_metadata?.avatar,
        timestamp: new Date().toISOString(),
      },
    });
    setNewMessage("");
  };

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
