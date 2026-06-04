import { PrimaryButton } from "../../../shared/components/Buttons";
import HistoriaTimeline from "./HistoriaTimeline";
import { historiaEvents } from "../historiaData";

type NuestraHistoriaSectionProps = {
  onCollapse: () => void;
};

const NuestraHistoriaSection = ({
  onCollapse,
}: NuestraHistoriaSectionProps) => {
  return (
    <section className="py-10 md:py-16">
      <div className="mb-10 w-full px-5 text-left">
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

      <HistoriaTimeline events={historiaEvents} />

      <div className="mx-auto flex w-full max-w-6xl justify-center px-5 pb-10 md:pb-16">
        <PrimaryButton
          onClick={onCollapse}
          size="md"
          className="w-full max-w-sm text-base md:text-lg"
        >
          Ocultar historia
        </PrimaryButton>
      </div>
    </section>
  );
};

export default NuestraHistoriaSection;
