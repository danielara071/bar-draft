import { useEffect, useState, useRef } from 'react'
import { useGPS } from '../hooks/useGPS'
import { useCompass } from '../hooks/useCompass'
import { useUserTrophies } from '../hooks/useUsertrophy'
import AFrameScene from './AFrameScene'
import ARsystem from './ARsystem'
import CameraFeed from './CameraFeed'
import TrophyModal from './TrophyModal'
import { getDistanceMeters, getBearing } from '../../../lib/geoUtils'

interface ARSceneProps {
  userId: string
  onBack: () => void
}

const FOV_DEGREES = 30

function angleDiff(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}

export default function ARScene({ userId, onBack }: ARSceneProps) {
  const { userCoords, error: gpsError } = useGPS(true)
  const { compassRef, compassReady }    = useCompass(true)
  const [modalOpen, setModalOpen]       = useState(false)
  const rafRef                          = useRef<number>(0)
  // Guarda el id del trofeo actualmente en FOV para no re-triggerear
  const inFovRef                        = useRef<string | null>(null)

  const {
    nearbyWorldObjects,
    selectedTrophy,
    selectTrophy,
    clearSelectedTrophy,
    capture,
  } = useUserTrophies(userId, userCoords)

  // ── FOV detection loop ───────────────────────────────────────
  useEffect(() => {
    if (!userCoords || nearbyWorldObjects.length === 0) return

    const check = () => {
      const heading = compassRef.current
      let closest: { id: string; dist: number } | null = null

      for (const obj of nearbyWorldObjects) {
        const dist = getDistanceMeters(
          userCoords.lat, userCoords.lng,
          obj.lat, obj.lng,
        )
        if (dist > 300) continue

        const bearing  = getBearing(userCoords.lat, userCoords.lng, obj.lat, obj.lng)
        const inFov    = angleDiff(heading, bearing) <= FOV_DEGREES

        if (inFov && (!closest || dist < closest.dist)) {
          closest = { id: obj.id, dist }
        }
      }

      if (closest) {
        // Objeto nuevo en FOV
        if (inFovRef.current !== closest.id) {
          inFovRef.current = closest.id
          selectTrophy(closest.id)

          // Buscar si ya fue capturado
          const obj = nearbyWorldObjects.find((o) => o.id === closest!.id)
          if (obj?.captured) {
            // Ya capturado — abrir modal directo
            setModalOpen(true)
          } else {
            // No capturado — mostrar panel "Coleccióname"
            setModalOpen(false)
          }
        }
      } else {
        // Nada en FOV — limpiar solo si no hay modal abierto
        if (!modalOpen) {
          inFovRef.current = null
          clearSelectedTrophy()
        }
      }

      rafRef.current = requestAnimationFrame(check)
    }

    rafRef.current = requestAnimationFrame(check)
    return () => cancelAnimationFrame(rafRef.current)
  }, [userCoords, nearbyWorldObjects, modalOpen])

  // Cleanup A-Frame al salir
  useEffect(() => {
    return () => {
      document.querySelectorAll('a-scene').forEach((s) => s.remove())
    }
  }, [])

  const handleCloseAll = () => {
    setModalOpen(false)
    clearSelectedTrophy()
    inFovRef.current = null
  }

  if (gpsError) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-linear-to-br from-[#0f0f1a] to-[#1a0f2e] font-sans">
        <p className="text-base text-white">⚠️ {gpsError}</p>
        <small className="mt-2 text-white/50">Activa el GPS e intenta de nuevo</small>
        <button onClick={onBack} className="mt-6 rounded-lg bg-white/10 px-6 py-2.5 font-sans text-sm font-semibold text-white transition-opacity hover:opacity-80">
          ← Volver
        </button>
      </div>
    )
  }

  if (!userCoords) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-linear-to-br from-[#0f0f1a] to-[#1a0f2e] font-sans">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/20 border-t-white" />
        <p className="mt-4 text-white">Obteniendo ubicación GPS...</p>
        <button onClick={onBack} className="mt-6 rounded-lg bg-white/10 px-6 py-2.5 font-sans text-sm font-semibold text-white transition-opacity hover:opacity-80">
          ← Volver
        </button>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">

      <CameraFeed />

      <AFrameScene
        userCoords={userCoords}
        nearbyObjects={nearbyWorldObjects}
        compassRef={compassRef}
        onSelectObject={(obj) => selectTrophy(obj.id)}
      />

      {/* Panel "Coleccióname" — solo si NO está capturado y NO hay modal abierto */}
      <ARsystem
        nearbyCount={nearbyWorldObjects.length}
        compassDeg={compassRef.current}
        compassReady={compassReady}
        selected={
          selectedTrophy && !modalOpen && !selectedTrophy.captured
            ? {
                id: selectedTrophy.id,
                label: selectedTrophy.nombre,
                distance: Math.round(
                  getDistanceMeters(
                    userCoords.lat, userCoords.lng,
                    selectedTrophy.lat, selectedTrophy.lng,
                  )
                ),
              }
            : null
        }
        onCloseSelected={handleCloseAll}  // se puede dejar aunque no se use en el panel
        onCollect={() => setModalOpen(true)}
      />
      {/* Modal — capturado: cierra y vuelve al hub | no capturado: permite capturar */}
      {modalOpen && selectedTrophy && (
        <TrophyModal
          trophy={selectedTrophy}
          onCapture={capture}
          onClose={selectedTrophy.captured ? onBack : handleCloseAll}
        />
      )}
    </div>
  )
}