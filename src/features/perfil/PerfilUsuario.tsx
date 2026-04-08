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
}: PerfilUsuarioProps) {
  return (
    <div className="bg-[#002244] text-white p-6 rounded-2xl ">
      
      <div className="space-y-5">
 
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-40 h-40 rounded-full object-cover"
            />
        <div className="py-4 flex gap-14">
            <h2 className="text-4xl font-semibold">@{username}</h2>
            <button
                onClick={onLogout}
                className="bg-[#A50044] hover:bg-pink-700 px-4 py-2 rounded-full text-sm"
            >
                Cerrar sesión
            </button>
        </div>
          <p className="text-sm text-yellow-400">
            #{ranking} en {pais}
          </p>
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