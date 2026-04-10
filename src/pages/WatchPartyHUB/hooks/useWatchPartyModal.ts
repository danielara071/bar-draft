import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CreatePartyForm, ModalStep, Privacy } from "../interfaces/index.interfaces";

const INITIAL_FORM: CreatePartyForm = {
  name: "",
  match: "",
  privacy: "publica",
};

// Genera un código estilo "ABC-1234"
function generateRoomCode(): string {
  const letters = Math.random().toString(36).substring(2, 5).toUpperCase();
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${letters}-${numbers}`;
}

interface UseWatchPartyModalReturn {
  step: ModalStep;
  form: CreatePartyForm;
  roomCode: string;
  canSubmit: boolean;
  isLoading: boolean;
  setName: (name: string) => void;
  setMatch: (match: string) => void;
  setPrivacy: (privacy: Privacy) => void;
  handleCreate: () => Promise<void>;
  handleClose: () => void;
  handleGoToRoom: () => void;
}

export function useWatchPartyModal(onClose?: () => void): UseWatchPartyModalReturn {
  const navigate = useNavigate();
  const [step, setStep] = useState<ModalStep>(1);
  const [form, setForm] = useState<CreatePartyForm>(INITIAL_FORM);
  const [roomCode, setRoomCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const canSubmit = Boolean(form.name && form.match);

  const setName = (name: string) => setForm((prev) => ({ ...prev, name }));
  const setMatch = (match: string) => setForm((prev) => ({ ...prev, match }));
  const setPrivacy = (privacy: Privacy) => setForm((prev) => ({ ...prev, privacy }));

  const handleCreate = async (): Promise<void> => {
    if (!canSubmit) return;
    setIsLoading(true);

    // Genera el código de sala
    const code = generateRoomCode();
    setRoomCode(code);

    // Aquí puedes persistir la sala en Supabase cuando tengas la tabla lista:
    // await supabase.from("watch_parties").insert({ code, name: form.name, match: form.match, privacy: form.privacy });

    setIsLoading(false);
    setStep(2);
  };

  const handleClose = (): void => {
    setStep(1);
    setForm(INITIAL_FORM);
    setRoomCode("");
    onClose?.();
  };

  // Navega directamente a la sala al hacer clic en "Ir a mi Watch Party"
  const handleGoToRoom = (): void => {
    onClose?.();
    navigate(`/watchParty/${roomCode}`);
  };

  return {
    step,
    form,
    roomCode,
    canSubmit,
    isLoading,
    setName,
    setMatch,
    setPrivacy,
    handleCreate,
    handleClose,
    handleGoToRoom,
  };
}