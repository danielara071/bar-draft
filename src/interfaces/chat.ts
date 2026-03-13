import type { FormEvent } from 'react'
import type { UseChatHelpers } from '@ai-sdk/react'


export type ChatMessage = UseChatHelpers<any>['messages'][number]

export interface ChatMessagesProps { // Lo que necesita el componente que muestra la lista de mensajes
  messages: ChatMessage[]
  isLoading: boolean
  getMessageText: (message: ChatMessage) => string
}

export interface ChatInputProps { // Lo que necesita el componente del input y el botón Enviar
  input: string
  setInput: (value: string) => void
  isLoading: boolean
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
}

