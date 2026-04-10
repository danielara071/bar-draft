import { VolumeX, Volume2, Play } from "lucide-react";
import { motion, type Transition } from "motion/react";
import { useEffect, useRef, useState } from "react";

const spring: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 22,
  mass: 0.8,
};

interface ReelCardProps {
  id: string;
  video_url: string;
  thumbnail_url: string;
  caption: string;
  duration?: number | null;
  animateState: string;
  position: string;
  muted: boolean;
  changeMute: () => void;
  changeActiveIndex: () => void;
}

const ReelCard = ({
  id,
  video_url,
  thumbnail_url,
  caption,
  duration,
  animateState,
  position,
  muted,
  changeMute,
  changeActiveIndex,
}: ReelCardProps) => {
  const variants = {
    center: {
      scale: 1,
      x: 0,
      opacity: 1,
      zIndex: 3,
      width: 384, // w-96
      height: 620,
      rotate: 0,
    },
    left: {
      scale: 1,
      x: -280,
      opacity: 0.45,
      zIndex: 2,
      width: 224, // w-56
      height: 288, // h-72
      rotate: -5,
    },
    right: {
      scale: 1,
      x: 280,
      opacity: 0.45,
      zIndex: 2,
      width: 224,
      height: 288,
      rotate: 5,
    },
    // Hidden cards are placed offscreen left or right so they slide IN,
    // not pop in from the center
    hiddenLeft: {
      scale: 0.8,
      x: -560,
      opacity: 0,
      zIndex: 0,
      width: 224,
      height: 288,
      rotate: -5,
    },
    hiddenRight: {
      scale: 0.8,
      x: 560,
      opacity: 0,
      zIndex: 0,
      width: 224,
      height: 288,
      rotate: 5,
    },
  };
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  

  return (
    <motion.div
      key={id}
      variants={variants}
      animate={animateState}
      transition={spring}
      className="absolute overflow-hidden rounded-2xl shadow-2xl shadow-black group"
      onClick={changeActiveIndex}
    >
      {/* TODO: make whole motion div clickable as the pause button*/}

      {position === "center" ? (
        <div>
          <video
            src={video_url}
            autoPlay
            muted={muted}
            loop
            playsInline
            controls
            controlsList="nofullscreen"
            style={{
              width: "100%",
              height: "100vh",
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
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4"
            animate={{ opacity: position === "center" ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-white text-sm font-semibold mb-3">{caption}</p>
          </motion.div>
        </div>
      ) : (
        <img
          src={thumbnail_url}
          alt={caption}
          className="w-full h-full object-cover"
        />
      )}
    </motion.div>
  );
};

export default ReelCard;
