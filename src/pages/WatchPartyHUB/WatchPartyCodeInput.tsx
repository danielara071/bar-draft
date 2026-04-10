import { useState, useRef, type KeyboardEvent, type ClipboardEvent } from "react";


interface WatchPartyCodeInputProps {
  onJoin?: (code: string) => void;
}

const TOTAL = 7;

export default function WatchPartyCodeInput({ onJoin }: WatchPartyCodeInputProps) {
  const [code, setCode] = useState<string[]>(Array(TOTAL).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string): void => {
    const char = val.replace(/[^a-zA-Z0-9]/g, "").slice(-1).toUpperCase();
    const next = [...code];
    next[i] = char;
    setCode(next);
    if (char && i < TOTAL - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, TOTAL);
    const next = [...code];
    [...pasted].forEach((c, idx) => {
      if (idx < TOTAL) next[idx] = c;
    });
    setCode(next);
    const lastFilled = Math.min(pasted.length, TOTAL - 1);
    refs.current[lastFilled]?.focus();
  };

  const isComplete = code.join("").length === TOTAL;

  const handleJoin = (): void => {
    if (isComplete) onJoin?.(code.join(""));
  };

  return (
    <div className="wp-code">
      <p className="wp-code__label">¿Tienes un Código?</p>
      <div className="wp-code__row">
        <div className="wp-code__inputs">
          {[0, 1, 2].map((i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              className="wp-code__box"
              maxLength={1}
              value={code[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              inputMode="text"
              autoComplete="off"
            />
          ))}
          <span className="wp-code__sep">—</span>
          {[3, 4, 5, 6].map((i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              className="wp-code__box"
              maxLength={1}
              value={code[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="text"
              autoComplete="off"
            />
          ))}
        </div>
        <button
          className="wp-code__btn"
          onClick={handleJoin}
          disabled={!isComplete}
        >
          Unirme →
        </button>
      </div>
    </div>
  );
}
