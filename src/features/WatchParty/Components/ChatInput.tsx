type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const ChatInput = ({ value, onChange, onSubmit }: ChatInputProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row p-4 border-t broder-gray-700"
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder="Participa en el chat!"
        className="p-2 w-full text-gray-200 bg-[#00000040] rounded-lg"
      />
      <button className="mt-4 sm:mt-0 sm:ml-8 text-black bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg">
        Enviar
      </button>
    </form>
  );
};

export default ChatInput;
