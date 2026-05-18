import { Target, Clock, CalendarDays, Footprints, ShieldCheck } from 'lucide-react'

interface PlayerStats {
  nombre: string
  numero: number
  posicion: string
  goles: number
  asistencias: number
  atajadas: number | null
  partidos_jugados: number
  minutos_jugados: number
  imagen_url: string | null
}

const STAT_BOXES = (p: PlayerStats) => [
  { label: 'GOLES',            value: p.goles,              icon: Target },
  { label: 'MINUTOS',          value: `${p.minutos_jugados}'`, icon: Clock },
  { label: 'PARTIDOS JUGADOS', value: p.partidos_jugados,   icon: CalendarDays },
  { label: 'ASISTENCIAS',      value: p.asistencias,        icon: Footprints },
  { label: 'ATAJADAS',         value: p.atajadas ?? '–',    icon: ShieldCheck },
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
          <span className="text-lg font-bold opacity-70">#{player.numero}</span>
        </div>
        <p className="text-[11px] text-white/60 uppercase tracking-widest mt-1">
          {player.posicion}&nbsp;&nbsp;|&nbsp;&nbsp;FC BARCELONA&nbsp;&nbsp;·&nbsp;&nbsp;TEMP. 2024/25
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
