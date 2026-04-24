import { useEffect, useState } from "react";
import { useReelsAdmin } from "../hooks/useReelsAdmin";
import ReelAdminCard from "./ReelAdminCard";
import { BarLoader } from "react-spinners";

const ReelsDashboard = () => {
  const { videos } = useReelsAdmin();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log(videos);
    setLoading(false);
  }, [videos]);
  return (
    <div className="border border-slate-200 rounded-2xl bg-brand-white p-5 mt-4 min-h-52 flex items-center justify-center">
      {!loading ? (
        <div className="grid grid-cols-4 gap-4 w-full ">
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
            />
          ))}
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
