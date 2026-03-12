import React from 'react'
import type { SelectedObject } from '../interfaces/ar.types'

interface ARHudProps {
  nearbyCount: number
  compassDeg: number
  compassReady: boolean
  selected: SelectedObject | null
  onCloseSelected: () => void
}

/**
 * ARHud — overlays informativos: contador de objetos, brújula y panel de objeto seleccionado.
 * Todos con z-index menor al de la navbar.
 */
export default function ARHud({
  nearbyCount,
  compassDeg,
  compassReady,
  selected,
  onCloseSelected,
}: ARHudProps) {
  return (
    <>
      {/* Contador de objetos cercanos */}
      <div style={styles.hud}>
        {nearbyCount === 0
          ? '🔍 Sin objetos en esta zona'
          : `✨ ${nearbyCount} objeto${nearbyCount > 1 ? 's' : ''} cerca — gira para encontrarlos`}
      </div>

      {/* Brújula debug */}
      <div style={styles.compass}>
        🧭 {Math.round(compassDeg)}° {compassReady ? '✅' : '⏳'}
      </div>

      {/* Panel de objeto seleccionado */}
      {selected && (
        <div style={styles.panel}>
          <p style={styles.panelTitle}>📦 {selected.label}</p>
          <p style={styles.panelSub}>A {selected.distance} metros de ti</p>
          <button style={styles.closeBtn} onClick={onCloseSelected}>
            ✕ Cerrar
          </button>
        </div>
      )}
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  hud: {
    position: 'fixed',
    top: 72, // deja espacio para la navbar
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(8px)',
    color: '#fff',
    padding: '8px 20px',
    borderRadius: 20,
    fontSize: 13,
    zIndex: 10, // por debajo de la navbar
    fontFamily: 'monospace',
    border: '1px solid rgba(255,255,255,0.1)',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  },
  compass: {
    position: 'fixed',
    top: 112,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.5)',
    color: '#00FF88',
    padding: '6px 14px',
    borderRadius: 12,
    zIndex: 10,
    fontFamily: 'monospace',
    fontSize: 12,
    pointerEvents: 'none',
  },
  panel: {
    position: 'fixed',
    bottom: 48,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#fff',
    padding: '20px 36px',
    borderRadius: 20,
    textAlign: 'center',
    zIndex: 10,
    minWidth: 240,
  },
  panelTitle: { fontSize: 22, fontWeight: 700, margin: 0 },
  panelSub:   { fontSize: 13, opacity: 0.5, margin: '4px 0 16px' },
  closeBtn: {
    background: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: 10,
    padding: '10px 28px',
    cursor: 'pointer',
    fontWeight: 700,
  },
}