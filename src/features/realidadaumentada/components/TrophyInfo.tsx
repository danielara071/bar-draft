import type { TrophyWithCapture } from '../interfaces/ar.types'

interface TrophyInfoProps {
  trophy: TrophyWithCapture
}

export default function TrophyInfo({ trophy }: TrophyInfoProps) {
  return (
    <div className="mt-6 rounded-2xl border border-[#0A1535]/8 bg-[#A50044] px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="block font-sans text-[10px] uppercase tracking-widest text-white/40">
            Nombre del trofeo
          </span>
          <h3 className="font-sans text-xl font-bold text-white">
            {trophy.nombre}
          </h3>
          <span className="block font-sans text-[10px] uppercase tracking-widest text-white/40">
            Descripción
          </span>
          {trophy.descripcion && (
            <p className="mt-2 font-sans text-sm leading-relaxed text-white/65">
              {trophy.descripcion}
            </p>
          )}
        </div>
        <div className="shrink-0 rounded-xl bg-[#002244] px-3 py-2 text-center ">
          <span className="block font-sans text-[10px] uppercase tracking-widest text-white/40">
            Obtenido
          </span>
          <span className="block font-sans text-xs font-bold text-white mt-0.5">
            {trophy.fecha_obtencion
              ? new Date(trophy.fecha_obtencion).toLocaleDateString('es-ES', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })
              : '—'}
          </span>
        </div>
      </div>
      {trophy.nombre_lugar && (
        <p className="mt-3 font-sans text-xs text-[#0A1535]/40">
          📍 {trophy.nombre_lugar}
        </p>
      )}
    </div>
  )
}