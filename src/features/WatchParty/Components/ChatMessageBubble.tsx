import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../Types/chatType";
import ReportUserModal from "./ReportUserModal";
import formatTime from "../Utils/formatTime";
import { useReportUser } from "../Hooks/useReportUser";

type ChatMessageBubbleProps = {
  message: ChatMessage;
  currentUserName?: string;
  roomCode: string;
};

const ChatMessageBubble = ({
  message,
  currentUserName,
  roomCode,
}: ChatMessageBubbleProps) => {
  const isCurrentUser = message.user_name === currentUserName;
  const [showReport, setShowReport] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const reportRef = useRef<HTMLDivElement | null>(null);
  const { submitReport, isSubmitting, error, clearError } = useReportUser();

  useEffect(() => {
    if (!showReport) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!reportRef.current?.contains(event.target as Node)) {
        setShowReport(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showReport]);

  return (
    <div
      className={`my-3 w-full ${isCurrentUser ? "text-right" : "text-left"}`}
    >
      <div
        className={`flex items-center gap-2 text-xs ${
          isCurrentUser ? "justify-end" : "justify-start"
        }`}
      >
        {!isCurrentUser ? (
          <div className="relative" ref={reportRef}>
            <button
              type="button"
              className="font-semibold text-brand-crimson hover:text-brand-navy transition-colors cursor-pointer"
              onClick={() => {
                clearError();
                setShowReport((prev) => !prev);
              }}
            >
              {message.user_name}
            </button>
            {showReport ? (
              <button
                type="button"
                className="absolute left-0 top-full mt-1 inline-flex items-center rounded-full bg-brand-crimson px-3 py-1 text-[10px] cursor-pointer font-semibold text-brand-white shadow-sm"
                onClick={() => {
                  clearError();
                  setIsReportModalOpen(true);
                  setShowReport(false);
                }}
              >
                Reportar
              </button>
            ) : null}
          </div>
        ) : (
          <p className="font-semibold text-brand-crimson" />
        )}
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

      <ReportUserModal
        isOpen={isReportModalOpen}
        reportedUserName={message.user_name ?? "Usuario"}
        reportedUserId={message.user_id}
        roomCode={roomCode}
        onClose={() => {
          clearError();
          setIsReportModalOpen(false);
        }}
        onSubmit={async (payload) => {
          await submitReport(payload);
          clearError();
          setIsReportModalOpen(false);
        }}
        isSubmitting={isSubmitting}
        submitError={error}
      />
    </div>
  );
};

export default ChatMessageBubble;
