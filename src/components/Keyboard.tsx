import { useEffect } from "react";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

interface KeyboardProps {
  onKeyPress: (key: string) => void;
}

const Keyboard = ({ onKeyPress }: KeyboardProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key === "Enter" || key === "Backspace" || /^[a-zA-Z]$/.test(key)) {
        event.preventDefault();
        onKeyPress(key.toUpperCase());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onKeyPress]);

  return (
    <div className="flex flex-col gap-2 px-2 w-full max-w-[500px] mx-auto">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-[6px] w-full">
          {row.map((key) => {
            const label = key === "Backspace" ? "⌫" : key;
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key.toUpperCase())}
                className="font-bold border-0 h-[58px] w-[58px] px-3 cursor-pointer bg-gray-500 hover:bg-gray-700 rounded text-white text-xs uppercase"
              >
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;