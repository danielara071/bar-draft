import { Plus } from "lucide-react";

interface AddNewReelProps {
    onClick: () => void;
}

const AddNewReelCard = ({onClick} : AddNewReelProps) => {
  return (
    <div className="h-96 max-w-60 w-full rounded-2xl border border-brand-navy border-dashed relative cursor-pointer" onClick={onClick}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Plus
          className="h-9 w-9"
          color="#0F2D52"
        />
      </div>
    </div>
  );
};

export default AddNewReelCard;
