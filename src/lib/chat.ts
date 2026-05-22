import { isTextUIPart } from 'ai'

// El modelo (qwen2.5) desobedece el prompt y genera tablas, listas, texto en chino
// y JSON basura. Esta función limpia todo eso del lado del cliente como segunda línea
// de defensa (la primera es maxTokens:80 en el servidor).
const STATS_KW = /\b(goles|asistencias|partidos|minutos|posici[oó]n|n[uú]mero|número|atajadas|goals?|assists?)\b/i

const sanitize = (text: string): string => {
  let s = text
    .replace(/!\[.*?\]\(.*?\)/gs, '')                         // imágenes markdown
    .replace(/https?:\/\/\S+/g, '')                            // URLs sueltas
    .replace(/\|[^|\n]+\|/g, '')                               // celdas de tabla markdown
    .replace(/^\s*[-:|]+\s*$/gm, '')                           // separadores de tabla  |---|
    .replace(/^\s*\d+\.\s+.+$/gm, '')                         // items de lista numerada
    .replace(/^\s*[-*•]\s+.+$/gm, '')                         // items de lista con bullet
    .replace(/\*\*([^*]+)\*\*/g, '$1')                        // **negrita** → texto plano
    .replace(/[一-鿿㐀-䶿＀-￯]+/g, '') // caracteres CJK (chino/japonés)
    .replace(/^(would you like|¿?(quieres|deseas|necesitas))\b.*/gim, '') // solo líneas que EMPIEZAN con pregunta de seguimiento
    .replace(/\n{3,}/g, '\n')
    .trim()

  // Cortar stats inline que aparecen DESPUÉS del primer signo de puntuación final.
  // Ej: "¡Aquí tienes a Cata Coll! 🙌 Posición: Portera Goles: 0" → "¡Aquí tienes a Cata Coll! 🙌"
  const firstPunct = s.search(/[!?]/)
  if (firstPunct > -1) {
    const statsPos = s.slice(firstPunct + 1).search(STATS_KW)
    if (statsPos > -1) s = s.slice(0, firstPunct + 1 + statsPos).trim()
  }

  // Seguridad final: si sigue siendo largo, tomar solo la primera oración corta
  if (s.length > 120) {
    const firstSentence = s.match(/^[^!?\n]*[!?]/)
    if (firstSentence) return firstSentence[0].trim()
    return (s.split('\n')[0] ?? '').trim().slice(0, 100)
  }

  return s
}

// Extrae el texto visible de un mensaje del AI SDK.
// Un mensaje puede contener varias parts: texto, tool-call, tool-result, etc.
// Filtramos solo las de texto para no exponer JSON de herramientas al usuario.
export const getMessageText = (message: any) => {
  const parts = message?.parts ?? []

  const raw = parts
    .filter((part: any) => isTextUIPart(part))
    .map((part: any) => part.text ?? '')
    .join('')

  // Solo sanitizamos mensajes del asistente — los del usuario se muestran tal cual.
  // Aplicar sanitize a mensajes del usuario borraba frases como "muéstrame los goles de X".
  return message?.role === 'assistant' ? sanitize(raw) : raw
}

