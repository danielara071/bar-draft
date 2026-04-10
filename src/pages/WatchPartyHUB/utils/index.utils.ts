import type { WatchPartyMatch } from "../interfaces/index.interfaces";

// Formatea un código raw (sin guión) a formato "XXX-XXXX"
export function formatPartyCode(raw: string): string {
  const clean = raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (clean.length <= 3) return clean;
  return `${clean.slice(0, 3)}-${clean.slice(3)}`;
}

// Sanitiza y convierte a mayúsculas un caracter de input de código
export function sanitizeCodeChar(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "").slice(-1).toUpperCase();
}

// Sanitiza y recorta un string pegado en el input de código
export function sanitizePastedCode(text: string, maxLength = 7): string {
  return text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, maxLength);
}

// Devuelve la label del badge según el tipo de partido
export function getMatchTypeLabel(type: WatchPartyMatch["type"]): string {
  return type === "femenil" ? "FEMENIL" : "VARONIL";
}

// Datos mock de las próximas watch parties del usuario
export const MY_PARTIES: WatchPartyMatch[] = [
  {
    id: 1,
    type: "femenil",
    title: "Barca vs Chelsea",
    competition: "UEFA Champions League – Cuartos de Final",
    time: "Hoy – 20:00",
    code: "FEM-2004",
  },
  {
    id: 2,
    type: "varonil",
    title: "Barca vs Valencia",
    competition: "La Liga – Jornada 26",
    time: "Mañana – 21:30",
    code: "VAR-2334",
  },
];

// Datos mock de partidos en vivo 
export const LIVE_PARTIES: WatchPartyMatch[] = [
  {
    id: 3,
    type: "femenil",
    title: "Barca vs Chelsea",
    competition: "UEFA Champions League – Cuartos de Final",
    time: "Hoy – 20:00",
    code: "FEM-2004",
  },
  {
    id: 4,
    type: "femenil",
    title: "Barca vs Chelsea",
    competition: "UEFA Champions League – Cuartos de Final",
    time: "Hoy – 20:00",
    code: "FEM-2004",
  },
  {
    id: 5,
    type: "femenil",
    title: "Barca vs Chelsea",
    competition: "UEFA Champions League – Cuartos de Final",
    time: "Hoy – 20:00",
    code: "FEM-2004",
  },
  {
    id: 6,
    type: "femenil",
    title: "Barca vs Chelsea",
    competition: "UEFA Champions League – Cuartos de Final",
    time: "Hoy – 20:00",
    code: "FEM-2004",
  },
];
