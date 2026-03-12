import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { TextStreamChatTransport, isTextUIPart } from 'ai'

const Chat = () => {
  const [input, setInput] = useState('')

  const {
    messages,
    sendMessage,
    status,
    error
  } = useChat({
    transport: new TextStreamChatTransport({ api: '/api/chat' })
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    sendMessage({ text })
    setInput('')
  }

  const getMessageText = (message: (typeof messages)[0]) => {
    return message.parts
      .filter((part): part is { type: 'text'; text: string } => isTextUIPart(part))
      .map(part => part.text)
      .join('')
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Chat con Base de Datos</h2>

      {error && (
        <p style={{ color: 'red', marginBottom: '10px' }}>{error.message}</p>
      )}

      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        {messages.map(m => (
          <div key={m.id} style={{ marginBottom: '10px' }}>
            <strong>{m.role === 'user' ? 'Tú' : 'ollama'}:</strong>
            <p>{getMessageText(m)}</p>
          </div>
        ))}
        {isLoading && <p>Pensando...</p>}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="ej: ¿Quiénes son los usuarios?"
          style={{ flex: 1, padding: '8px' }}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Enviar
        </button>
      </form>
    </div>
  )
}

export default Chat
