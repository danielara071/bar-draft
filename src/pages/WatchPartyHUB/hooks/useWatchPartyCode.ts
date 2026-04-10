import { useState, useRef, type KeyboardEvent, type ClipboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { sanitizeCodeChar, sanitizePastedCode } from "../utils/index.utils";

const TOTAL = 7;

interface UseWatchPartyCodeReturn {
  code: string[];
  refs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  isComplete: boolean;
  handleChange: (i: number, val: string) => void;
  handleKeyDown: (i: number, e: KeyboardEvent<HTMLInputElement>) => void;
  handlePaste: (e: ClipboardEvent<HTMLInputElement>) => void;
  handleJoin: () => void;
}

export function useWatchPartyCode(onJoin?: (code: string) => void): UseWatchPartyCodeReturn {
  const navigate = useNavigate();
  const [code, setCode] = useState<string[]>(Array(TOTAL).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const isComplete = code.join("").length === TOTAL;

  const handleChange = (i: number, val: string): void => {
    const char = sanitizeCodeChar(val);
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
    const pasted = sanitizePastedCode(e.clipboardData.getData("text"), TOTAL);
    const next = [...code];
    [...pasted].forEach((c, idx) => { if (idx < TOTAL) next[idx] = c; });
    setCode(next);
    refs.current[Math.min(pasted.length, TOTAL - 1)]?.focus();
  };

  const handleJoin = (): void => {
    if (!isComplete) return;
    // Los primeros 3 chars + los últimos 4 forman el código con guión
    const raw = code.join("");
    const formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    onJoin?.(formatted);
    navigate(`/watchParty/${formatted}`);
  };

  return { code, refs, isComplete, handleChange, handleKeyDown, handlePaste, handleJoin };
}