import type { LucideIcon } from "lucide-react";

type HistoriaIconoCentralProps = {
  icon: LucideIcon;
};

const HistoriaIconoCentral = ({ icon: Icon }: HistoriaIconoCentralProps) => {
  return (
    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-crimson bg-brand-white text-brand-crimson shadow-[0_18px_40px_rgba(15,45,82,0.15)]">
      <span className="absolute inset-2 rounded-full bg-brand-crimson/8" />
      <Icon className="relative z-10" size={22} strokeWidth={2.1} />
    </div>
  );
};

export default HistoriaIconoCentral;
