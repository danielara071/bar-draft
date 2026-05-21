import { isTextUIPart } from 'ai'

// Extrae el texto visible de un mensaje del AI SDK.
// Un mensaje puede contener varias parts: texto, tool-call, tool-result, etc.
// Filtramos solo las de texto para no exponer JSON de herramientas al usuario.
export const getMessageText = (message: any) => {
  const parts = message?.parts ?? []

  return parts
    .filter((part: any) => isTextUIPart(part))
    .map((part: any) => part.text ?? '')
    .join('') // join sin separador porque el texto ya viene con espacios/saltos del modelo
}

