import { Trophy, Footprints } from 'lucide-react'

interface PlayerSummary {
  id: string
  nombre: string
  numero: number | null
  posicion: string | null
  goles: number
  asistencias: number
  imagen_url: string | null
}

interface PlayerListCardProps {
  titulo: string
  jugadores: PlayerSummary[]
}

export const PlayerListCard = ({ titulo, jugadores }: PlayerListCardProps) => (
  <div
    className="rounded-2xl overflow-hidden shadow-xl text-white w-full max-w-[520px] flex-shrink-0"
    style={{ background: 'linear-gradient(160deg, #00205B 0%, #A50044 100%)' }}
  >
    {/* Encabezado */}
    <div className="px-4 pt-4 pb-2 border-b border-white/10">
      <p className="text-[10px] uppercase tracking-widest text-white/50">FC BARCELONA</p>
      <h3 className="font-black text-lg uppercase leading-tight">{titulo}</h3>
    </div>

    {/* Lista de jugadores */}
    <div className="p-3 flex flex-col gap-2">
      {jugadores.map((j) => (
        <div
          key={j.id}
          className="flex items-center gap-3 rounded-xl px-3 py-2"
          style={{ background: 'rgba(255,255,255,0.07)' }}
        >
          {/* Foto */}
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-white/10">
            {j.imagen_url
              ? <img src={j.imagen_url} alt={j.nombre} className="w-full h-full object-cover object-top" />
              : <div className="w-full h-full flex items-center justify-center text-lg opacity-30">👤</div>
            }
          </div>

          {/* Nombre y posición */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase leading-none truncate">{j.nombre}</span>
              {j.numero != null && (
                <span className="text-[10px] text-white/40 flex-shrink-0">#{j.numero}</span>
              )}
            </div>
            <p className="text-[9px] text-white/50 uppercase tracking-wide mt-0.5">{j.posicion ?? '—'}</p>
          </div>

          {/* Stats compactas */}
          <div className="flex gap-2 flex-shrink-0">
            <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1">
              <Trophy className="w-3 h-3 text-yellow-300 opacity-80" />
              <span className="text-xs font-bold">{j.goles}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1">
              <Footprints className="w-3 h-3 text-blue-300 opacity-80" />
              <span className="text-xs font-bold">{j.asistencias}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)
