import { useEffect } from "react";
import { supabase } from "../shared/services/supabaseClient";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error obteniendo sesion en callback:", error.message);
        navigate("/login", { replace: true });
        return;
      }

      if (data.session) {
        navigate("/", { replace: true });
        return;
      }

      navigate("/login", { replace: true });
    };

    checkSession();
  }, [navigate]);

  return <p>Iniciando sesión...</p>;
};

export default Callback;
