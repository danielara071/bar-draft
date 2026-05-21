export type ReportReason =
  | "Lenguaje ofensivo"
  | "Acoso"
  | "Spam"
  | "Contenido inapropiado"
  | "Otro";

export type WatchPartyReportDraft = {
  reportedUserName: string;
  reportedUserId?: string;
  roomCode: string;
  motivo: ReportReason;
  detalles: string;
};

export type WatchPartyReportInsert = {
  denunciante_id: string;
  denunciado_id: string;
  watch_party_id: string | null;
  motivo: ReportReason;
  detalles: string | null;
};

export type WatchPartyReportCreated = {
  id: number;
};