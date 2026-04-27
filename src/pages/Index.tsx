import { useEffect } from "react";
import { supabase } from "../shared/services/supabaseClient";
import SignInButton from "../features/login/components/SignInButton";

const Index = () => {
  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error.message);
        return;
      }

      const s = data.session;

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

  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signInSpotify = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "spotify",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="h-dvh overflow-hidden bg-[#f3f3f3]">
      <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
        <div className="relative hidden overflow-hidden lg:block">
          <img
            src="/loginStadium.png"
            alt="Estadio"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#a3004f]/55 via-transparent to-[#002f87]/35" />
        </div>

        <div className="flex items-center justify-center px-6 py-8 sm:px-10">
          <div className="w-full max-w-105">
            <p className="text-center text-5xl font-extrabold tracking-tight text-[#a50050]">
              FC Barcelona
            </p>

            <div className="mt-14 space-y-2">
              <h1 className="text-5xl font-semibold tracking-tight text-[#121212]">
                Benvingut
              </h1>
              <p className="text-lg text-[#7a7a7a]">
                Inicia sesion para acceder a tu cuenta
              </p>
            </div>

            <div className="mt-10 space-y-4">
              <SignInButton
                onClick={signInGoogle}
                label="Continuar con Google"
                logoSrc="/web_neutral_sq_na.svg"
                logoAlt="Google"
                className="flex w-full items-center justify-center gap-3 rounded-full border border-[#d6d6d6] bg-white px-6 py-2 text-lg font-semibold text-[#1f1f1f] transition hover:bg-[#f8f8f8]"
                logoClassName="h-10 w-auto"
              />

              <SignInButton
                onClick={signInSpotify}
                label="Continuar con Spotify"
                logoSrc="/Primary_Logo_White_RGB.svg"
                logoAlt="Spotify"
                className="flex w-full cursor-default items-center justify-center gap-3 rounded-full bg-[#1ED760] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#1bc457]"
                logoClassName="h-6 w-auto"
              />
            </div>

            <div className="mt-12 space-y-8 text-center text-[#7a7a7a]">
              <p className="text-sm">
                Al continuar, aceptas nuestros terminos de servicio y politica
                de privacidad
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
