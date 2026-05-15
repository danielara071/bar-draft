import { useEffect } from "react";
import { supabase } from "../shared/services/supabaseClient";
import SignInButton from "../features/login/components/SignInButton";

// Traer la sesion de supabase para usar sus servicios
const Index = () => {
  useEffect(() => {
    const init = async () => {
      const { error } = await supabase.auth.getSession();

      if (error) {
        console.error(error.message);
        return;
      }
    };

    init();
  }, []);

  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
  };

  const signInSpotify = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "spotify",
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
  };

  return (
    <div className="h-dvh overflow-hidden bg-white">
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <div className="relative hidden overflow-hidden lg:block">
          <img
            src="/loginStadium.png"
            alt="Estadio"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-brand-crimson/55 via-transparent to-brand-navy/35" />
        </div>

        <div className="flex items-center justify-center px-6 py-8 sm:px-10">
          <div className="w-full max-w-105">
            <p className="text-center text-5xl font-extrabold  text-brand-crimson">
              FC Barcelona
            </p>

            <div className="mt-16 space-y-3">
              <h1 className="text-5xl font-semibold text-brand-black">
                Benvingut
              </h1>
              <p className="text-lg text-brand-gray-mid">
                Inicia sesión para acceder a tu cuenta
              </p>
            </div>

            <div className="mt-12 space-y-5">
              <SignInButton
                onClick={signInGoogle}
                label="Continuar con Google"
                logoSrc="/web_neutral_sq_na.svg"
                logoAlt="Google"
                className="flex w-full items-center justify-center gap-3 rounded-full border border-brand-gray-light bg-white px-6 py-2 text-lg font-semibold text-brand-black transition hover:bg-gray-50"
                logoClassName="h-10 w-auto"
              />
              <SignInButton
                onClick={signInSpotify}
                label="Continuar con Spotify"
                logoSrc="/Primary_Logo_White_RGB.svg"
                logoAlt="Spotify"
                className="flex w-full cursor-default items-center justify-center gap-3 rounded-full bg-green-500 px-6 py-4 text-lg font-semibold text-white transition hover:bg-green-600"
                logoClassName="h-6 w-auto"
              />
            </div>

            <div className="mt-14 space-y-8 text-center text-brand-gray-mid">
              <p className="text-sm">
                Al continuar, aceptas nuestros términos de servicio y política
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
