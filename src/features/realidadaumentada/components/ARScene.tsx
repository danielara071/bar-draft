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

const FOV_DEGREES = 30  // tolerancia angular — mitad del campo de visión

/** Diferencia angular más corta entre dos headings (0-360) */
function angleDiff(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}

export default function ARScene({ userId, onBack }: ARSceneProps) {
  const { userCoords, error: gpsError } = useGPS(true)
  const { compassRef, compassReady }    = useCompass(true)
  const [modalOpen, setModalOpen]       = useState(false)
  const rafRef                          = useRef<number>(0)

  const {
    nearbyWorldObjects,
    selectedTrophy,
    selectTrophy,
    clearSelectedTrophy,
    capture,
  } = useUserTrophies(userId, userCoords)

  // ── Loop: detecta si algún objeto está en el FOV ─────────────
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

        const bearing = getBearing(
          userCoords.lat, userCoords.lng,
          obj.lat, obj.lng,
        )

        const inFov = angleDiff(heading, bearing) <= FOV_DEGREES

        if (inFov) {
          if (!closest || dist < closest.dist) {
            closest = { id: obj.id, dist }
          }
        }
      }

      if (closest) {
        selectTrophy(closest.id)
      } else {
        clearSelectedTrophy()
        setModalOpen(false)
      }

      rafRef.current = requestAnimationFrame(check)
    }

    rafRef.current = requestAnimationFrame(check)
    return () => cancelAnimationFrame(rafRef.current)
  }, [userCoords, nearbyWorldObjects])

  // Cleanup A-Frame al salir
  useEffect(() => {
    return () => {
      document.querySelectorAll('a-scene').forEach((s) => s.remove())
    }
  }, [])

  const handleCloseAll = () => {
    setModalOpen(false)
    clearSelectedTrophy()
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
        onSelectObject={(obj) => {
          selectTrophy(obj.id)
          setModalOpen(false)
        }}
      />

      <ARsystem
        nearbyCount={nearbyWorldObjects.length}
        compassDeg={compassRef.current}
        compassReady={compassReady}
        selected={
          selectedTrophy && !modalOpen
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
        onCloseSelected={handleCloseAll}
        onCollect={() => setModalOpen(true)}
      />

      <button
        onClick={onBack}
        className="fixed left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 font-sans text-sm font-semibold text-white backdrop-blur-md transition-opacity hover:opacity-80 active:opacity-60"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Volver
      </button>

      {modalOpen && selectedTrophy && (
        <TrophyModal
          trophy={selectedTrophy}
          onCapture={capture}
          onClose={handleCloseAll}
        />
      )}
    </div>
  )
}