import { useState } from "react";
import { supabase } from "../../../shared/services/supabaseClient";
import type {
  CreatePartyForm,
  Fixture,
  ModalStep,
  Privacy,
  WatchPartyMatch,
} from "../interfaces/index.interfaces";

const INITIAL_FORM: CreatePartyForm = {
  name: "",
  fixture_id: "",
  privacy: "publica",
};

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
  // Ya no expone handleGoToRoom — WatchPartyPage maneja la navegación
  handleGoToPredicciones: () => void;
}

export function useWatchPartyModal(
  userId: string | undefined,
  fixtures: Fixture[],
  onClose?: () => void,
  // Callback que recibe el match recién creado para abrir PrediccionesModal
  onCreated?: (match: WatchPartyMatch) => void,
): UseWatchPartyModalReturn {
  const [step, setStep] = useState<ModalStep>(1);
  const [form, setForm] = useState<CreatePartyForm>(INITIAL_FORM);
  const [roomCode, setRoomCode] = useState<string>("");
  const [createdMatch, setCreatedMatch] = useState<WatchPartyMatch | null>(null);
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

    const fixture = fixtures.find((f) => f.fixture_id === form.fixture_id);
    if (!fixture) {
      setError("Partido no encontrado. Selecciona uno de la lista.");
      setIsLoading(false);
      return;
    }

    let code: string;
    try {
      const { data: codeData, error: codeError } = await supabase
        .rpc("generate_unique_room_code");
      code = codeError || !codeData ? generateLocalCode() : (codeData as string);
    } catch {
      code = generateLocalCode();
    }

    const { data, error: sbError } = await supabase
      .from("watch_parties")
      .insert({
        code,
        name: form.name.trim(),
        fixture_id: fixture.fixture_id,
        home_team: fixture.homeTeam,
        away_team: fixture.awayTeam,
        match_date: fixture.date,
        privacy: form.privacy,
        created_by: userId,
      })
      .select("code")
      .single();

    if (sbError) {
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

    const confirmedCode = data?.code ?? code;

    // Construir el WatchPartyMatch para pasarlo a PrediccionesModal
    const newMatch: WatchPartyMatch = {
      id: fixture.fixture_id,
      type: fixture.category,
      title: `${fixture.homeTeam} vs ${fixture.awayTeam}`,
      competition: fixture.competition,
      time: new Date(fixture.date).toLocaleString("es-MX", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      code: confirmedCode,
      home_team: fixture.homeTeam,
      away_team: fixture.awayTeam,
      match_date: fixture.date,
    };

    setRoomCode(confirmedCode);
    setCreatedMatch(newMatch);
    setIsLoading(false);
    setStep(2);
  };

  // Se llama desde el botón "Ir a mi Watch Party" en el step 2
  // Cierra el modal de creación y dispara onCreated → WatchPartyPage abre PrediccionesModal
  const handleGoToPredicciones = (): void => {
    if (createdMatch && onCreated) {
      onCreated(createdMatch);
    }
    handleClose();
  };

  const handleClose = (): void => {
    setStep(1);
    setForm(INITIAL_FORM);
    setRoomCode("");
    setCreatedMatch(null);
    setError(null);
    onClose?.();
  };

  return {
    step, form, roomCode, canSubmit, isLoading, error,
    setName, setFixtureId, setPrivacy,
    handleCreate, handleClose, handleGoToPredicciones,
  };
}