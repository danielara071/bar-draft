import { ChatInput } from "../shared/components/ChatInput"
import { ChatMessages } from "../shared/components/ChatMessages"
import { UsuariosPanel } from "../shared/components/UsuariosPanel"
import { useChatSession } from "../shared/hooks/useChatSession"

interface Props {
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

  if (embedded) {
    return (
      <div className="flex flex-col h-full">
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          getMessageText={getMessageText}
          embedded
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
