// ReelsSection.tsx
import { useState } from "react";
import ReelsActionBar from "./ReelsActionBar";
import { motion } from "motion/react";
import ReelCard from "./ReelCard";
import useSession from "../../../shared/hooks/useSession";
import { useReels } from "../hooks/useReels";

const ReelsFeed = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const getPosition = (i: number) => {
    const diff = i - activeIndex;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === -1) return "left";
    return "hidden";
  };

  const getAnimateState = (i: number) => {
    const position = getPosition(i);
    if (position !== "hidden") return position;
    const diff = i - activeIndex;
    return diff > activeIndex ? "hiddenRight" : "hiddenLeft";
  };

  type Key = "ArrowLeft" | "ArrowRight";
  const keyHandlers: Record<Key, () => void> = {
    ArrowLeft: () => setActiveIndex((i) => Math.max(i - 1, 0)),
    ArrowRight: () => setActiveIndex((i) => Math.min(i + 1, videos.length - 1)),
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key as Key;
    if (keyHandlers[key]) {
      e.preventDefault();
      keyHandlers[key]();
    }
  };

  const userId = useSession()?.user.id;
  const { videos, toggleLike } = useReels(userId);
  const activeVideo = videos[activeIndex];

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex bg-brand-navy"
      style={{ outline: "none" }}
    >
      <div className="w-full mt-24 py-8 px-4">
        <h2 className="text-white text-xl font-bold mb-6 px-2">Reels</h2>

        <div className="relative flex items-center justify-center h-155 overflow-hidden py-14">
          {videos.map((reel, i) => {
            const position = getPosition(i);
            const animateState = getAnimateState(i);

            return (
              <ReelCard
                key={reel.id}
                id={reel.id}
                video_url={reel.video_url}
                thumbnail_url={reel.thumbnail_url}
                caption={reel.caption}
                animateState={animateState}
                position={position}
                muted={isMuted}
                changeMute={() => setIsMuted((prev) => !prev)}
                changeActiveIndex={() => setActiveIndex(i)}
              />
            );
          })}
        </div>
        {activeVideo && (
          <motion.div className="flex justify-center mt-4" layout>
            <ReelsActionBar
              onLike={toggleLike}
              video_id={activeVideo.id}
              liked={activeVideo.liked}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReelsFeed;
