import { MessageCircle } from "lucide-react";

type ChatHeaderProps = {
  roomCode?: string;
};

const ChatHeader = ({ roomCode }: ChatHeaderProps) => {
  return (
    <div className="h-14 border-b border-brand-gray-light px-4 flex items-center justify-between bg-brand-white">
      <div className="flex items-center gap-2 text-brand-black">
        <MessageCircle size={16} className="text-brand-crimson" />
        <p className="text-sm font-semibold">Chat en vivo</p>
      </div>
      {roomCode && (
        <p className="text-xs text-brand-gray-mid font-mono tracking-widest">
          Sala: <span className="text-brand-crimson font-bold">{roomCode}</span>
        </p>
      )}
    </div>
  );
};

export default ChatHeader;