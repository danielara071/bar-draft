import type { HistoriaEvent } from "../types";
import HistoriaCard from "./HistoriaCard";

type HistoriaTimelineProps = {
  title: string;
  subtitle: string;
  events: HistoriaEvent[];
};

const HistoriaTimeline = ({
  title,
  subtitle,
  events,
}: HistoriaTimelineProps) => {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-5 py-10 md:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-crimson">
          Club Story
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-navy md:text-[2.75rem]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-brand-navy/60 md:text-base">
          {subtitle}
        </p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[linear-gradient(180deg,rgba(181,23,75,0.22),rgba(15,45,82,0.06),rgba(181,23,75,0.18))] md:block" />

        <div className="space-y-12 md:space-y-24">
          {events.map((event, index) => (
            <HistoriaCard
              key={`${event.year}-${event.title}`}
              event={event}
              align={index % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistoriaTimeline;
