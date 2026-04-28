import { useState } from "react";

const countries = [
  "México",
  "España",
  "Argentina",
  "Colombia",
  "Chile",
  "Perú",
  "Estados Unidos",
  "Otro",
];

const avatars = Array.from({ length: 8 }, (_, i) => `avatar-${i + 1}`);

const NewUserWelcome = () => {
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState(countries[0]);
  const [avatar, setAvatar] = useState(avatars[0]);

  return (
    <div className="relative min-h-dvh flex items-start justify-center px-4 py-8">
      <div className="absolute inset-0 bg-[url('/firstLogin.png')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-brand-white p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-brand-crimson">Bienvenido</h1>
            <p className="mt-2 text-sm text-brand-gray-mid">Cuéntanos un poco sobre ti para completar tu perfil</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="mb-1 block text-sm font-semibold text-brand-black">Nombre de usuario</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ej. culé_1998"
                className="w-full rounded-xl border border-brand-gray-light px-3 py-2 text-sm text-brand-black outline-none focus:border-brand-crimson focus:ring-2 focus:ring-brand-crimson/10"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-brand-black">¿De dónde nos visitas?</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-xl border border-brand-gray-light px-3 py-2 text-sm text-brand-black outline-none focus:border-brand-crimson focus:ring-2 focus:ring-brand-crimson/10"
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-brand-black">Elige tu avatar</p>
              <div className="grid grid-cols-4 gap-3">
                {avatars.map((a, i) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAvatar(a)}
                    className={`flex h-14 w-full items-center justify-center rounded-xl text-sm font-bold transition ${
                      avatar === a ? "ring-2 ring-brand-crimson bg-brand-crimson/5" : "bg-brand-gray-light/70"
                    }`}
                  >
                    <span className="text-brand-black">{i + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button className="w-full rounded-full bg-brand-crimson px-4 py-2 text-sm font-bold text-brand-white hover:bg-brand-crimsonlight">
                Guardar y continuar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewUserWelcome;
