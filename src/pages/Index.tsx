import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../shared/services/supabaseClient";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error.message);
        return;
      }

      const s = data.session;
      setSession(s);

      if (s?.user?.email) {
        const { id, email } = s.user;

        const { error } = await supabase
          .from("profiles")
          .upsert({ id, email }, { onConflict: "id" });

        if (error) console.error("Error guardando perfil:", error.message);
      }
    };

    init();
  }, []);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error.message);
    setSession(null);
  };

  return (
    <div className="p-6 py-34">
      {session ? (
        <div className="flex items-center gap-4">
          <p className="text-gray-700">
            Sesión iniciada como {session.user.user_metadata?.full_name}
          </p>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <button
          onClick={signIn}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Inicia Sesión con Google
        </button>
      )}
    </div>
  );
};

export default Index;
