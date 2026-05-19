import { useEffect, useState, useRef } from 'react'
import { useGPS } from '../hooks/useGPS'
import { useCompass } from '../hooks/useCompass'
import { useUserTrophies } from '../hooks/useUsertrophy'
import AFrameScene from './AFrameScene'
import ARsystem from './ARsystem'
import CameraFeed from './CameraFeed'
import TrophyModal from './TrophyModal'
import { getDistanceMeters } from '../../../lib/geoUtils'

interface ARSceneProps {
  userId: string
  onBack: () => void
}

export default function ARScene({ userId, onBack }: ARSceneProps) {
  const { userCoords, error: gpsError } = useGPS(true)
  const { compassRef, compassReady }    = useCompass(true)
  const [modalOpen, setModalOpen]       = useState(false)
  const shownRef                        = useRef<Set<string>>(new Set())

  const {
    nearbyWorldObjects,
    selectedTrophy,
    selectTrophy,
    clearSelectedTrophy,
    capture,
  } = useUserTrophies(userId, userCoords)

  // ── Proximity detection — corre cuando cambian coords u objetos ──
  useEffect(() => {
    if (!userCoords || nearbyWorldObjects.length === 0) return

    nearbyWorldObjects.forEach((obj) => {
      const dist = getDistanceMeters(
        userCoords.lat, userCoords.lng,
        obj.lat, obj.lng,
      )

      if (dist <= 300 && !shownRef.current.has(obj.id)) {
        shownRef.current.add(obj.id)
        selectTrophy(obj.id)
        setModalOpen(false)
      }

      // Si el usuario se aleja, lo reseteamos para que vuelva a aparecer
      if (dist > 300 && shownRef.current.has(obj.id)) {
        shownRef.current.delete(obj.id)
      }
    })
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
    shownRef.current.clear()
  }

  if (gpsError) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-[#0f0f1a] to-[#1a0f2e] font-sans">
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
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-[#0f0f1a] to-[#1a0f2e] font-sans">
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

      {/* z-0 */}
      <CameraFeed />

      {/* z-1 */}
      <AFrameScene
        userCoords={userCoords}
        nearbyObjects={nearbyWorldObjects}
        compassRef={compassRef}
        onSelectObject={(obj) => {
          selectTrophy(obj.id)
          setModalOpen(false)
        }}
      />

      {/* z-10 */}
      <ARsystem
        nearbyCount={nearbyWorldObjects.length}
        compassDeg={compassRef.current}
        compassReady={compassReady}
        selected={
          selectedTrophy
            ? { id: selectedTrophy.id, label: selectedTrophy.nombre, distance:
                userCoords
                  ? Math.round(getDistanceMeters(userCoords.lat, userCoords.lng, selectedTrophy.lat, selectedTrophy.lng))
                  : 0
              }
            : null
        }
        onCloseSelected={handleCloseAll}
        onCollect={() => setModalOpen(true)}
      />

      {/* z-20 */}
      <button
        onClick={onBack}
        className="fixed left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 font-sans text-sm font-semibold text-white backdrop-blur-md transition-opacity hover:opacity-80 active:opacity-60"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Volver
      </button>

      {/* z-30 */}
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