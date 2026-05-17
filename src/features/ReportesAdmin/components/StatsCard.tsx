import type { LucideIcon } from "lucide-react";

type StatsCardProps = {
  icon: LucideIcon;
  title: string;
  stat: number | string;
};

const StatsCard = ({ icon: Icon, title, stat }: StatsCardProps) => {
  return (
    <div className="relative rounded-3xl p-6 bg-brand-white border border-brand-navy overflow-hidden min-h-37.5">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full border border-brand-navy">
          <Icon className="text-brand-navy" />
        </div>
        <div>
          <p className="text-xs tracking-spaced uppercase text-brand-navy font-semibold leading-tight">
            {title}
          </p>
          <p className="text-sm text-brand-gray-mid mt-1"></p>
        </div>
      </div>

      <div className="absolute left-6 bottom-6">
        <span className="text-6xl font-extrabold text-brand-navy">{stat}</span>
      </div>
    </div>
  );
};

export default StatsCard;
