import type { SelectedObject } from '../interfaces/ar.types'

interface ARSystemProps {
  nearbyCount: number
  compassDeg: number
  compassReady: boolean
  selected: SelectedObject | null
  onCloseSelected: () => void
  onCollect: () => void
}

export default function ARsystem({
  nearbyCount,
  compassDeg,
  compassReady,
  selected,
  onCloseSelected,
  onCollect,
}: ARSystemProps) {
  return (
    <>
      {/* ── HUD pill superior ───────────────────────────────── */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center rounded-full border border-white/10 bg-[#0A1535]/85 backdrop-blur-md px-4 py-2 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00FF88] shadow-[0_0_6px_#00FF88]" />
          <span className="font-mono text-[13px] font-bold text-[#00FF88]">
            {Math.round(compassDeg)}°
          </span>
          <span className="text-[10px]">
            {compassReady ? '🧭' : '⏳'}
          </span>
        </div>
        <div className="mx-3 h-4 w-px bg-white/15" />
        <span className="font-mono text-[12px] text-white/80">
          {nearbyCount === 0
            ? '🔍 Sin objetos en esta zona'
            : `✨ ${nearbyCount} ${nearbyCount > 1 ? 'objetos' : 'objeto'} cerca`}
        </span>
      </div>

      {/* ── Panel objeto seleccionado ───────────────────────── */}
      {selected && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-48px)] max-w-[420px] pointer-events-auto">
          <div className="relative rounded-3xl border border-[#0A1535]/10 bg-white shadow-xl px-5 pt-5 pb-5 flex flex-col items-center gap-3">

            {/* Cerrar */}
            <button
              onClick={onCloseSelected}
              className="absolute top-3.5 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#0A1535]/8 text-[#0A1535]/50 text-xs hover:bg-[#0A1535]/15 transition-colors"
            >
              ✕
            </button>

            {/* Icono */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDBB00]/15">
              <TrophyIcon />
            </div>

            {/* Nombre */}
            <div className="flex flex-col items-center gap-1">
              <span className="font-serif text-[18px] font-bold text-[#0A1535] text-center leading-tight">
                {selected.label}
              </span>
              <span className="font-sans text-[12px] text-[#0A1535]/45">
                📍 A {selected.distance}m de ti
              </span>
            </div>

            {/* Botón */}
            <button
              onClick={onCollect}
              className="w-full rounded-2xl bg-[#A50044] py-3.5 font-sans text-[15px] font-bold text-white tracking-wide hover:opacity-90 active:opacity-75 transition-opacity"
            >
              🏆 Coleccióname
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function TrophyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 2h12v6a6 6 0 01-12 0V2zM4 2h2M18 2h2M4 4H2v2a4 4 0 004 4M20 4h2v2a4 4 0 01-4 4M12 14v4M8 22h8M9 18h6"
        stroke="#EDBB00"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}