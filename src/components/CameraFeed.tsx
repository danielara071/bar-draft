import { useEffect, useRef } from 'react'

/**
 * CameraFeed — renderiza el stream de la cámara trasera como fondo del AR.
 * IMPORTANTE: usa z-index bajo para NO tapar la navbar ni otros overlays.
 */
export default function CameraFeed() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let stream: MediaStream | null = null

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then((s) => {
        stream = s
        if (videoRef.current) videoRef.current.srcObject = s
      })
      .catch(console.error)

    return () => {
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        // z-index 0: queda DETRÁS de la navbar (que debe tener z-index mayor)
        zIndex: 0,
        pointerEvents: 'none', // nunca captura clicks
      }}
    />
  )
}