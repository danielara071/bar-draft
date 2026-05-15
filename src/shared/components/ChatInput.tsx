import type { FC } from 'react'
import type { ChatInputProps } from '../interfaces/chat'

export const ChatInput: FC<ChatInputProps> = ({
  input,
  setInput,
  isLoading,
  handleSubmit,
  embedded,
}) => {
  if (embedded) {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-3 py-2 border-t border-slate-100"
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe tu pregunta..."
          disabled={isLoading}
          className="flex-1 text-sm px-3 py-2 rounded-full border border-slate-200 focus:outline-none focus:border-[#004D98] disabled:opacity-50 transition-colors"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-white disabled:opacity-40 transition-opacity"
          style={{ background: '#004D98' }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
            <path
              d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
      <input
        value={input}
        onChange={event => setInput(event.target.value)}
        placeholder="Haz una pregunta"
        style={{ flex: 1, padding: '8px' }}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        Enviar
      </button>
    </form>
  )
}
