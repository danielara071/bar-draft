import NivelFan from "./NivelFan";

type PerfilUsuarioProps = {
  username: string;
  ranking: number;
  pais: string;
  avatarUrl: string;
  onLogout: () => void;
  puntos: number;
  logros: number;
  predicciones: number;

  nivel: number;
  xpActual: number;
  xpMax: number;

  logro:string;
  
};

export default function PerfilUsuario({
  username,
  ranking,
  pais,
  avatarUrl,
  onLogout,
  puntos,
  logros,
  predicciones,

  nivel,
  xpActual,
  xpMax,
  logro
}: PerfilUsuarioProps) {
  return (
    <div className="p-6"> 
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-40 h-40 rounded-full object-cover"
          />
          <img
            src={`src/assets/Logros/${logro}.png`}
            alt="avatar"
            className="w-40 h-40 object-cover rounded-lg"
          />
        </div>
        <div className="py-4 flex gap-14">
            <h2 className="text-white text-4xl font-semibold">@{username}</h2>
            <button
                onClick={onLogout}
                className="text-white bg-[#A50044] hover:bg-pink-700 px-4 py-2 rounded-full text-sm"
            >
                Cerrar sesión
            </button>
        </div>

        <div className="flex flex-row gap-1">
          <p className="text-sm text-yellow-400">
            #{ranking} 
          </p>
          <p className="text-sm text-white">
            en {pais}
          </p>
        </div>
      </div>
      <NivelFan
        nivel={nivel}
        xpActual={xpActual}
        xpMax={xpMax}
      />
      {/* Stats */}
      <div className="grid grid-cols-3 text-center mt-6">
        <div>
          <p className="text-yellow-400 text-2xl font-bold">{puntos}</p>
          <p className="text-sm text-gray-300">Puntos Totales</p>
        </div>

        <div>
          <p className="text-yellow-400 text-2xl font-bold">{logros}</p>
          <p className="text-sm text-gray-300">Logros</p>
        </div>

        <div>
          <p className="text-yellow-400 text-2xl font-bold">{predicciones}</p>
          <p className="text-sm text-gray-300">Predicciones Acertadas</p>
        </div>
      </div>
    </div>
  );
}