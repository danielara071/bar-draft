import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { fetchDashboardStats } from "../features/estadisticas/services/statsService";
import type {
  AssisterCardData,
  DashboardStats,
  KeeperCardData,
  ScorerCardData,
  TeamType,
} from "../features/estadisticas/types";

const MALE_BG = "#0A1D3A";
const FEMALE_BG = "#9B2743";

const EMPTY_STATS: DashboardStats = {
  scorers: { male: null, female: null },
  assisters: { male: null, female: null },
  keepers: { male: null, female: null },
};

type CardProps = {
  teamType: TeamType;
  children: ReactNode;
};

type SectionTitleProps = {
  prefix: string;
  highlight: string;
};

function TeamCard({ teamType, children }: CardProps) {
  const bg = teamType === "male" ? MALE_BG : FEMALE_BG;
  return (
    <article
      className="rounded-3xl p-5 md:p-6 text-white shadow-lg"
      style={{ backgroundColor: bg }}
    >
      {children}
    </article>
  );
}

function PlayerImage({ src, alt }: { src: string | null; alt: string }) {
  return (
    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br  p-1">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full rounded-xl bg-black/20 flex items-center justify-center text-sm text-white/80">
          Sin imagen
        </div>
      )}
    </div>
  );
}

function WhiteBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const safeData =
    data.length > 0
      ? data
      : [
          { label: "N/A", value: 0 },
          { label: "N/A", value: 0 },
          { label: "N/A", value: 0 },
          { label: "N/A", value: 0 },
        ];

  return (
    <div className="mt-4">
      <div className="h-28 flex items-end gap-3">
        {safeData.map((item) => {
          const h = Math.max(8, Math.round((item.value / max) * 100));
          return (
            <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md bg-white/90"
                style={{ height: `${h}%` }}
                title={`${item.label}: ${item.value}`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-3">
        {safeData.map((item) => (
          <span
            key={item.label}
            className="flex-1 text-[10px] md:text-xs text-white/90 rotate-[-22deg] origin-top-left text-center"
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const circumference = 2 * Math.PI * 48;
  const stroke = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative w-44 h-44 mx-auto mt-3">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="16"
        />
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="none"
          stroke="white"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={stroke}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-white">
        {clamped}%
      </div>
    </div>
  );
}

function SectionTitle({ prefix, highlight }: SectionTitleProps) {
  return (
    <h2 className="text-2xl md:text-3xl font-sans  text-black">
      {prefix} <span style={{ color: "#FBBF24" }}>{highlight}</span>
    </h2>
  );
}

function ScorerCard({ teamType, data }: { teamType: TeamType; data: ScorerCardData | null }) {
  if (!data) {
    return (
      <TeamCard teamType={teamType}>
        <p className="text-center text-white/80">Sin datos de anotadores.</p>
      </TeamCard>
    );
  }

  return (
    <TeamCard teamType={teamType}>
      <h3 className="text-xl font-bold text-center mb-3">{data.player.nombre}</h3>
      <PlayerImage src={data.player.imagen_url} alt={data.player.nombre} />
      <p className="mt-4 text-left text-base">
        <span className="font-semibold">Goles:</span> {data.totalGoles}
      </p>
      <WhiteBarChart data={data.series} />
    </TeamCard>
  );
}

function AssisterCard({
  teamType,
  data,
}: {
  teamType: TeamType;
  data: AssisterCardData | null;
}) {
  if (!data) {
    return (
      <TeamCard teamType={teamType}>
        <p className="text-center text-white/80">Sin datos de asistidores.</p>
      </TeamCard>
    );
  }

  return (
    <TeamCard teamType={teamType}>
      <h3 className="text-xl font-bold text-center mb-3">{data.player.nombre}</h3>
      <PlayerImage src={data.player.imagen_url} alt={data.player.nombre} />
      <p className="mt-4 text-center text-white/90">Mayor asistidor(a) con</p>
      <p className="text-center text-6xl leading-none font-extrabold mt-1">
        {data.totalAsistencias}
      </p>
      <p className="text-center text-xl mt-1">asistencias</p>
    </TeamCard>
  );
}

function KeeperCard({ teamType, data }: { teamType: TeamType; data: KeeperCardData | null }) {
  if (!data) {
    return (
      <TeamCard teamType={teamType}>
        <p className="text-center text-white/80">Sin datos de atajadores.</p>
      </TeamCard>
    );
  }

  return (
    <TeamCard teamType={teamType}>
      <h3 className="text-xl font-bold text-center mb-3">{data.player.nombre}</h3>
      <PlayerImage src={data.player.imagen_url} alt={data.player.nombre} />
      <p className="mt-4 text-center text-white/90">Lidera la porteria con un</p>
      <DonutChart percent={data.efectividadPct} />
      <p className="text-center text-xl mt-2">de efectividad</p>
    </TeamCard>
  );
}

export default function Estadisticas() {
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        const res = await fetchDashboardStats();
        if (!cancelled) setStats(res);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error cargando estadisticas";
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const pageState = useMemo(() => {
    if (loading) return "loading";
    if (error) return "error";
    return "ready";
  }, [error, loading]);

  const allEmpty = useMemo(() => {
    return (
      !stats.scorers.male &&
      !stats.scorers.female &&
      !stats.assisters.male &&
      !stats.assisters.female &&
      !stats.keepers.male &&
      !stats.keepers.female
    );
  }, [stats]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative">
      <div
        className="absolute left-0 top-0 w-full h-6 md:h-23"
        style={{ backgroundColor: MALE_BG }}
      />
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-28 relative z-10">
        <header className="mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl text-center font-extrabold text-black">Mas Que Numeros</h1>
          <p className="mx-10 mt-4 text-sm md:text-base text-gray-700">
            El pulso del equipo en datos. Sigue de cerca la evolucion de tus referentes y descubre
            quien domina las estadisticas clave en el primer equipo masculino y femenino.
          </p>
        </header>

        {pageState === "loading" && (
          <div className="text-center py-20 text-gray-700 font-medium">Cargando estadisticas...</div>
        )}

        {pageState === "error" && (
          <div className="text-center py-20 text-red-700 font-medium">
            No se pudo cargar la informacion: {error}
          </div>
        )}

        {pageState === "ready" && (
          <div className="space-y-14">
            <section>
              <SectionTitle prefix="Conoce a nuestros mayores" highlight="Anotadores" />
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <ScorerCard teamType="male" data={stats.scorers.male} />
                <ScorerCard teamType="female" data={stats.scorers.female} />
              </div>
            </section>

            <section>
              <SectionTitle prefix="Conoce a nuestros mayores" highlight="Asistidores" />
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <AssisterCard teamType="male" data={stats.assisters.male} />
                <AssisterCard teamType="female" data={stats.assisters.female} />
              </div>
            </section>

            <section>
              <SectionTitle prefix="Conoce a nuestros mayores" highlight="Atajadores" />
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <KeeperCard teamType="male" data={stats.keepers.male} />
                <KeeperCard teamType="female" data={stats.keepers.female} />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
