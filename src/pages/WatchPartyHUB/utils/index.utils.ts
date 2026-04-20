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


