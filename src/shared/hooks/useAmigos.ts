import { useEffect, useState, useCallback } from "react";
import { fetchAmigos, type Amigo } from "../../lib/DummyAPI";

export function useFetchAmigos(id: string, f_status: string) {
  const [amigos, setAmigos] = useState<Amigo[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAmigos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchAmigos(id, f_status);
      setAmigos(data.length > 0 ? data : []);
    } catch (loadError) {
      console.log("Error fetching amigos:", loadError);

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Error al cargar amigos"
      );
    } finally {
      setLoading(false);
    }
  }, [id, f_status]);

  useEffect(() => {
    if (id) loadAmigos();
  }, [loadAmigos]);

  return {
    amigos,
    loading,
    error,
    reload: loadAmigos,
  };
}