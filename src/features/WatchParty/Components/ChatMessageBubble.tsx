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

      <div>
        {message.type === "text" ? (
          <div
            className={`mt-1 inline-block rounded-lg text-sm ${
              isCurrentUser
                ? "bg-brand-gray-light/50 text-brand-black"
                : "text-brand-black"
            }`}
          >
            <p className="px-2 py-1">{message.message}</p>
          </div>
        ) : (
          <div className={"mt-1 inline-block rounded-lg text-sm "}>
            <img
              src={message.stickerUrl}
              alt={message.stickerId}
              className="w-32 h-32 object-contain"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageBubble;
