interface ColeccionHeaderProps {
  collected: number
  total: number
  progressPct: number
  loading: boolean
}

export default function ColeccionHeader({
  collected,
  total,
  progressPct,
  loading,
}: ColeccionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-start gap-6 rounded-2xl bg-[#A50044] px-7 py-5 sm:flex-row sm:items-center">
      <span className="whitespace-nowrap font-sans text-[11px] font-extrabold uppercase tracking-[2px] text-white/70">
        Tu Colección
      </span>
      <div className="flex-1 w-full">
        <div className="mb-2 flex items-baseline gap-3">
          <span className="font-sans text-[13px] font-medium text-white">Tu Progreso</span>
          {loading ? (
            <span className="ml-auto font-sans text-xs text-white/50">Cargando...</span>
          ) : (
            <>
              <span className="ml-auto font-sans text-xs text-white/60">
                {collected}/{total} trofeos
              </span>
              <span className="font-sans text-3xl font-black leading-none text-white">
                {progressPct}%
              </span>
            </>
          )}
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-[#EDBB00] transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  )
}