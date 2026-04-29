import { useState } from "react";
import { SmilePlus, Send } from "lucide-react";
import StickersPanel from "./StickersPanel";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  stickers: { id: string; label: string; url: string }[];
  onSendSticker: (sticker: { id: string; url: string }) => void;
};

const ChatInput = ({
  value,
  onChange,
  onSubmit,
  stickers,
  onSendSticker,
}: ChatInputProps) => {
  const [showStickers, setShowStickers] = useState(false);
  return (
    <div className="items-center gap-3 p-3 border-t border-brand-gray-light bg-brand-white">
      {showStickers && (
        <StickersPanel
          stickers={stickers}
          onSendSticker={onSendSticker}
          onClose={() => setShowStickers(false)}
        />
      )}
      <form className="flex space-x-3" onSubmit={onSubmit}>
        <button
          type="button"
          onClick={() => setShowStickers((prev) => !prev)}
          className="text-sm font-semibold text-brand-black border border-brand-gray-light hover:bg-brand-gray-light/30 py-2 px-3 rounded-full transition-colors"
        >
          <SmilePlus />
        </button>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type="text"
          placeholder="Escribe un mensaje..."
          className="px-4 py-2 w-full text-sm text-brand-black bg-brand-white border border-brand-gray-light rounded-full focus:outline-none focus:ring-1 focus:ring-brand-crimson"
        />
        <button className="text-sm font-semibold text-brand-white bg-brand-crimson hover:opacity-90 py-2 px-4 rounded-full transition-opacity">
          <Send />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
