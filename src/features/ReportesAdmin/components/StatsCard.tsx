import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type StatsCardProps = {
  icon: LucideIcon;
  title: ReactNode;
  stat: number | string;
  variant?: "solid" | "outline";
  tone?: "default" | "success" | "danger";
};

const StatsCard = ({
  icon: Icon,
  title,
  stat,
  variant = "outline",
  tone = "default",
}: StatsCardProps) => {
  const isSolid = variant === "solid";
  const containerClass = isSolid
    ? "bg-brand-navy border-brand-navy"
    : "bg-brand-white border-brand-navy";
  const labelClass = isSolid ? "text-brand-yellow" : "text-brand-navy";
  const iconClass = isSolid
    ? "text-brand-yellow"
    : tone === "success"
      ? "text-emerald-600"
      : tone === "danger"
        ? "text-brand-crimson"
        : "text-brand-navy";
  const statClass = isSolid ? "text-brand-white" : "text-brand-navy";

  return (
    <div
      className={`relative rounded-3xl p-6 border overflow-hidden min-h-37.5 ${containerClass}`}
    >
      <div className="flex items-start gap-4">
        <Icon className={iconClass} />
        <div>
          <p
            className={`text-xs tracking-spaced uppercase font-semibold leading-tight ${labelClass}`}
          >
            {title}
          </p>
        </div>
      </div>

      <div className="absolute left-6 bottom-6">
        <span className={`text-5xl font-extrabold ${statClass}`}>{stat}</span>
      </div>
    </div>
  );
};

export default StatsCard;
