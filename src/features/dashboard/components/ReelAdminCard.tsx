import {} from "lucide-react";
import { motion, type Transition } from "motion/react";
import { useState } from "react";
import ReelInfoCard from "./ReelInfoCard";


const spring: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 22,
  mass: 0.8,
};

interface ReelAdminCardProps {
  id: string;
  video_url: string;
  thumbnail_url: string;
  caption: string;
  duration: number;
  category: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

const ReelAdminCard = ({
  id,
  video_url,
  thumbnail_url,
  caption,
  duration,
  category,
  order_index,
  is_active,
  created_at,
}: ReelAdminCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      key={id}
      transition={spring}
      className="overflow-hidden rounded-2xl shadow-2xl cursor-pointer max-w-60 "
    >
      <div className="flex flex-col ">
        <div
          className="relative hover:brightness-75 group"
          onClick={() => setIsOpen(true)}
        >
          <img
            src={thumbnail_url}
            alt={caption}
            className="h-80 w-60 object-cover"
          />
          <p className="text-brand-white text-sm font-bold absolute bottom-0 left-0 right-0 p-2">
            {caption}
          </p>
          <p className="group-hover:opacity-100 opacity-0  text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            Más info
          </p>
        </div>
        <div className="bg-brand-white p-2">
          <div className="flex flex-row gap-x-2">
            <p className="font-semibold text-gray-500 text-sm">Activo: </p>
            <p className="text-gray-500 text-sm"> {is_active ? "Si" : "No"}</p>
          </div>
          <div className="flex flex-row gap-x-2">
            <p className="font-semibold text-gray-500 text-sm">
              Indice de orden:
            </p>
            <p className="text-gray-500 text-sm">{order_index}</p>
          </div>
          <div className="flex flex-row gap-x-2">
            <p className="font-semibold text-gray-500 text-sm">
              Fecha de creación:
            </p>
            <p className="text-gray-500 text-sm">{created_at.slice(0, 10)}</p>
          </div>
        </div>
      </div>
      {isOpen && (
        <ReelInfoCard
          id={id}
          video_url={video_url}
          thumbnail_url={thumbnail_url}
          caption={caption}
          duration={duration}
          category={category}
          order_index={order_index}
          is_active={is_active}
          created_at={created_at}
          toggleCard={() => setIsOpen((prev) => !prev)}
        />
      )}
    </motion.div>
  );
};

export default ReelAdminCard;
