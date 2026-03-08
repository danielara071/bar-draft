import { useChat } from '@ai-sdk/react'

export function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading
  } = useChat({
    api: `${import.meta.env.VITE_API_URL}/api/chat`
  })

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Chat con Base de Datos</h2>

      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        {messages.map(m => (
          <div key={m.id} style={{ marginBottom: '10px' }}>
            <strong>{m.role === 'user' ? '🧑 Tú' : '🤖 IA'}:</strong>
            <p>{m.content}</p>
          </div>
        ))}
        {isLoading && <p>⏳ Pensando...</p>}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Pregunta algo, ej: ¿Quiénes son los usuarios?"
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" disabled={isLoading}>
          Enviar
        </button>
      </form>
    </div>
  )
}