import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../shared/services/supabaseClient";
import type { RealtimeChannel, Session } from "@supabase/supabase-js";
import type { ChatMessage } from "../Types/chatType";

const stickers = [
  { id: "saludo", label: "Saludo", url: "/stickers/waveEmoji.png" },
  { id: "celebracion", label: "Celebracion", url: "/stickers/celebrationEmoji.png" },
  { id: "tristeza", label: "Tristeza", url: "/stickers/sadEmoji.png" },
  { id: "amor", label: "Amor", url: "/stickers/loveEmoji.png" },
  { id: "enojo", label: "Enojo", url: "/stickers/rageEmoji.png" },
];

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

  // Canal dinámico por sala
  useEffect(() => {
    if (!session?.user || !roomCode) return;

    // Cada sala tiene su propio canal: "watchparty-ABC-1234"
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
  }, [session, roomCode]); // se reconecta si cambia la sala

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!roomRef.current || !newMessage.trim()) return;

    await roomRef.current.send({
      type: "broadcast",
      event: "message",
      payload: {
        type: "text",
        message: newMessage,
        user_name: session?.user?.user_metadata?.full_name,
        avatar: session?.user?.user_metadata?.avatar,
        timestamp: new Date().toISOString(),
      },
    });

    setNewMessage("");
  };

  const sendSticker = async (sticker: { id: string; url: string }) => {
  if (!roomRef.current) return;
  if (!sticker.url.startsWith("/stickers/")) return; // simple safety check

  await roomRef.current.send({
    type: "broadcast",
    event: "message",
    payload: {
      type: "sticker",
      stickerId: sticker.id,
      stickerUrl: sticker.url,
      user_name: session?.user?.user_metadata?.full_name,
      avatar: session?.user?.user_metadata?.avatar,
      timestamp: new Date().toISOString(),
    },
  });
};

  return { messages, newMessage, setNewMessage, usersOnline, sendMessage, chatContainerRef, stickers, sendSticker };
};

export default useWatchPartyChat;