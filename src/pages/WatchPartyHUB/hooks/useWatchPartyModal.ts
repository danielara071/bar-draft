import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../shared/services/supabaseClient";
import type {
  CreatePartyForm,
  Fixture,
  ModalStep,
  Privacy,
} from "../interfaces/index.interfaces";

const INITIAL_FORM: CreatePartyForm = {
  name: "",
  fixture_id: "",
  privacy: "publica",
};

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
  error: string | null;
  setName: (name: string) => void;
  setFixtureId: (id: string) => void;
  setPrivacy: (privacy: Privacy) => void;
  handleCreate: () => Promise<void>;
  handleClose: () => void;
  handleGoToRoom: () => void;
}

export function useWatchPartyModal(
  userId: string | undefined,
  fixtures: Fixture[],
  onClose?: () => void
): UseWatchPartyModalReturn {
  const navigate = useNavigate();
  const [step, setStep] = useState<ModalStep>(1);
  const [form, setForm] = useState<CreatePartyForm>(INITIAL_FORM);
  const [roomCode, setRoomCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = Boolean(form.name && form.fixture_id && userId);

  const setName = (name: string) => setForm((prev) => ({ ...prev, name }));
  const setFixtureId = (id: string) => setForm((prev) => ({ ...prev, fixture_id: id }));
  const setPrivacy = (privacy: Privacy) => setForm((prev) => ({ ...prev, privacy }));

  const handleCreate = async (): Promise<void> => {
    if (!canSubmit || !userId) return;
    setIsLoading(true);
    setError(null);

    const code = generateRoomCode();
    const fixture = fixtures.find((f) => String(f.fixture_id) === form.fixture_id);

    if (!fixture) {
      setError("Partido no encontrado");
      setIsLoading(false);
      return;
    }

    const { error: sbError } = await supabase.from("watch_parties").insert({
      code,
      name: form.name,
      fixture_id: fixture.fixture_id,
      home_team: fixture.homeTeam,
      away_team: fixture.awayTeam,
      match_date: fixture.date,
      privacy: form.privacy,
      created_by: userId,
    });

    if (sbError) {
      setError(sbError.message);
      setIsLoading(false);
      return;
    }

    setRoomCode(code);
    setIsLoading(false);
    setStep(2);
  };

  const handleClose = (): void => {
    setStep(1);
    setForm(INITIAL_FORM);
    setRoomCode("");
    setError(null);
    onClose?.();
  };

  const handleGoToRoom = (): void => {
    onClose?.();
    navigate(`/watchParty/${roomCode}`);
  };

  return {
    step, form, roomCode, canSubmit, isLoading, error,
    setName, setFixtureId, setPrivacy,
    handleCreate, handleClose, handleGoToRoom,
  };
}