import { useEffect, useRef, type FC } from 'react'
import type { ChatMessagesProps } from '../interfaces/chat'

export const ChatMessages: FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  getMessageText,
  embedded,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (embedded) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-2">
        {messages.length === 0 && !isLoading && (
          <p className="text-center text-xs text-slate-400 mt-4">
            Hazme una pregunta sobre el Barça
          </p>
        )}
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-snug ${
                message.role === 'user'
                  ? 'text-white rounded-br-sm'
                  : 'bg-slate-100 text-slate-800 rounded-bl-sm'
              }`}
              style={message.role === 'user' ? { background: '#004D98' } : undefined}
            >
              {getMessageText(message)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-400 text-sm px-3 py-2 rounded-2xl rounded-bl-sm">
              <span className="animate-pulse">Escribiendo...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    )
  }

  return (
    <div
      style={{
        height: '400px',
        overflowY: 'auto',
        border: '1px solid #ccc',
        padding: '10px',
        marginBottom: '10px',
      }}
    >
      {messages.map(message => (
        <div key={message.id} style={{ marginBottom: '10px' }}>
          <strong>{message.role === 'user' ? 'Tú' : 'Qwen 2.5'}:</strong>
          <p>{getMessageText(message)}</p>
        </div>
      ))}
      {isLoading && <p>Pensando...</p>}
      <div ref={bottomRef} />
    </div>
  )
}
