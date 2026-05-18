export type ReportStatus = "pendiente" | "resuelto" | "descartado";

export type ReportMetrics = { pending: number; reviewed: number; banned: number; total: number };

export type ReportWithRelations = {
  id: number;
  denunciante_id: string;
  denunciado_id: string;
  watch_party_id: string | null;
  motivo: string;
  detalles: string | null;
  estado: ReportStatus;
  creado_en: string | null;
  resuelto_en: string | null;
  resuelto_por: string | null;
  denunciante?: { id: string; nombre: string | null; url_avatar: string | null } | null;
  denunciado?: {
    id: string;
    nombre: string | null;
    url_avatar: string | null;
    is_banned?: boolean | null;
  } | null;
  watch_party?: {
    id: string;
    name: string | null;
    home_team: string | null;
    away_team: string | null;
    match_date: string | null;
  } | null;
};

export type PendingReportCardData = {
  id: number;
  category: string;
  timestamp: string;
  matchLabel: string;
  reporter: { id: string; name: string; initials: string; avatarUrl: string | null };
  reported: {
    id: string;
    name: string;
    initials: string;
    avatarUrl: string | null;
    previousReports: number;
  };
};

export type ReviewedReportCardData = {
  id: number;
  summary: string;
  date: string;
  status: Exclude<ReportStatus, "pendiente">;
};
