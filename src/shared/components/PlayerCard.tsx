interface Player {
  id: number
  nombre: string
  numero: number
  posicion: string
  goles: number
  asistencias: number
  atajadas: number | null
  goles_recibidos: number | null
  partidos_jugados: number
  minutos_jugados: number
  imagen_url: string | null
}

const stats = (p: Player) => [
  { label: 'Goles',       value: p.goles },
  { label: 'Asistencias', value: p.asistencias },
  { label: 'Partidos',    value: p.partidos_jugados },
  { label: 'Minutos',     value: p.minutos_jugados },
  // porteros tienen atajadas; los demás no
  ...(p.atajadas != null       ? [{ label: 'Atajadas',     value: p.atajadas }]       : []),
  ...(p.goles_recibidos != null ? [{ label: 'G. recibidos', value: p.goles_recibidos }] : []),
]

export const PlayerCard = ({ player }: { player: Player }) => (
  <div
    className="rounded-2xl overflow-hidden w-52 text-white shadow-lg flex-shrink-0"
    style={{ background: 'linear-gradient(145deg, #004D98 0%, #A50044 100%)' }}
  >
    {/* Foto del jugador */}
    <div className="h-44 bg-black/20 overflow-hidden flex items-center justify-center">
      {player.imagen_url
        ? <img src={player.imagen_url} alt={player.nombre} className="w-full h-full object-cover" />
        : <span className="text-5xl opacity-30">👤</span>
      }
    </div>

    <div className="p-3">
      {/* Nombre y posición */}
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-xl font-black opacity-50">#{player.numero}</span>
        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
          {player.posicion}
        </span>
      </div>
      <h3 className="font-bold text-sm mb-3 leading-tight">{player.nombre}</h3>

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-2 gap-1.5">
        {stats(player).map(({ label, value }) => (
          <div key={label} className="bg-white/15 rounded-xl p-2 text-center">
            <div className="text-base font-bold">{value ?? '–'}</div>
            <div className="text-white/60 text-[9px] uppercase tracking-wide mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
)