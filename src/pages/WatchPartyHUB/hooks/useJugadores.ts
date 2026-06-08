import { useState, useCallback, useRef } from "react";
import { supabase } from "../../../shared/services/supabaseClient";

interface Jugador {
  id: string;
  nombre: string;
  equipo: string | null;
  categoria: string | null;
}

export function useJugadores() {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buscar = useCallback((query: string) => {
    // Cancelar la llamada pendiente anterior
    if (timerRef.current) clearTimeout(timerRef.current);

    if (query.trim().length < 2) {
      setJugadores([]);
      return;
    }

    // Esperar 300ms de inactividad antes de consultar
    timerRef.current = setTimeout(async () => {
      setIsSearching(true);

      const { data, error } = await supabase
        .from("laliga_jugadores")
        .select("id, nombre, equipo, categoria")
        .ilike("nombre", `%${query}%`)
        .limit(8);

      setIsSearching(false);
      setJugadores(!error && data ? data : []);
    }, 300);
  }, []);

  const limpiar = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setJugadores([]);
  }, []);

  return { jugadores, isSearching, buscar, limpiar };
}