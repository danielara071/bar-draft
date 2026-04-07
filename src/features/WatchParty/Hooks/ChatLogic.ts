import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../shared/services/supabaseClient";
import type { RealtimeChannel, Session } from "@supabase/supabase-js";
import type { ChatMessage } from "../Types/chatType";


const useWatchPartyChat = (session: Session | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [usersOnline, setUsersOnline] = useState<string[]>([]);
  const roomOneRef = useRef<RealtimeChannel | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollTop =
      chatContainerRef.current.scrollHeight;
  }
}, [messages]);

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
  return {
  messages,
  newMessage,
  setNewMessage,
  usersOnline,
  sendMessage,
  chatContainerRef,
};
};

export default useWatchPartyChat;