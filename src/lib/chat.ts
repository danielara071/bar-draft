import { isTextUIPart } from 'ai'

// El modelo (qwen2.5) ignora las instrucciones del prompt y sigue metiendo imágenes
// markdown y estadísticas en el texto. Esta función los elimina del lado del cliente
// como salvaguarda, independientemente de lo que diga el sistema prompt.
const sanitize = (text: string): string =>
  text
    .replace(/!\[.*?\]\(.*?\)/gs, '')          // imágenes markdown  ![alt](url)
    .replace(/https?:\/\/\S+/g, '')             // URLs sueltas
    .replace(/^[^\S\r\n]*(goles|asistencias|partidos\s+jugados|minutos|posici[oó]n|n[uú]mero|atajadas|goles[\s_]recibidos)[^\n]*/gim, '') // líneas de stats
    .replace(/\n{3,}/g, '\n\n')
    .trim()

// Extrae el texto visible de un mensaje del AI SDK.
// Un mensaje puede contener varias parts: texto, tool-call, tool-result, etc.
// Filtramos solo las de texto para no exponer JSON de herramientas al usuario.
export const getMessageText = (message: any) => {
  const parts = message?.parts ?? []

  const raw = parts
    .filter((part: any) => isTextUIPart(part))
    .map((part: any) => part.text ?? '')
    .join('')

  return sanitize(raw)
}

