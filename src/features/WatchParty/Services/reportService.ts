import { supabase } from "../../../shared/services/supabaseClient";
import type {
  WatchPartyReportCreated,
  WatchPartyReportDraft,
  WatchPartyReportInsert,
} from "../Types/reportType";

export const createWatchPartyReport = async (
  draft: WatchPartyReportDraft,
): Promise<WatchPartyReportCreated> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (userError || !userId) {
    throw new Error("Debes iniciar sesión para reportar.");
  }

  if (!draft.reportedUserId) {
    throw new Error("No se pudo identificar al usuario denunciado.");
  }

  const { data: watchParty, error: watchPartyError } = await supabase
    .from("watch_parties")
    .select("id")
    .eq("code", draft.roomCode)
    .maybeSingle();

  if (watchPartyError) {
    throw new Error(watchPartyError.message);
  }

  const payload: WatchPartyReportInsert = {
    denunciante_id: userId,
    denunciado_id: draft.reportedUserId,
    watch_party_id: watchParty?.id ?? null,
    motivo: draft.motivo,
    detalles: draft.detalles || null,
  };

  const { data, error } = await supabase
    .from("reportes")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as WatchPartyReportCreated;
};