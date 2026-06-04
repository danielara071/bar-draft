import type { LucideIcon } from "lucide-react";

type HistoriaIconoCentralProps = {
  icon: LucideIcon;
  team: "femenil" | "varonil";
};

const HistoriaIconoCentral = ({
  icon: Icon,
  team,
}: HistoriaIconoCentralProps) => {
  const isVaronil = team === "varonil";
  const ringClass = isVaronil
    ? "border-brand-navy text-brand-navy shadow-[0_18px_40px_rgba(15,45,82,0.15)]"
    : "border-brand-crimson text-brand-crimson shadow-[0_18px_40px_rgba(15,45,82,0.15)]";
  const innerClass = isVaronil ? "bg-brand-navy/8" : "bg-brand-crimson/8";

  return (
    <div
      className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 bg-brand-white ${ringClass}`}
    >
      <span className={`absolute inset-2 rounded-full ${innerClass}`} />
      <Icon className="relative z-10" size={22} strokeWidth={2.1} />
    </div>
  );
};

export default HistoriaIconoCentral;
