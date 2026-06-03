import { useEffect, useState } from "react";
import { supabase } from "@/shared/services/supabaseClient";
import type { Rifa } from "../interfaces/rifa";

export default function useRifas() {
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRifas = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("rifas")
      .select("*, rifa_boletos(count)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const mapped: Rifa[] = (data ?? []).map((r) => ({
      ...r,
      boletos_vendidos: r.rifa_boletos?.[0]?.count ?? 0,
    }));

    setRifas(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchRifas();
  }, []);

  return { rifas, loading, fetchRifas };
}
