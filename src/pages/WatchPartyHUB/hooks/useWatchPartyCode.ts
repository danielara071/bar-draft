import { useState, useRef, useCallback, type KeyboardEvent, type ClipboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../shared/services/supabaseClient";
import { sanitizeCodeChar, sanitizePastedCode } from "../utils/index.utils";

const TOTAL = 7; // 3 letras + guión + 4 números = 7 caracteres sin guión

interface UseWatchPartyCodeReturn {
  code: string[];
  refs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  isComplete: boolean;
  isValidating: boolean;
  validationError: string | null;
  handleChange: (i: number, val: string) => void;
  handleKeyDown: (i: number, e: KeyboardEvent<HTMLInputElement>) => void;
  handlePaste: (e: ClipboardEvent<HTMLInputElement>) => void;
  handleJoin: () => Promise<void>;
}

export function useWatchPartyCode(onJoin?: (code: string) => void): UseWatchPartyCodeReturn {
  const navigate = useNavigate();
  const [code, setCode] = useState<string[]>(Array(TOTAL).fill(""));
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // 7 chars sin guión = completo
  const isComplete = code.join("").length === TOTAL;

  const handleChange = (i: number, val: string): void => {
    const char = sanitizeCodeChar(val);
    const next = [...code];
    next[i] = char;
    setCode(next);
    setValidationError(null);
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
    setValidationError(null);
    refs.current[Math.min(pasted.length, TOTAL - 1)]?.focus();
  };

  const handleJoin = useCallback(async (): Promise<void> => {
    if (!isComplete) return;

    // Formatear: primeros 3 + guión + últimos 4 → "ABC-1234"
    const raw = code.join("");
    const formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;

    setIsValidating(true);
    setValidationError(null);

    // Validar en Supabase que el código existe antes de navegar
    const { data, error } = await supabase
      .rpc("validate_room_code", { p_code: formatted });

    setIsValidating(false);

    if (error || !data || data.length === 0) {
      setValidationError("Código no encontrado. Verifica e intenta de nuevo.");
      return;
    }

    onJoin?.(formatted);
    navigate(`/watchParty/${formatted}`);
  }, [code, isComplete, navigate, onJoin]);

  return {
    code, refs, isComplete, isValidating, validationError,
    handleChange, handleKeyDown, handlePaste, handleJoin,
  };
}