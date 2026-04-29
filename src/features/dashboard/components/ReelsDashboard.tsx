import { useEffect, useRef, useState } from "react";
import { useReelsAdmin } from "../hooks/useReelsAdmin";
import ReelAdminCard from "./ReelAdminCard";
import { BarLoader } from "react-spinners";
import type { AdminReel } from "../interfaces/AdminReel";
import ReelInfoCard from "./ReelInfoCard";
import AddNewReelCard from "./AddNewReelCard";
import AddNewReelModal from "./AddNewReelModal";

const ReelsDashboard = () => {
  const { videos, loading, fetchVideos } = useReelsAdmin();
  const [selected, setSelected] = useState<AdminReel | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const didMutate = useRef(false);

  const handleMutate = () => {
    didMutate.current = true;
  };

  const handleClose = () => {
    setSelected(null);
    if (didMutate.current) {
      didMutate.current = false;
      fetchVideos();
    }
  };

  useEffect(() => {
    console.log(videos);
  }, [videos]);

  return (
    <div className="border border-slate-200 rounded-2xl bg-brand-white p-5 mt-4 min-h-52 flex items-center justify-center">
      {!loading ? (
        <div className="grid grid-cols-4 gap-4 w-full ">
          <AddNewReelCard onClick={() => setIsAddModalOpen((prev) => !prev)} />
          {isAddModalOpen && (
            <AddNewReelModal
              toggleCard={() => setIsAddModalOpen((prev) => !prev)}
              updated={handleMutate}
            />
          )}
          {videos.map((item) => (
            <ReelAdminCard
              id={item.id}
              video_url={item.video_url}
              thumbnail_url={item.thumbnail_url}
              caption={item.caption}
              duration={item.duration}
              category={item.category}
              order_index={item.order_index}
              is_active={item.is_active}
              created_at={item.created_at}
              onClick={() => setSelected(item)}
            />
          ))}
          {selected && (
            <ReelInfoCard
              id={selected.id}
              video_url={selected.video_url}
              thumbnail_url={selected.thumbnail_url}
              caption={selected.caption}
              duration={selected.duration}
              category={selected.category}
              order_index={selected.order_index}
              is_active={selected.is_active}
              created_at={selected.created_at}
              toggleCard={() => handleClose()}
              updated={handleMutate}
            />
          )}
        </div>
      ) : (
        <div className="">
          <BarLoader height={3} width={400} />
        </div>
      )}
    </div>
  );
};

export default ReelsDashboard;
