import { useState, type FormEvent } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { ChatMessage } from '../interfaces/chat'
import { getMessageText } from '../../lib/chat'

export const useChatSession = () => {
  const [input, setInput] = useState('')

  const {
    messages,
    sendMessage,
    status,
    error
  } = useChat({
    // DefaultChatTransport es obligatorio para Generative UI: el transport por defecto
    // de useChat no reenvía los tool-results al cliente, por lo que collectGenUI
    // nunca encontraría parts con state='output-available'.
    transport: new DefaultChatTransport({ api: '/api/chat' })
  })

  // 'submitted' = mensaje enviado pero el servidor aún no emite el primer chunk.
  // 'streaming' = chunks llegando. Ambos estados deben bloquear el input para
  // evitar envíos duplicados durante la respuesta.
  const isLoading = status === 'streaming' || status === 'submitted'

  // Envía el mensaje al backend y limpia el input (no hace nada si está vacío o ya está cargando)
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    sendMessage({ text })
    setInput('')
  }

  const getTextFromMessage = (message: ChatMessage) => getMessageText(message)

  return {
    input,
    setInput,
    messages,
    error,
    isLoading,
    handleSubmit,
    getMessageText: getTextFromMessage
  }
}

