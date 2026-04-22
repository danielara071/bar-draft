import { useEffect, useState } from "react";
import { fetchUsuarioByName, type Usuario } from "../../lib/DummyAPI";

export function useUsuarioByName(nombre: string) { 
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
        const data = await fetchUsuarioByName(nombre);
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
  }, [nombre]);

  return {
    usuario,
    loading,
    error,
  };
}
