import { useEffect } from "react";
import { supabase } from "../shared/services/supabaseClient";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        navigate("/");
      }
    };

    checkSession();
  }, [navigate]);

  return <p>Iniciando sesión...</p>;
};

export default Callback;
