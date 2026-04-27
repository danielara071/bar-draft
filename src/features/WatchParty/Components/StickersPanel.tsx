type Sticker = {
  id: string;
  label: string;
  url: string;
};

type StickersPanelProps = {
  stickers: Sticker[];
  onSendSticker: (sticker: { id: string; url: string }) => void;
  onClose: () => void;
};

const StickersPanel = ({
  stickers,
  onSendSticker,
  onClose,
}: StickersPanelProps) => {
  return (
    <div className="p-3 border-b border-brand-gray-light bg-brand-white">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-brand-black">Stickers</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {stickers.map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            onClick={() => {
              onSendSticker({ id: sticker.id, url: sticker.url });
              onClose();
            }}
            className="rounded-lg border border-brand-gray-light p-1 hover:bg-brand-gray-light/20"
            title={sticker.label}
          >
            <img
              src={sticker.url}
              alt={sticker.label}
              className="w-16 h-16 object-contain mx-auto"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StickersPanel;
