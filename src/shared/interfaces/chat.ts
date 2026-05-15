import type { FormEvent } from 'react'
import type { UseChatHelpers } from '@ai-sdk/react'

export type ChatMessage = UseChatHelpers<any>['messages'][number]

// Lo que necesita el componente que muestra la lista de mensajes
export interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading: boolean
  getMessageText: (message: ChatMessage) => string
  embedded?: boolean
}

// Lo que necesita el componente del input y el botón Enviar
export interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  isLoading: boolean
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  embedded?: boolean
}

