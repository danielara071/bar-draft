import { useEffect, useState } from "react";
import { supabase } from "@/shared/services/supabaseClient";

export interface Ganador {
  id: string;
  rifa_id: number;
  ganador_id: string;
  video_url: string | null;
  estado: "pendiente" | "aceptado" | "denegado";
  created_at: string;
  rifa_nombre: string;
  ganador_nombre: string | null;
}

export default function useGanadores() {
  const [ganadores, setGanadores] = useState<Ganador[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGanadores = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("rifa_ganadores")
      .select("*, rifas(name), profiles:ganador_id(nombre, email)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("useGanadores:", error);
      setLoading(false);
      return;
    }

    const mapped: Ganador[] = (data ?? []).map((r) => {
      const rifa    = Array.isArray(r.rifas)    ? r.rifas[0]    : r.rifas;
      const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
      return {
        id:            r.id,
        rifa_id:       r.rifa_id,
        ganador_id:    r.ganador_id,
        video_url:     r.video_url,
        estado:        r.estado ?? "pendiente",
        created_at:    r.created_at,
        rifa_nombre:   rifa?.name ?? "—",
        ganador_nombre: profile?.nombre ?? profile?.email ?? null,
      };
    });

    setGanadores(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchGanadores();
  }, []);

  return { ganadores, loading, fetchGanadores };
}
