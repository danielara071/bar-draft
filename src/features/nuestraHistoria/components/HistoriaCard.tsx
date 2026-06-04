import type { HistoriaEvent } from "../types";
import HistoriaIconoCentral from "./HistoriaIconoCentral";
import HistoriaImagen from "./HistoriaImagen";
import HistoriaInfo from "./HistoriaInfo";

type HistoriaCardProps = {
  event: HistoriaEvent;
  align: "left" | "right";
};

const HistoriaCard = ({ event, align }: HistoriaCardProps) => {
  const isLeft = align === "left";

  return (
    <article className="relative">
      <div
        className={`grid h-full gap-6 md:grid-cols-2 md:items-stretch md:gap-x-35 ${
          isLeft
            ? "md:[&>*:first-child]:pr-20 md:[&>*:last-child]:pl-16"
            : "md:[&>*:first-child]:pl-20 md:[&>*:last-child]:pr-16"
        }`}
      >
        {isLeft ? (
          <>
            <HistoriaInfo
              year={event.year}
              title={event.title}
              description={event.description}
              align={align}
            />
            <HistoriaImagen src={event.imageSrc} alt={event.imageAlt} />
          </>
        ) : (
          <>
            <HistoriaImagen src={event.imageSrc} alt={event.imageAlt} />
            <HistoriaInfo
              year={event.year}
              title={event.title}
              description={event.description}
              align={align}
            />
          </>
        )}
      </div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        <HistoriaIconoCentral icon={event.icon} />
      </div>
    </article>
  );
};

export default HistoriaCard;
