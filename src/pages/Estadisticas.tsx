import { useEffect, useMemo, useState } from "react";
import { fetchDashboardStats } from "../features/estadisticas/services/statsService";
import type { DashboardStats } from "../features/estadisticas/types";
import PalmaresBanner from "../features/estadisticas/components/PalmaresBanner";
import SectionTitle from "../features/estadisticas/components/SectionTitle";
import ScorerCard from "../features/estadisticas/components/ScorerCard";
import AssisterCard from "../features/estadisticas/components/AssisterCard";
import KeeperCard from "../features/estadisticas/components/KeeperCard";
import RankingGlobalChart from "../features/estadisticas/components/RankingGlobalChart";

const MALE_BG = "#0A1D3A";

const EMPTY_STATS: DashboardStats = {
  scorers: { male: null, female: null },
  assisters: { male: null, female: null },
  keepers: { male: null, female: null },
  palmaresByAmbito: {
    internacional: 0,
    nacional: 0,
    regional: 0,
  },
  rankings: {
    scorers: { male: [], female: [] },
    assisters: { male: [], female: [] },
    keepers: { male: [], female: [] },
  },
};

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
          <h1 className="text-4xl md:text-5xl text-center font-extrabold text-black">Mas Que Números</h1>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mx-auto max-w-7xl mt-6">
          <p className="text-[#555555] text-[1.15rem] leading-relaxed font-normal tracking-tight">
            El pulso del equipo en datos. Sigue de cerca la evolucion de tus jugadores favoritos y descubre
            quien domina las estadisticas clave en el primer equipo masculino y femenino del FC Barcelona.
          </p>
        </div>
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
            {allEmpty && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-amber-900 text-sm">
                No llegaron filas desde Supabase para esta vista.
              </div>
            )}
            <section>
              <SectionTitle prefix="Conoce a nuestros mayores" highlight="Anotadores" />
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <ScorerCard teamType="male" data={stats.scorers.male} />
                <ScorerCard teamType="female" data={stats.scorers.female} />
              </div>
              <RankingGlobalChart
                leftTitle="Número de Goles"
                rightTitle="Número de Goles"
                leftItems={stats.rankings.scorers.male}
                rightItems={stats.rankings.scorers.female}
              />
            </section>

            <section>
              <SectionTitle prefix="Conoce a nuestros mayores" highlight="Asistidores" />
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <AssisterCard teamType="male" data={stats.assisters.male} />
                <AssisterCard teamType="female" data={stats.assisters.female} />
              </div>
              <RankingGlobalChart
                leftTitle="Número de Asistencias"
                rightTitle="Número de Asistencias"
                leftItems={stats.rankings.assisters.male}
                rightItems={stats.rankings.assisters.female}
              />
            </section>

            <section>
              <SectionTitle prefix="Conoce a nuestros mayores" highlight="Atajadores" />
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <KeeperCard teamType="male" data={stats.keepers.male} />
                <KeeperCard teamType="female" data={stats.keepers.female} />
              </div>
              <RankingGlobalChart
                leftTitle="Número de Atajadas"
                rightTitle="Número de Atajadas"
                leftItems={stats.rankings.keepers.male}
                rightItems={stats.rankings.keepers.female}
              />
            </section>
            <section>
              <SectionTitle prefix="Todos los títulos," highlight="una sola historia" />
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <PalmaresBanner
                  count={stats.palmaresByAmbito.internacional}
                  label="Campeonatos Internacionales"
                />
                <PalmaresBanner
                  count={stats.palmaresByAmbito.nacional}
                  label="Campeonatos Nacionales"
                />
                <PalmaresBanner
                  count={stats.palmaresByAmbito.regional}
                  label="Campeonatos Regionales"
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
