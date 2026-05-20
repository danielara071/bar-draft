import { Target, Clock, CalendarDays, Footprints, ShieldCheck, SearchX } from 'lucide-react'

// Forma exacta del payload que devuelve la tool getPlayerStats (servidor).
export interface PlayerStats {
  id: string
  nombre: string
  numero: number | null
  posicion: string | null
  goles: number
  asistencias: number
  atajadas: number | null
  partidos_jugados: number
  minutos_jugados: number
  imagen_url: string | null
  equipo: 'varonil' | 'femenil'
}

const STAT_BOXES = (p: PlayerStats) => [
  { label: 'GOLES',            value: p.goles,                 icon: Target },
  { label: 'MINUTOS',          value: `${p.minutos_jugados}'`, icon: Clock },
  { label: 'PARTIDOS JUGADOS', value: p.partidos_jugados,      icon: CalendarDays },
  { label: 'ASISTENCIAS',      value: p.asistencias,           icon: Footprints },
  { label: 'ATAJADAS',         value: p.atajadas ?? '–',       icon: ShieldCheck },
]

export const PlayerStatsCard = ({ player }: { player: PlayerStats }) => (
  <div
    className="rounded-2xl overflow-hidden flex w-[420px] min-h-[220px] shadow-xl text-white flex-shrink-0"
    style={{ background: 'linear-gradient(135deg, #6B0028 0%, #004D98 100%)' }}
  >
    {/* ── Mitad izquierda: datos ── */}
    <div className="flex flex-col justify-between p-4 flex-1 min-w-0">
      {/* Encabezado */}
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black uppercase leading-none tracking-tight">
            {player.nombre}
          </span>
          {player.numero != null && (
            <span className="text-lg font-bold opacity-70">#{player.numero}</span>
          )}
        </div>
        <p className="text-[11px] text-white/60 uppercase tracking-widest mt-1">
          {player.posicion ?? 'FC BARCELONA'}&nbsp;&nbsp;|&nbsp;&nbsp;
          {player.equipo === 'femenil' ? 'FEMENÍ' : 'MASCULÍ'}
        </p>
      </div>

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-2 gap-1.5 mt-3">
        {STAT_BOXES(player).map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl px-2.5 py-2 flex items-center gap-2"
            style={{ background: 'rgba(0,0,0,0.25)' }}
          >
            <Icon className="w-4 h-4 opacity-70 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-base font-bold leading-none">{value}</div>
              <div className="text-[9px] text-white/55 uppercase tracking-wide mt-0.5 truncate">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* ── Mitad derecha: foto ── */}
    <div className="w-[140px] flex-shrink-0 relative overflow-hidden">
      {player.imagen_url ? (
        <img
          src={player.imagen_url}
          alt={player.nombre}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center opacity-20 text-6xl">
          👤
        </div>
      )}
      {/* gradiente para que la foto se integre con el fondo */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(107,0,40,0.35) 0%, transparent 40%)' }}
      />
    </div>
  </div>
)

// GenUI también cubre el caso "no encontrado": es otro componente del registry.
export const PlayerNotFoundCard = ({ query }: { query?: string }) => (
  <div
    className="rounded-2xl flex items-center gap-3 w-[420px] p-4 shadow-xl text-white flex-shrink-0"
    style={{ background: 'linear-gradient(135deg, #6B0028 0%, #004D98 100%)' }}
  >
    <SearchX className="w-8 h-8 opacity-80 flex-shrink-0" />
    <div className="min-w-0">
      <div className="text-base font-bold leading-tight">Jugador/a no encontrado</div>
      <div className="text-[12px] text-white/70 mt-0.5 truncate">
        No hay datos {query ? `de "${query}"` : ''} en la base de datos del club.
      </div>
    </div>
  </div>
)
