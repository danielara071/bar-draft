import { useEffect, useState } from "react";
import { fetchAmigosByName, type Amigo } from "../../lib/DummyAPI";

export function usefetchAmigosByName(name: string) { 
  const [amigos, setAmigos] = useState<Amigo[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  //console.log("useUsuarioByName: ", nombre)
  useEffect(() => { // en caso de que sea un string vacio no mandamos nada
    if (!name.trim()) {
          setAmigos(null);
          setLoading(false);
          setError("");
          return; 
        }

    let active = true;

    async function loadAmigos() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchAmigosByName(name);
        if (active) {
          //console.log("successful use, but length ",data.length)
          setAmigos(data.length > 0 ? data : null);
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
  }, [name]);

  return {
    amigos,
    loading,
    error,
  };
}
