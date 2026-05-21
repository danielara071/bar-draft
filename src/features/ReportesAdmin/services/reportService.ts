import { supabase } from "../../../shared/services/supabaseClient";
import type { BanDuration, ReportMetrics, ReportWithRelations } from "../types/reportTypes";

const REVIEWED_STATES = ["resuelto", "descartado"] as const;
const REPORT_SELECT =
  "id,denunciante_id,denunciado_id,watch_party_id,motivo,detalles,estado,creado_en,resuelto_en,resuelto_por,denunciante:profiles!reportes_denunciante_id_fkey(id,nombre,url_avatar),denunciado:profiles!reportes_denunciado_id_fkey(id,nombre,url_avatar,is_banned),watch_party:watch_parties(id,name,home_team,away_team,match_date)";

type ListResult = PromiseLike<{ data: unknown; error: { message: string } | null }>;
type CountResult = PromiseLike<{ count: number | null; error: { message: string } | null }>;

const list = async (query: ListResult) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as ReportWithRelations[];
};

const count = async (query: CountResult) => {
  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
};

export const fetchPendingReports = () =>
  list(
    supabase
      .from("reportes")
      .select(REPORT_SELECT)
      .eq("estado", "pendiente")
      .order("creado_en", { ascending: false })
  );

export const fetchReviewedReports = (limit = 5) =>
  list(
    supabase
      .from("reportes")
      .select(REPORT_SELECT)
      .in("estado", REVIEWED_STATES)
      .order("resuelto_en", { ascending: false, nullsFirst: false })
      .order("creado_en", { ascending: false })
      .limit(limit)
  );

export const fetchPreviousReportsCount = (denunciadoId: string, excludeReportId?: number) => {
  let query = supabase
    .from("reportes")
    .select("id", { count: "exact", head: true })
    .eq("denunciado_id", denunciadoId);
  if (excludeReportId) query = query.neq("id", excludeReportId);
  return count(query);
};

export const fetchReportMetrics = async (): Promise<ReportMetrics> => {
  const [pending, reviewed, total, banned] = await Promise.all([
    count(supabase.from("reportes").select("id", { count: "exact", head: true }).eq("estado", "pendiente")),
    count(supabase.from("reportes").select("id", { count: "exact", head: true }).in("estado", REVIEWED_STATES)),
    count(supabase.from("reportes").select("id", { count: "exact", head: true })),
    count(supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_banned", true)),
  ]);
  return { pending, reviewed, total, banned };
};

export const updateReportStatus = async (
  reportId: number,
  status: "resuelto" | "descartado",
  resolvedBy?: string | null
) => {
  const { error } = await supabase
    .from("reportes")
    .update({ estado: status, resuelto_en: new Date().toISOString(), resuelto_por: resolvedBy ?? null })
    .eq("id", reportId);
  if (error) throw new Error(error.message);
};

export const banUserAndResolveReport = async (
  reportId: number,
  resolvedBy?: string | null,
  duration?: BanDuration
) => {
  void duration;
  const { data: report, error: reportError } = await supabase
    .from("reportes")
    .select("denunciado_id")
    .eq("id", reportId)
    .single();

  if (reportError) throw new Error(reportError.message);

  const { error } = await supabase.from("profiles").update({ is_banned: true }).eq("id", report.denunciado_id);
  if (error) throw new Error(error.message);
  await updateReportStatus(reportId, "resuelto", resolvedBy);
};
