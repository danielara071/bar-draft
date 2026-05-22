import { useEffect, useRef, type FC } from 'react'
import type { ChatMessagesProps } from '../interfaces/chat'
import { collectGenUI } from '../genui/registry'

export const ChatMessages: FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  getMessageText,
  embedded,
  logoUrl,
  userAvatarUrl,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null)

  // cada vez que llega un mensaje nuevo bajamos al fondo automáticamente
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (embedded) {
    return (
      // min-h-0 es necesario porque flex-1 en un hijo flex no colapsa sin él:
      // sin min-h-0 el div crece más allá del panel y overflow-y-auto no activa scroll.
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-2">
        {messages.map(message => {
          const isUser = message.role === 'user'
          // Los nodos GenUI solo existen en mensajes del asistente; el usuario no llama tools.
          const genUI = !isUser ? collectGenUI(message) : []
          const text = getMessageText(message)

          return (
            // message.id es estable (generado por el SDK), se puede usar como key.
            <div key={message.id} className="flex flex-col gap-2">

              {/* Generative UI: el modelo eligió qué componente renderizar */}
              {genUI}

              {/* burbuja de texto (solo si hay texto que mostrar) */}
              {text && (
                <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {/* avatar del asistente, solo en mensajes de la izquierda */}
                  {!isUser && (
                    <img
                      src={logoUrl}
                      alt="Barçabot"
                      className="w-6 h-6 rounded-full object-contain flex-shrink-0 bg-white border border-slate-200"
                    />
                  )}

                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-snug ${
                      isUser
                        ? 'text-white rounded-br-sm'
                        : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                    }`}
                    // color en inline style para no depender de una clase arbitraria de Tailwind
                    style={isUser ? { background: '#004D98' } : undefined}
                  >
                    {text}
                  </div>

                  {/*foto perfil del usuario, solo en mensajes de la derecha */}
                  {isUser && (
                    userAvatarUrl
                      ? <img
                          src={userAvatarUrl}
                          alt="Tú"
                          className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                        />
                      : <div className="w-6 h-6 rounded-full flex-shrink-0 bg-slate-300 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-500" fill="currentColor">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                          </svg>
                        </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {isLoading && (
          <div className="flex items-end gap-2 justify-start">
            <img
              src={logoUrl}
              alt="Barçabot"
              className="w-6 h-6 rounded-full object-contain flex-shrink-0 bg-white border border-slate-200"
            />
            <div className="bg-slate-100 text-slate-400 text-sm px-3 py-2 rounded-2xl rounded-bl-sm">
              <span className="animate-pulse">Escribiendo...</span>
            </div>
          </div>
        )}

        {/* div invisible al que hacemos scroll para siempre ver el último mensaje */}
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
      {messages.map(message => {
        const isUser = message.role === 'user'
        const genUI = !isUser ? collectGenUI(message) : []
        const text = getMessageText(message)
        return (
          <div key={message.id} style={{ marginBottom: '10px' }}>
            <strong>{isUser ? 'Tú' : 'Barçabot'}:</strong>
            {genUI.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '8px 0' }}>
                {genUI}
              </div>
            )}
            {text && <p>{text}</p>}
          </div>
        )
      })}
      {isLoading && <p>Pensando...</p>}
      <div ref={bottomRef} />
    </div>
  )
}