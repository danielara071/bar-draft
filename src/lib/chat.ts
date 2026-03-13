import { isTextUIPart } from 'ai'


export const getMessageText = (message: any) => { // Convierte un mensaje del chat en el texto que se muestra en pantalla.
  const parts = message?.parts ?? []

  return parts
    .filter((part: any) => isTextUIPart(part)) // descarta tool-calls y otros tipos, deja solo texto
    .map((part: any) => part.text ?? '')
    .join('')
}

