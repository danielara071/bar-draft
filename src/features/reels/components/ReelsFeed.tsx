// ReelsSection.tsx
import { useEffect, useRef, useState } from "react";
import reels1 from "@/data/img/reels1.jpg";
import reels2 from "@/data/img/reels2.jpg";
import reels3 from "@/data/img/reels3.jpg";
import reels4 from "@/data/img/reels4.jpg";
import ReelsActionBar from "./ReelsActionBar";
import { motion, type Transition } from "motion/react";
import { fetchReels } from "../services/supabase";
import type { VideoReel } from "../interfaces/VideoReel";
import { Play, Volume2, VolumeX } from "lucide-react";
import ReelCard from "./ReelCard";

const reels = [
  { id: 1, title: "El Barcelona gana contra Levante 3-1", thumbnail: reels1 },
  { id: 2, title: "Lewandowski hat-trick vs Villarreal", thumbnail: reels2 },
  { id: 3, title: "Highlights Clásico 2025", thumbnail: reels3 },
  { id: 4, title: "Entrenamiento Camp Nou", thumbnail: reels4 },
];

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

  const [videos, setVideos] = useState<VideoReel[]>([]);

  useEffect(() => {
    async function fetchVids() {
      const { data, error } = await fetchReels();

      if (error) {
        console.log(error);
        return;
      }
      if (data) {
        setVideos(data);
      }
    }
    fetchVids();
  }, []);

  useEffect(() => {
    console.log(videos);
  }, [videos]);


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

        <motion.div className="flex justify-center mt-4" layout>
          <ReelsActionBar />
        </motion.div>
      </div>
    </div>
  );
};

export default ReelsFeed;
