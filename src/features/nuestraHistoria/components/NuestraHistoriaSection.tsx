import { PrimaryButton } from "../../../shared/components/Buttons";
import HistoriaTimeline from "./HistoriaTimeline";
import { historiaEventsFemenil, historiaEventsVaronil } from "../historiaData";
import { useState } from "react";

type NuestraHistoriaSectionProps = {
  onCollapse: () => void;
};

const NuestraHistoriaSection = ({
  onCollapse,
}: NuestraHistoriaSectionProps) => {
  const [selectedTeam, setSelectedTeam] = useState<"femenil" | "varonil">(
    "femenil",
  );

  const events =
    selectedTeam === "femenil" ? historiaEventsFemenil : historiaEventsVaronil;

  return (
    <section className="py-10 md:py-16">
      <div className="mb-10 w-full px-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="text-left">
            <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-brand-crimson">
              Historia del club
            </h2>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-brand-navy md:text-[2.75rem]">
              Un club, dos trayectos
            </h3>
            <p className="mt-2 text-sm text-brand-navy/60 md:text-base">
              Un viaje a través del tiempo en ambos equipos
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => setSelectedTeam("femenil")}
              aria-pressed={selectedTeam === "femenil"}
              className={`rounded-full px-5 py-2 text-sm font-bold tracking-wide transition-all duration-150 ${
                selectedTeam === "femenil"
                  ? "bg-brand-crimson text-white shadow-[0_10px_24px_rgba(181,23,75,0.22)]"
                  : "bg-white text-brand-crimson border border-brand-crimson/30 hover:bg-brand-crimson/5"
              }`}
            >
              Femenil
            </button>
            <button
              type="button"
              onClick={() => setSelectedTeam("varonil")}
              aria-pressed={selectedTeam === "varonil"}
              className={`rounded-full px-5 py-2 text-sm font-bold tracking-wide transition-all duration-150 ${
                selectedTeam === "varonil"
                  ? "bg-brand-navy text-white shadow-[0_10px_24px_rgba(15,45,82,0.22)]"
                  : "bg-white text-brand-navy border border-brand-navy/30 hover:bg-brand-navy/5"
              }`}
            >
              Varonil
            </button>
          </div>
        </div>
      </div>

      <HistoriaTimeline events={events} />

      <div className="mx-auto flex w-full max-w-6xl justify-center px-5 pb-10 md:pb-16">
        <PrimaryButton
          onClick={onCollapse}
          size="md"
          className="w-full max-w-sm text-base md:text-lg"
        >
          Ocultar historia
        </PrimaryButton>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 pb-10 md:pb-16">
        <hr className="w-full border-brand-gray-light" />
      </div>
    </section>
  );
};

export default NuestraHistoriaSection;
