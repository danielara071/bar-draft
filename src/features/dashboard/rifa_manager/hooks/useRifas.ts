import { useEffect, useState } from "react";
import { supabase } from "@/shared/services/supabaseClient";
import type { Rifa } from "../interfaces/rifa";

export default function useRifas() {
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRifas = async () => {
    setLoading(true);

    // Auto-cierra rifas cuya fecha_cierre ya pasó
    const today = new Date().toISOString().split("T")[0];
    await supabase
      .from("rifas")
      .update({ estado: "terminada" })
      .eq("estado", "activa")
      .lte("fecha_cierre", today);

    const { data, error } = await supabase
      .from("rifas")
      .select("*, rifa_boletos(count), ganador:ganador_id(nombre, email)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const mapped: Rifa[] = (data ?? []).map((r) => {
      const ganador = Array.isArray(r.ganador) ? r.ganador[0] : r.ganador;
      return {
        ...r,
        boletos_vendidos: r.rifa_boletos?.[0]?.count ?? 0,
        ganador_nombre: ganador?.nombre ?? ganador?.email ?? null,
      };
    });

    setRifas(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchRifas();
  }, []);

  return { rifas, loading, fetchRifas };
}
