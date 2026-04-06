type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const ChatInput = ({ value, onChange, onSubmit }: ChatInputProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-3 p-3 border-t border-brand-gray-light bg-brand-white"
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder="Escribe un mensaje..."
        className="px-4 py-2 w-full text-sm text-brand-black bg-brand-white border border-brand-gray-light rounded-full focus:outline-none focus:ring-1 focus:ring-brand-crimson"
      />
      <button className="text-sm font-semibold text-brand-white bg-brand-crimson hover:opacity-90 py-2 px-5 rounded-full transition-opacity">
        Enviar
      </button>
    </form>
  );
};

export default ChatInput;
