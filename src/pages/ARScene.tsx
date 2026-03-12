import { useState, useRef } from 'react'
import type { SelectedObject } from '../interfaces/ar.types'
import { useGPS } from '../hooks/useGPS'
import { useCompass } from '../hooks/useCompass'
import CameraFeed from '../components/CameraFeed'
import AFrameScene from '../components/AFrameScene'
import ARHud from '../components/ARHud'
import ARStartScreen from '../components/ARStartScreen'

/**
 * ARScene — página principal de Realidad Aumentada.
 *
 * Stack de z-index:
 *   0  → CameraFeed (video de fondo)
 *   1  → AFrameScene (objetos 3D A-Frame)
 *   10 → ARHud (overlays: brújula, contador, panel)
 *   navbar → debe tener z-index ≥ 50 en tu layout para quedar encima de todo
 */
export default function ARScene() {
  const [started, setStarted]   = useState(false)
  const [selected, setSelected] = useState<SelectedObject | null>(null)

  const { userCoords, nearbyObjects, error } = useGPS(started)
  const { compassRef, compassReady }         = useCompass(started)

  // Expone el valor actual de compassRef para el HUD (re-render cada frame no es necesario)
  const compassDisplayRef = useRef<number>(0)
  if (compassRef) compassDisplayRef.current = compassRef.current

  // ── Pantalla de inicio ──────────────────────────────────────
  if (!started) {
    return (
      <div style={wrapperStyle}>
        <ARStartScreen onStart={() => setStarted(true)} />
      </div>
    )
  }

  // ── Error GPS ───────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ ...wrapperStyle, ...centeredStyle }}>
        <p style={{ color: '#fff', fontSize: 16 }}>⚠️ {error}</p>
        <small style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>
          Activa el GPS e intenta de nuevo
        </small>
      </div>
    )
  }

  // ── Esperando GPS ───────────────────────────────────────────
  if (!userCoords) {
    return (
      <div style={{ ...wrapperStyle, ...centeredStyle }}>
        <div style={spinnerStyle} />
        <p style={{ color: '#fff', marginTop: 16 }}>Obteniendo ubicación GPS...</p>
      </div>
    )
  }

  // ── Escena AR activa ────────────────────────────────────────
  return (
    // Este wrapper NO es fixed ni fullscreen — se adapta al contenedor del layout
    // La navbar de tu layout queda por encima gracias a su z-index mayor
    <div style={wrapperStyle}>
      {/* Fondo: cámara */}
      <CameraFeed />

      {/* Objetos 3D A-Frame */}
      <AFrameScene
        userCoords={userCoords}
        nearbyObjects={nearbyObjects}
        compassRef={compassRef}
        onSelectObject={setSelected}
      />

      {/* Overlays informativos */}
      <ARHud
        nearbyCount={nearbyObjects.length}
        compassDeg={compassRef.current}
        compassReady={compassReady}
        selected={selected}
        onCloseSelected={() => setSelected(null)}
      />
    </div>
  )
}

// ── Estilos del wrapper ──────────────────────────────────────────
// position: relative (no fixed) para respetar el layout con navbar
const wrapperStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f0f1a, #1a0f2e)',
  overflow: 'hidden',
}

const centeredStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'sans-serif',
}

const spinnerStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  border: '3px solid rgba(255,255,255,0.2)',
  borderTop: '3px solid #fff',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
}