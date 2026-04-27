import { VolumeX, Volume2, Play, Pause } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface ReelCardProps {
  video_url: string;
  muted: boolean;
  changeMute: () => void;
}

const ViewReelCard = ({ video_url, muted, changeMute }: ReelCardProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video?.paused) {
      video.play().then(() => setIsPaused(false));
    } else {
      video?.pause();
      setIsPaused(true);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black group cursor-pointer h-96 w-64"
      onClick={() => {
        togglePlay();
      }}
    >
      <div>
        <video
          ref={videoRef}
          src={video_url}
          muted={muted}
          loop
          playsInline
          controlsList="nofullscreen"
          style={{
            width: "100%",
            objectFit: "cover",
            outline: "none",
          }}
        />
        <button
          className="absolute top-6 left-6 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            changeMute();
          }}
        >
          {muted ? (
            <VolumeX color="white" fill="white" className="w-8 h-8" />
          ) : (
            <Volume2 color="white" fill="white" className="w-8 h-8" />
          )}
        </button>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-300 ">
          {isPaused ? (
            <Play className="w-8 h-8 text-white fill-white" />
          ) : (
            <Pause className="w-8 h-8 text-white fill-white" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ViewReelCard;
