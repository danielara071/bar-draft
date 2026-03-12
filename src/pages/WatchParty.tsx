import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel, Session } from "@supabase/supabase-js";
import { supabase } from "../services/supabaseClient";

type ChatMessage = {
  message: string;
  user_name?: string;
  avatar?: string;
  timestamp: string;
};

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

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("en-us", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!session) {
    return (
      <div className="p-6 text-gray-700">
        Inicia sesión desde la página de inicio para unirte al Watch Party.
      </div>
    );
  } else {
    return (
      <div className="w-full flex h-[calc(100vh-3rem)] justify-center items-start p-4 overflow-y-auto">
        <div className="border border-gray-700 max-w-6xl w-full min-h-150 rounded-lg">
          {/* Header */}
          <div className="flex justify-between h-20 border-b border-gray-700">
            <div className="p-4">
              <p className="text-gray-700">
                Sesión iniciada como {session?.user?.user_metadata?.full_name}
              </p>
              <p className="text-gray-700 italic text-sm">
                {usersOnline.length} usuarios en línea
              </p>
            </div>
          </div>
          {/* Chat Principal */}
          <div className="p-4 flex flex-col overflow-y-auto h-125">
            {messages.map((msg) => (
              <div
                className={`my-2 flex w-full items-start ${
                  msg?.user_name == session?.user?.user_metadata?.full_name
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {/* Nombre del usuario */}

                <div className="flex flex-col w-full">
                  {msg?.user_name !== session?.user?.user_metadata?.full_name && (
                    <div className="text-xs opacity-75 pt-1 text-left">
                      {msg?.user_name}
                    </div>
                  )}
                  <div
                    className={`p-1 max-w-[70%] rounded-xl ${
                      msg?.user_name == session?.user?.user_metadata?.full_name
                        ? "bg-blue-600 text-white ml-auto"
                        : "bg-gray-300 text-gray-800 mr-auto"
                    }`}
                  >
                    <p key={`${msg.timestamp}-${msg.user_name}`}>
                      {msg.message}
                    </p>
                  </div>
                  {/* Timestamp */}
                  <div
                    className={`text-xs opacity-75 pt-1 ${
                      msg?.user_name == session?.user?.user_metadata?.full_name
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Input Mensaje */}
          <form
            onSubmit={sendMessage}
            className="flex flex-col sm:flex-row p-4 border-t broder-gray-700"
          >
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              type="text"
              placeholder="Participa en el chat!"
              className="p-2 w-full bg-[#00000040] rounded-lg"
            />
            <button className="mt-4 sm:mt-0 sm:ml-8 text-black bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg">
              Enviar
            </button>
          </form>
        </div>
      </div>
    );
  }
};

export default WatchParty;
