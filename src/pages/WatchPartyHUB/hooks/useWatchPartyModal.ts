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


// El código REAL y ÚNICO lo genera la función SQL en Supabase
function generateLocalCode(): string {
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

  const canSubmit = Boolean(form.name.trim() && form.fixture_id && userId);

  const setName = (name: string) => setForm((prev) => ({ ...prev, name }));
  const setFixtureId = (id: string) => setForm((prev) => ({ ...prev, fixture_id: id }));
  const setPrivacy = (privacy: Privacy) => setForm((prev) => ({ ...prev, privacy }));

  const handleCreate = async (): Promise<void> => {
    if (!canSubmit || !userId) return;
    setIsLoading(true);
    setError(null);

    // 1. Buscar fixture seleccionado
    const fixture = fixtures.find((f) => f.fixture_id === form.fixture_id);
    if (!fixture) {
      setError("Partido no encontrado. Selecciona uno de la lista.");
      setIsLoading(false);
      return;
    }

    // 2. Obtener código único desde Supabase (garantiza no duplicados)
    let code: string;
    try {
      const { data: codeData, error: codeError } = await supabase
        .rpc("generate_unique_room_code");

      if (codeError || !codeData) {
        // Fallback: generar local (menos seguro pero funcional)
        code = generateLocalCode();
      } else {
        code = codeData as string;
      }
    } catch {
      code = generateLocalCode();
    }

    // 3. Insertar en Supabase con select() para confirmar persistencia
    const { data, error: sbError } = await supabase
      .from("watch_parties")
      .insert({
        code,
        name: form.name.trim(),
        fixture_id: fixture.fixture_id,   // string: "varonil-xxx"
        home_team: fixture.homeTeam,
        away_team: fixture.awayTeam,
        match_date: fixture.date,
        privacy: form.privacy,
        created_by: userId,
      })
      .select("code")                      // confirma que realmente se insertó
      .single();

    if (sbError) {
      // Código duplicado (constraint UNIQUE)
      if (sbError.code === "23505") {
        setError("Ocurrió un conflicto al generar la sala. Intenta de nuevo.");
      } else if (sbError.code === "42501") {
        setError("No tienes permisos para crear una sala. Verifica tu sesión.");
      } else {
        setError(`Error al crear la sala: ${sbError.message}`);
      }
      setIsLoading(false);
      return;
    }

    // 4. Usar el código confirmado por la BD
    const confirmedCode = data?.code ?? code;
    setRoomCode(confirmedCode);
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