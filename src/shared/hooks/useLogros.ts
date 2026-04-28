import { useEffect, useState } from "react";
import { fetchUsuarioLogros, type Logro } from "../../lib/DummyAPI";

export function useUsuarioLogros(userId: string) {
  const [logros, setLogros] = useState<Logro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setLogros([]);
      setError("");
      setLoading(false);
      return;
    }

    let active = true;

    async function loadLogros() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchUsuarioLogros(userId);
        if (active) {
          //console.log("Logros obtenidos:", data);
          setLogros(data);
        }
      } catch (loadError) {
        console.error("Error fetching logros:", loadError);
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Error al cargar logros"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadLogros();

    return () => {
      active = false;
    };
  }, [userId]);

  return {
    logros,
    loading,
    error,
  };
}
