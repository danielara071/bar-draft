import { useState } from 'react'
import type { TrophyWithCapture } from '../interfaces/ar.types'
import TrophyDisplay from './TrophyDisplay'
import TrophyInfo from './TrophyInfo'
import LockIcon from '../icons/LockIcon'
import fondoarmario from '../../../assets/Logros/fondoarmario.png'

interface ArmarioProps {
  trophies: TrophyWithCapture[]  // ahora recibe TODOS
  loading: boolean
}

interface SlotStyle {
  x: number
  scale: number
  z: number
  opacity: number
  blur: number
}

function getSlotStyle(idx: number, activeIdx: number, total: number): SlotStyle | null {
  let d = idx - activeIdx
  if (d > total / 2)  d -= total
  if (d < -total / 2) d += total
  if (Math.abs(d) > 2) return null

  return {
    x:       d * 200,
    scale:   d === 0 ? 1 : 0.65,
    z:       d === 0 ? 10 : 0,
    opacity: d === 0 ? 1 : 0.45,
    blur:    d === 0 ? 0 : 2,
  }
}

export default function Armario({ trophies, loading }: ArmarioProps) {
  const [activeIdx, setActiveIdx] = useState(0)

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#A50044]/20 border-t-[#A50044]" />
      </div>
    )
  }

  if (trophies.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#0A1535]/10">
        <LockIcon size={48} />
        <p className="font-sans text-sm font-semibold text-[#0A1535]/40">
          No hay trofeos disponibles
        </p>
      </div>
    )
  }

  const prev = () => setActiveIdx((i) => (i - 1 + trophies.length) % trophies.length)
  const next = () => setActiveIdx((i) => (i + 1) % trophies.length)
  const active = trophies[activeIdx]

  return (
    <div className="select-none">

     {/* Escenario */}
      <div
        className="relative mx-auto overflow-hidden rounded-2xl"
        style={{
          height: 380,
          backgroundImage: `url(${fondoarmario})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Decoración suelo */}
        <div className="absolute bottom-24 left-0 right-0 h-px bg-white/10" />
        <div
          className="absolute bottom-24 left-0 right-0 h-16"
          style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.03), transparent)' }}
        />

        {/* Label */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="font-sans text-[11px] font-extrabold uppercase tracking-[3px] text-white/30">
            Armario Culé
          </span>
        </div>

        {/* Carrusel */}
        <div className="absolute inset-0 flex items-end justify-center pb-10">
          {trophies.map((trophy, idx) => {
            const slot = getSlotStyle(idx, activeIdx, trophies.length)
            if (!slot) return null
            return (
              <div
                key={trophy.id}
                onClick={() => setActiveIdx(idx)}
                className="absolute cursor-pointer transition-all duration-500"
                style={{
                  transform:       `translateX(${slot.x}px) scale(${slot.scale})`,
                  zIndex:          slot.z,
                  opacity:         slot.opacity,
                  filter:          `blur(${slot.blur}px)`,
                  transformOrigin: 'bottom center',
                }}
              >
                <TrophyDisplay trophy={trophy} isActive={idx === activeIdx} />
              </div>
            )
          })}
        </div>

        {/* Flechas */}
        {trophies.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white text-xl hover:bg-black/50 transition-colors"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white text-xl hover:bg-black/50 transition-colors"
            >
              ›
            </button>
          </>
        )}

        {/* Dots */}
        {trophies.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {trophies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIdx
                    ? 'w-5 bg-[#EDBB00]'
                    : 'w-1.5 bg-white/25'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info trofeo activo */}
      <TrophyInfo trophy={active} />
    </div>
  )
}