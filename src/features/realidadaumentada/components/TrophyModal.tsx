import { useState } from 'react'
import type { TrophyWithCapture } from '../interfaces/ar.types'

interface TrophyModalProps {
  trophy: TrophyWithCapture
  onCapture: (trophyId: string) => Promise<void>
  onClose: () => void
}

export default function TrophyModal({ trophy, onCapture, onClose }: TrophyModalProps) {
  const [capturing, setCapturing] = useState(false)
  const [captured, setCaptured]   = useState(trophy.captured)

  const handleCapture = async () => {
    if (captured || capturing) return
    try {
      setCapturing(true)
      await onCapture(trophy.id)
      setCaptured(true)
    } finally {
      setCapturing(false)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        style={{ zIndex: 30 }}
        onClick={onClose}
      />

      <div
        className="fixed bottom-0 left-0 right-0 mx-auto max-w-lg rounded-t-3xl bg-[#0A1535] px-6 pb-10 pt-6 text-white"
        style={{ zIndex: 31 }}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/20" />

        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#EDBB00]/15">
            <TrophyIcon />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold leading-tight">{trophy.nombre}</h2>
            {trophy.jugador_asociado && (
              <p className="mt-1 text-sm text-white/50">{trophy.jugador_asociado}</p>
            )}
            {trophy.nombre_lugar && (
              <p className="mt-0.5 text-xs text-white/35">📍 {trophy.nombre_lugar}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full bg-white/10 p-2 transition-opacity hover:opacity-70"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {trophy.descripcion && (
          <p className="mb-6 text-sm leading-relaxed text-white/65">{trophy.descripcion}</p>
        )}

        {captured ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-[#A50044]/20 px-4 py-4">
            <span className="text-lg">✅</span>
            <span className="font-sans text-sm font-semibold text-white/80">
              ¡Ya tienes este trofeo!
            </span>
            {trophy.fecha_obtencion && (
              <span className="ml-auto font-sans text-xs text-white/35">
                {new Date(trophy.fecha_obtencion).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>
        ) : (
          <button
            onClick={handleCapture}
            disabled={capturing}
            className="w-full rounded-xl bg-[#A50044] py-4 font-sans text-base font-bold text-white transition-opacity hover:opacity-90 active:opacity-75 disabled:opacity-50"
          >
            {capturing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Capturando...
              </span>
            ) : (
              '🏆 Capturar trofeo'
            )}
          </button>
        )}
      </div>
    </>
  )
}

function TrophyIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
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