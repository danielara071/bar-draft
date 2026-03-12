import React from 'react'

interface ARStartScreenProps {
  onStart: () => void
}

export default function ARStartScreen({ onStart }: ARStartScreenProps) {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌍 AR World</h2>
      <p style={styles.desc}>
        Mueve tu cámara para encontrar objetos ocultos cerca de ti
      </p>
      <button style={styles.btn} onClick={onStart}>
        Iniciar experiencia
      </button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#fff',
    fontFamily: 'sans-serif',
    padding: '0 32px',
    textAlign: 'center',
  },
  title: { fontSize: 36, fontWeight: 800, margin: '0 0 12px', letterSpacing: -1 },
  desc:  { fontSize: 16, opacity: 0.6, maxWidth: 280, lineHeight: 1.6, margin: '0 0 40px' },
  btn: {
    background: 'linear-gradient(135deg, #6c63ff, #3ecfcf)',
    color: '#fff',
    border: 'none',
    borderRadius: 16,
    padding: '16px 48px',
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
  },
}