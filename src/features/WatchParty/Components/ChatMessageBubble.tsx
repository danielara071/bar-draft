import type { ChatMessage } from "../Types/chatType";
import formatTime from "../Utils/formatTime";

type ChatMessageBubbleProps = {
  message: ChatMessage;
  currentUserName?: string;
};

const ChatMessageBubble = ({
  message,
  currentUserName,
}: ChatMessageBubbleProps) => {
  const isCurrentUser = message.user_name === currentUserName;

  return (
    <div
      className={`my-3 w-full ${isCurrentUser ? "text-right" : "text-left"}`}
    >
      <div
        className={`flex items-center gap-2 text-xs ${
          isCurrentUser ? "justify-end" : "justify-start"
        }`}
      >
        <p className="font-semibold text-brand-crimson">
          {isCurrentUser ? "" : message.user_name}
        </p>
        <p className="text-brand-gray-mid">{formatTime(message.timestamp)}</p>
      </div>

      <div
        className={`mt-1 inline-block rounded-lg px-2 py-1 text-sm ${
          isCurrentUser
            ? "bg-brand-gray-light/50 text-brand-black"
            : "text-brand-black"
        }`}
      >
        <p>{message.message}</p>
      </div>
    </div>
  );
};

export default ChatMessageBubble;
