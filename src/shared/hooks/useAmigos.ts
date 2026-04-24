import { useEffect, useState } from "react";
import { fetchAmigos, type Amigo } from "../../lib/DummyAPI";

export function useFetchAmigos(id: string) { 
  const [amigos, setAmigos] = useState<Amigo[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  //console.log("useUsuarioByName: ", nombre)
  useEffect(() => {


    let active = true;

    async function loadAmigos() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchAmigos(id);
        if (active) {
          setAmigos(data.length > 0 ? data : []);
        }
      } catch (loadError) {
        console.log("Error fetching amigos: ", loadError);
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Error al cargar usuario"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadAmigos();

    return () => {
      active = false;
    };
  }, [id]);

  return {
    amigos,
    loading,
    error,
  };
}
