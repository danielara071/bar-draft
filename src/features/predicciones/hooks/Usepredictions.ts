import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../shared/services/supabaseClient";
import type {
  PredictionForm,
  WinnerOption,
  TotalGoalsOption,
  HalftimeOption,
} from "../interfaces/interfaces.ts";

const INITIAL_FORM: PredictionForm = {
  winner:      null,
  scoreHome:   0,
  scoreAway:   0,
  firstGoaler: "",
  totalGoals:  null,
  halftime:    null,
};

interface UsePredictionsReturn {
  form:          PredictionForm;
  isLoading:     boolean;
  error:         string | null;
  setWinner:     (v: WinnerOption) => void;
  setScoreHome:  (v: number) => void;
  setScoreAway:  (v: number) => void;
  setFirstGoaler:(v: string) => void;
  setTotalGoals: (v: TotalGoalsOption) => void;
  setHalftime:   (v: HalftimeOption) => void;
  handleSave:    () => Promise<void>;
  handleSkip:    () => void;
}

export function usePredictions(
  userId:    string | undefined,
  roomCode:  string,
  fixtureId: string,
  onDone:    () => void
): UsePredictionsReturn {
  const navigate  = useNavigate();
  const [form, setForm]       = useState<PredictionForm>(INITIAL_FORM);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const setWinner      = (v: WinnerOption)      => setForm(p => ({ ...p, winner: v }));
  const setScoreHome   = (v: number)             => setForm(p => ({ ...p, scoreHome: Math.max(0, v) }));
  const setScoreAway   = (v: number)             => setForm(p => ({ ...p, scoreAway: Math.max(0, v) }));
  const setFirstGoaler = (v: string)             => setForm(p => ({ ...p, firstGoaler: v }));
  const setTotalGoals  = (v: TotalGoalsOption)   => setForm(p => ({ ...p, totalGoals: v }));
  const setHalftime    = (v: HalftimeOption)     => setForm(p => ({ ...p, halftime: v }));

  const handleSave = async (): Promise<void> => {
    if (!userId) {
      setError("Debes iniciar sesión para guardar predicciones.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: sbError } = await supabase
      .from("predictions")
      .upsert(
        {
          user_id:      userId,
          room_code:    roomCode,
          fixture_id:   fixtureId,
          winner:       form.winner,
          score_home:   form.scoreHome,
          score_away:   form.scoreAway,
          first_goaler: form.firstGoaler.trim() || null,
          total_goals:  form.totalGoals,
          halftime:     form.halftime,
        },
        { onConflict: "user_id,room_code" }   // Si ya predijo, actualiza
      );

    setLoading(false);

    if (sbError) {
      setError("No se pudieron guardar las predicciones. Intenta de nuevo.");
      return;
    }

    onDone();
  };

  const handleSkip = (): void => {
    onDone();
  };

  return {
    form, isLoading, error,
    setWinner, setScoreHome, setScoreAway,
    setFirstGoaler, setTotalGoals, setHalftime,
    handleSave, handleSkip,
  };
}