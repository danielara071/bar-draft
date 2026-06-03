import type { HistoriaEvent } from "../types";
import HistoriaIconoCentral from "./HistoriaIconoCentral";
import HistoriaImagen from "./HistoriaImagen";
import HistoriaInfo from "./HistoriaInfo";

type HistoriaCardProps = {
  event: HistoriaEvent;
  align: "left" | "right";
};

const HistoriaCard = ({ event, align }: HistoriaCardProps) => {
  return (
    <article className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_6rem_minmax(0,1fr)] md:items-center">
      <HistoriaInfo
        year={event.year}
        title={event.title}
        description={event.description}
        badge={event.badge}
        align={align}
      />

      <HistoriaIconoCentral icon={event.icon} />

      <div
        className={`order-2 md:order-0 ${align === "left" ? "md:col-start-3" : "md:col-start-1"}`}
      >
        <HistoriaImagen src={event.imageSrc} alt={event.imageAlt} />
      </div>
    </article>
  );
};

export default HistoriaCard;
