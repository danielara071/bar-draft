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