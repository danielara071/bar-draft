import { useState } from "react";

const countryOptions = [
  "México",
  "España",
  "Argentina",
  "Colombia",
  "Chile",
  "Perú",
  "Estados Unidos",
  "Otro",
];

const avatarOptions = [
  { id: "avatar-1", label: "Avatar 01" },
  { id: "avatar-2", label: "Avatar 02" },
  { id: "avatar-3", label: "Avatar 03" },
  { id: "avatar-4", label: "Avatar 04" },
];

const NewUserWelcome = () => {
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState(countryOptions[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0].id);

  return (
    <div className="min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_top,rgba(181,23,75,0.14),transparent_36%),linear-gradient(135deg,#f7f4ef_0%,#f1f5f9_55%,#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-7xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-4xl border border-brand-gray-light bg-brand-white shadow-[0_24px_70px_rgba(15,45,82,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative flex min-h-70 flex-col justify-end overflow-hidden bg-brand-navy p-8 text-brand-white sm:p-10 lg:min-h-full lg:p-12">
            <div className="absolute inset-0 bg-[url('/loginStadium.png')] bg-cover bg-center opacity-45" />
            <div className="absolute inset-0 bg-linear-to-t from-brand-navy via-brand-navy/85 to-brand-crimson/40" />

            <div className="relative z-10 max-w-xl space-y-4">
              <p className="text-label uppercase tracking-spaced text-brand-gray-light/90">
                Nuevo miembro
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                Hola, culé.
              </h1>
              <p className="max-w-lg text-base leading-7 text-brand-gray-light/90 sm:text-lg">
                Antes de entrar al estadio digital, completa tu perfil con tu
                nombre de usuario, el país desde donde nos visitas y tu imagen
                de perfil.
              </p>
              <div className="inline-flex rounded-full border border-brand-gray-light/25 bg-brand-white/10 px-4 py-2 text-sm font-semibold text-brand-white backdrop-blur-sm">
                Bienvenido a tu primer paso dentro del club
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
            <div className="w-full max-w-2xl space-y-8">
              <div className="space-y-3">
                <p className="text-label uppercase tracking-spaced text-brand-gray-mid">
                  Configuración inicial
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-brand-black sm:text-4xl">
                  Completa tu perfil
                </h2>
                <p className="text-body leading-6 text-brand-gray-mid sm:text-base">
                  Solo te lo pedimos una vez. Después podrás entrar directo a la
                  plataforma con tu perfil listo.
                </p>
              </div>

              <form className="space-y-7" onSubmit={(event) => event.preventDefault()}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-label font-semibold uppercase tracking-spaced text-brand-gray-mid">
                      Tu username
                    </span>
                    <input
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="ej. culé_1998"
                      className="w-full rounded-2xl border border-brand-gray-light bg-brand-white px-4 py-3 text-base text-brand-black outline-none transition placeholder:text-brand-gray-mid focus:border-brand-crimson focus:ring-2 focus:ring-brand-crimson/15"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-label font-semibold uppercase tracking-spaced text-brand-gray-mid">
                      ¿De dónde nos visitas?
                    </span>
                    <select
                      value={country}
                      onChange={(event) => setCountry(event.target.value)}
                      className="w-full rounded-2xl border border-brand-gray-light bg-brand-white px-4 py-3 text-base text-brand-black outline-none transition focus:border-brand-crimson focus:ring-2 focus:ring-brand-crimson/15"
                    >
                      {countryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-label font-semibold uppercase tracking-spaced text-brand-gray-mid">
                      Elige tu imagen de perfil
                    </p>
                    <p className="mt-1 text-body text-brand-gray-mid">
                      Por ahora son placeholders; más adelante podrás usar las
                      imágenes definitivas.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {avatarOptions.map((avatar, index) => {
                      const isSelected = selectedAvatar === avatar.id;

                      return (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => setSelectedAvatar(avatar.id)}
                          className={`group flex flex-col items-center gap-3 rounded-3xl border p-4 text-left transition ${
                            isSelected
                              ? "border-brand-crimson bg-brand-crimson/6 shadow-[0_12px_30px_rgba(181,23,75,0.12)]"
                              : "border-brand-gray-light bg-brand-white hover:border-brand-crimson/40 hover:bg-brand-gray-light/20"
                          }`}
                        >
                          <div
                            className={`flex h-20 w-20 items-center justify-center rounded-full text-lg font-bold transition ${
                              index === 0
                                ? "bg-brand-crimson text-brand-white"
                                : index === 1
                                  ? "bg-brand-navy text-brand-white"
                                  : index === 2
                                    ? "bg-brand-yellow text-brand-black"
                                    : "bg-brand-gray-light text-brand-black"
                            }`}
                          >
                            {avatar.label.slice(-2)}
                          </div>
                          <div className="w-full">
                            <p className="text-sm font-semibold text-brand-black">
                              {avatar.label}
                            </p>
                            <p className="text-xs text-brand-gray-mid">
                              Imagen por definir
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-brand-gray-light pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-brand-gray-mid">
                    Guardarás el perfil como <span className="font-semibold text-brand-black">{username || "tu username"}</span> desde <span className="font-semibold text-brand-black">{country}</span>.
                  </div>
                  <button
                    type="submit"
                    className="rounded-full bg-brand-crimson px-6 py-3 text-sm font-bold text-brand-white transition hover:bg-brand-crimsonlight active:scale-[0.99]"
                  >
                    Guardar y continuar
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default NewUserWelcome;