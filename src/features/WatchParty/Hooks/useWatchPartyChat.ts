import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../shared/services/supabaseClient";
import type { RealtimeChannel, Session } from "@supabase/supabase-js";
import type { ChatMessage } from "../Types/chatType";

const useWatchPartyChat = (session: Session | null, roomCode: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [usersOnline, setUsersOnline] = useState<string[]>([]);
  const roomRef = useRef<RealtimeChannel | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Conectar al canal de la sala cuando hay sesión y código
  useEffect(() => {
    if (!session?.user || !roomCode) return;

    const channel = supabase.channel(`watchparty-${roomCode}`, {
      config: {
        broadcast: { self: true },
        presence: { key: session.user.id },
      },
    });

    roomRef.current = channel;

    channel.on("broadcast", { event: "message" }, (payload) => {
      setMessages((prev) => [...prev, payload.payload as ChatMessage]);
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      setUsersOnline(Object.keys(state));
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ id: session.user.id });
      }
    });

    return () => {
      channel.unsubscribe();
      roomRef.current = null;
    };
  }, [session, roomCode]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!roomRef.current || !newMessage.trim()) return;

    await roomRef.current.send({
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

  return { messages, newMessage, setNewMessage, usersOnline, sendMessage, chatContainerRef };
};

export default useWatchPartyChat;
