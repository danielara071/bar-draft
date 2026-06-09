import { useEffect, useRef, useState } from "react";
import { Heart, Share } from "lucide-react";

const crimsonColor = "#B5174B";
const FEEDBACK_DURATION_MS = 1800;

interface ReelsActionBarProps {
  video_id: string;
  liked: boolean;
  onLike: (videoId: string) => void;
}

const ReelsActionBar = ({ video_id, liked, onLike }: ReelsActionBarProps) => {
  const shareUrl = `${window.location.origin}/reels/${video_id}`;
  const [showShareFeedback, setShowShareFeedback] = useState(false);
  const [shareFeedbackText, setShareFeedbackText] = useState("");
  const feedbackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  const showCopiedFeedback = (message: string) => {
    setShareFeedbackText(message);
    setShowShareFeedback(true);

    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }

    feedbackTimeoutRef.current = window.setTimeout(() => {
      setShowShareFeedback(false);
      feedbackTimeoutRef.current = null;
    }, FEEDBACK_DURATION_MS);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showCopiedFeedback("Link copiado al portapapeles");
    } catch (error) {
      console.error(error);
      showCopiedFeedback("No se pudo copiar el link");
    }
  };

  return (
    <div className="relative bg-brand-white h-12 w-60 rounded-4xl flex flex-row items-center justify-center gap-x-8 ">
      <button
        type="button"
        aria-label="Me gusta"
        className="cursor-pointer h-full w-7 flex items-center justify-center max-h-full"
        onClick={() => onLike(video_id)}
      >
        <Heart color={crimsonColor} fill={liked ? crimsonColor : "none"} />
      </button>
      <button
        type="button"
        aria-label="Copiar link del reel"
        className="cursor-pointer h-7 w-7 flex items-center justify-center"
        onClick={() => copyToClipboard()}
      >
        <Share color={crimsonColor} />
      </button>
      {showShareFeedback && (
        <div
          role="status"
          aria-live="polite"
          className="absolute -top-10 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-white px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
        >
          <p className="text-brand-navy">{shareFeedbackText}</p>
        </div>
      )}
      {/* <button className="cursor-pointer h-7 w-7 flex items-center justify-center">
        <Ellipsis color={crimsonColor} />
      </button> */}
    </div>
  );
};

export default ReelsActionBar;
