import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AttemptBar from "./AttemptBar";
import { GiBullseye } from "react-icons/gi";
import { IoPeople } from "react-icons/io5";
import { GoGraph } from "react-icons/go";

type Stats = {
  total_players: number;
  total_won: number;
  success_rate: number;
  tries_1: number;
  tries_2: number;
  tries_3: number;
  tries_4: number;
  tries_5: number;
  tries_6: number;
  tries_lose: number;
};

export default function StatsCard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("wordle_stats")
        .select("*")
        .eq("used_on", today)
        .single();

      if (!error && data) setStats(data);
    };

    fetchStats();
  }, []);

  if (!stats) return null;

  const tries = [
    { label: "1", value: stats.tries_1, color: "bg-brand-navy" },
    { label: "2", value: stats.tries_2, color: "bg-brand-navy" },
    { label: "3", value: stats.tries_3, color: "bg-brand-navy" },
    { label: "4", value: stats.tries_4, color: "bg-brand-navy" },
    { label: "5", value: stats.tries_5, color: "bg-brand-navy" },
    { label: "6", value: stats.tries_6, color: "bg-brand-navy" },
    { label: "X", value: stats.tries_lose, color: "bg-brand-crimson" },
  ];

  const maxTries = Math.max(...tries.map((t) => t.value));

  return (
    <div className="w-full rounded-xl border border-brand-navy px-6 py-5 my-5">
      <p className="text-brand-navy font-semibold text-sm mb-4">
        Estadísticas en Tiempo Real
      </p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-brand-navy rounded-xl px-4 py-5 flex flex-col items-center justify-center gap-1">
          <IoPeople className="text-white"/>
          <p className="text-white text-3xl font-bold">{stats.total_players}</p>
          <p className="text-zinc-400 text-[10px] uppercase tracking-wide">Jugadores Totales</p>
        </div>

        <div className="bg-green-600 rounded-xl px-4 py-5 flex flex-col items-center justify-center gap-1">
          <GiBullseye className="text-white"/>
          <p className="text-white text-3xl font-bold">{stats.total_won}</p>
          <p className="text-green-200 text-[10px] uppercase tracking-wide">Acertaron</p>
        </div>

        <div className="bg-yellow-400 rounded-xl px-4 py-5 flex flex-col items-center justify-center gap-1">
          <GoGraph className="text-brand-navy"/>
          <p className="text-brand-navy text-3xl font-bold">{stats.success_rate}%</p>
          <p className="text-yellow-700 text-[10px] uppercase tracking-wide">Tasa de Éxito</p>
        </div>
      </div>

      <p className="text-brand-navy font-semibold text-sm mb-3">
        Distribución de Intentos
      </p>

    <div className="flex flex-col gap-2">
    {tries.map((t) => (
        <AttemptBar
        key={t.label}
        label={t.label}
        value={t.value}
        total={stats.total_players}
        max={maxTries}
        />
    ))}
    </div>
      
    </div>
  );
}