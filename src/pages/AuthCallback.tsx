import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../shared/services/supabaseClient";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Obtener la sesión de Supabase (detecta el código de OAuth en la URL)
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          setError(`Error de autenticación: ${sessionError.message}`);
          setLoading(false);
          return;
        }

        if (session?.user) {
          // Sesión válida: navegar al home
          navigate("/", { replace: true });
        } else {
          // No hay sesión válida: ir a login
          navigate("/login", { replace: true });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Procesando autenticación...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
