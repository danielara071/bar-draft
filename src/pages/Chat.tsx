import { ChatInput } from "../shared/components/ChatInput"
import { ChatMessages } from "../shared/components/ChatMessages"
import { UsuariosPanel } from "../shared/components/UsuariosPanel"
import { useChatSession } from "../shared/hooks/useChatSession"
import { useProfile } from "../shared/hooks/useProfile"

const logoURL = import.meta.env.VITE_LOGO_URL as string

interface Props {
  // cuando viene del widget el layout cambia para caber en el panel flotante
  embedded?: boolean
}

const Chat = ({ embedded = false }: Props) => {
  const {
    input,
    setInput,
    messages,
    isLoading,
    handleSubmit,
    getMessageText
  } = useChatSession()

  // solo se usa en modo embedded para mostrar el avatar del usuario
  const profile = useProfile()

  if (embedded) {
    return (
      // h-full para ocupar exactamente el espacio que le da el panel del widget
      <div className="flex flex-col h-full">
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          getMessageText={getMessageText}
          embedded
          logoUrl={logoURL}
          userAvatarUrl={profile?.url_avatar ?? undefined}
        />
        <ChatInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          embedded
        />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Chat con Base de Datos</h2>

      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        getMessageText={getMessageText}
      />

      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />

      <UsuariosPanel />
    </div>
  )
}

export default Chat
