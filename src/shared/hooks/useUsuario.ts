import { useEffect, useState } from "react";
import { fetchUsuarioById, type Usuario } from "../../lib/DummyAPI";

export function useUsuarioById(id: string) { 
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  //console.log("useUsuarioByName: ", nombre)
  useEffect(() => {


    let active = true;

    async function loadUsuario() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchUsuarioById(id);
        if (active) {
          //console.log("successful use, but length ",data.length)
          setUsuario(data.length > 0 ? data[0] : null);
        }
      } catch (loadError) {
        console.log("Error fetching usuario: ", loadError);
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

    void loadUsuario();

    return () => {
      active = false;
    };
  }, [id]);

  return {
    usuario,
    loading,
    error,
  };
}
