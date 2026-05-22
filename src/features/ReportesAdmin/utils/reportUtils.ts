import type { ReportWithRelations } from "../types/reportTypes";

export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "--";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};

export const formatReportDate = (iso?: string | null): string => {
  if (!iso) return "Fecha no disponible";
  const date = new Date(iso);
  const datePart = date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart} a las ${timePart}`;
};

export const formatWatchPartyLabel = (
  watchParty?: ReportWithRelations["watch_party"] | null
): string => {
  if (!watchParty) return "Sin watch party";
  return (
    watchParty.name?.trim() ||
    (watchParty.home_team && watchParty.away_team
      ? `${watchParty.home_team} vs ${watchParty.away_team}`
      : "Watch party")
  );
};

export const buildReviewedSummary = (reportedName: string, matchLabel: string): string =>
  !matchLabel || matchLabel === "Sin watch party"
    ? reportedName
    : `${reportedName} en '${matchLabel}'`;
